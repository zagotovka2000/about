// src/SmPlan.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SmPlan.css';
import Modal from '../components/Modal/Modal';

const JSONBOX_API_KEY = '2193e01ad5b9bf528a0dc93d87ece0db';
const JSONBOX_API_URL = 'https://jsonbox.ru/api.php';

const fetchPlanData = async () => {
  try {
    const url = `${JSONBOX_API_URL}?action=get&api_key=${JSONBOX_API_KEY}`;
    const response = await fetch(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result && typeof result === 'object' && !Array.isArray(result) && result.data !== undefined) {
      return result.data;
    }
    if (Array.isArray(result)) return result;
    return null;
  } catch (err) {
    console.error('Ошибка загрузки из JsonBox:', err);
    return null;
  }
};

const savePlanData = async (newData) => {
  try {
    const existingData = await fetchPlanData();
    
    let dataToSave;
    if (existingData && typeof existingData === 'object') {
      dataToSave = {
        ...existingData,
        ...newData,
        history: newData.history || existingData.history || []
      };
    } else {
      dataToSave = newData;
    }
    
    const url = `${JSONBOX_API_URL}?action=store`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: JSONBOX_API_KEY,
        data: dataToSave
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Ошибка сохранения в JsonBox:', err);
    throw err;
  }
};

const SmPlan = () => {
  const MY_GUILD_NAME = '[М]О]Н[О]Л[И[Т]';
  const POINTS_WIN_BONUS = 750;
  const POINTS_DRAW = 375;
  
  // Начальные значения для нового сезона
  const INITIAL_POINTS = 4566;
  const INITIAL_GAMES_LEFT = 24;
  const INITIAL_GAMES_PLAYED = 0;
  
  const [currentPoints, setCurrentPoints] = useState(INITIAL_POINTS);
  const [targetPoints, setTargetPoints] = useState(19500);
  const [gamesLeft, setGamesLeft] = useState(INITIAL_GAMES_LEFT);
  const [gamesPlayed, setGamesPlayed] = useState(INITIAL_GAMES_PLAYED);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isSavingRef = useRef(false);

  const [showModal, setShowModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const [enemyGuild, setEnemyGuild] = useState('');
  const [myScore, setMyScore] = useState('');
  const [enemyScore, setEnemyScore] = useState('');

  const pointsNeeded = targetPoints - currentPoints;

  const calculateMatchPoints = (myScoreNum, enemyScoreNum) => {
    const diff = myScoreNum - enemyScoreNum;
    const basePoints = diff / 10;
    
    if (diff === 0) {
      return {
        points: POINTS_DRAW,
        diff: diff,
        basePoints: basePoints,
        bonus: 0,
        type: 'draw',
        display: `+${POINTS_DRAW} (ничья)`
      };
    } else if (diff > 0) {
      const totalPoints = basePoints + POINTS_WIN_BONUS;
      return {
        points: totalPoints,
        diff: diff,
        basePoints: basePoints,
        bonus: POINTS_WIN_BONUS,
        type: 'win',
        display: `+${totalPoints} (победа)`
      };
    } else {
      return {
        points: basePoints,
        diff: diff,
        basePoints: basePoints,
        bonus: 0,
        type: 'loss',
        display: `${basePoints} (поражение)`
      };
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlanData();
      
      if (data) {
        setCurrentPoints(data.currentPoints !== undefined ? Math.round(data.currentPoints) : INITIAL_POINTS);
        setTargetPoints(data.targetPoints !== undefined ? Math.round(data.targetPoints) : 19500);
        setGamesLeft(data.gamesLeft !== undefined ? Math.round(data.gamesLeft) : INITIAL_GAMES_LEFT);
        setGamesPlayed(data.gamesPlayed !== undefined ? Math.round(data.gamesPlayed) : INITIAL_GAMES_PLAYED);
        setHistory(data.history || []);
      }
      setIsInitialized(true);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные');
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const saveData = useCallback(async (showNotification = false) => {
    if (isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      setSaving(true);
      setError(null);
      
      const data = {
        currentPoints: Math.round(currentPoints),
        targetPoints: Math.round(targetPoints),
        gamesLeft: Math.round(gamesLeft),
        gamesPlayed: Math.round(gamesPlayed),
        history,
        lastUpdated: new Date().toISOString()
      };
      
      await savePlanData(data);
      
      if (showNotification) {
        setSuccessMsg('✅ Данные сохранены');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      if (showNotification) {
        setError('❌ Не удалось сохранить данные');
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [currentPoints, targetPoints, gamesLeft, gamesPlayed, history]);

  // Функция сброса сезона
  const handleResetSeason = async () => {
    try {
      setSaving(true);
      const newData = {
        currentPoints: INITIAL_POINTS,
        targetPoints: 19500,
        gamesLeft: INITIAL_GAMES_LEFT,
        gamesPlayed: INITIAL_GAMES_PLAYED,
        history: [],
        lastUpdated: new Date().toISOString()
      };
      
      await savePlanData(newData);
      
      // Обновляем состояние
      setCurrentPoints(INITIAL_POINTS);
      setTargetPoints(19500);
      setGamesLeft(INITIAL_GAMES_LEFT);
      setGamesPlayed(INITIAL_GAMES_PLAYED);
      setHistory([]);
      
      setShowResetModal(false);
      setSuccessMsg('✅ Сезон сброшен!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Ошибка сброса:', err);
      setError('❌ Не удалось сбросить сезон');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const saveTimeout = setTimeout(() => {
        saveData(false);
      }, 3000);
      return () => clearTimeout(saveTimeout);
    }
  }, [saveData, isInitialized]);

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (!entryToDelete) return;
    
    const newHistory = history.filter(item => item.id !== entryToDelete.id);
    setHistory(newHistory);
    setCurrentPoints(Math.round(currentPoints - entryToDelete.points));
    setGamesPlayed(Math.round(gamesPlayed - 1));
    setGamesLeft(Math.round(gamesLeft + 1));
    
    setShowModal(false);
    setEntryToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setEntryToDelete(null);
  };

  const handleAddMatch = () => {
    if (!enemyGuild.trim()) {
      alert('Пожалуйста, введите название гильдии уёбков');
      return;
    }
    const myScoreNum = parseInt(myScore);
    const enemyScoreNum = parseInt(enemyScore);
    if (isNaN(myScoreNum) || isNaN(enemyScoreNum)) {
      alert('Пожалуйста, введите корректные значения счета');
      return;
    }
    if (myScoreNum < 0 || enemyScoreNum < 0) {
      alert('Счет не может быть отрицательным');
      return;
    }

    if (gamesLeft <= 0) {
      alert('Все игры уже сыграны!');
      return;
    }

    const result = calculateMatchPoints(myScoreNum, enemyScoreNum);
    
    const newHistory = [...history, {
      id: Date.now(),
      game: Math.round(gamesPlayed + 1),
      points: Math.round(result.points),
      myGuild: MY_GUILD_NAME,
      enemyGuild: enemyGuild.trim(),
      myScore: myScoreNum,
      enemyScore: enemyScoreNum,
      scoreDisplay: `${myScoreNum}-${enemyScoreNum}`,
      timestamp: new Date().toLocaleString(),
      type: 'match',
      matchResult: result
    }];

    setHistory(newHistory);
    setCurrentPoints(Math.round(currentPoints + result.points));
    setGamesPlayed(Math.round(gamesPlayed + 1));
    setGamesLeft(Math.round(gamesLeft - 1));
    
    setEnemyGuild('');
    setMyScore('');
    setEnemyScore('');
  };

  const handleManualSave = async () => {
    await saveData(true);
  };

  if (loading) {
    return (
      <div className="sm-plan-container">
        <div className="loading-container">
          <h2>📊 Планировщик "Столкновение Миров"</h2>
          <div className="loading-spinner">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-plan-container">
      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}
      
      <div className="plan-header">
        <h2>📊 Планировщик "Столкновение Миров"</h2>
        <div className="header-controls">
          <button onClick={handleManualSave} className="save-btn-header" disabled={saving}>
            {saving ? '💾 Сохранение...' : '💾 Сохранить'}
          </button>
          <button onClick={() => setShowResetModal(true)} className="reset-btn-header" disabled={saving}>
            🔄 Сброс сезона
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Текущие очки</div>
          <div className="stat-value">{Math.round(currentPoints)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Цель</div>
          <div className="stat-value">{Math.round(targetPoints)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Осталось очков</div>
          <div className="stat-value" style={{ color: pointsNeeded > 0 ? '#ff6b6b' : '#51cf66' }}>
            {pointsNeeded > 0 ? `+${Math.round(pointsNeeded)}` : Math.round(pointsNeeded)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Осталось игр</div>
          <div className="stat-value">{Math.round(gamesLeft)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Сыграно игр</div>
          <div className="stat-value">{Math.round(gamesPlayed)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Среднее за игру</div>
          <div className="stat-value">{gamesLeft > 0 ? Math.round(pointsNeeded / gamesLeft) : 0}</div>
        </div>
      </div>

      <div className="match-input-section">
        <div className="match-input-grid">
          <div className="match-input-group">
            <div className="guild-name-display">{MY_GUILD_NAME}</div>
          </div>
          <div className="match-input-group">
            <input
              type="number"
              value={myScore}
              onChange={(e) => setMyScore(e.target.value)}
              placeholder="Очки"
              className="match-input score-input"
              min="0"
            />
          </div>
          <div className="match-input-group">
            <input
              type="number"
              value={enemyScore}
              onChange={(e) => setEnemyScore(e.target.value)}
              placeholder="Очки"
              className="match-input score-input"
              min="0"
            />
          </div>
          <div className="match-input-group">
            <input
              type="text"
              value={enemyGuild}
              onChange={(e) => setEnemyGuild(e.target.value)}
              placeholder="Название гильдии уёбков"
              className="match-input"
            />
          </div>
          <button onClick={handleAddMatch} className="btn-add-match">
            ⚔️ Добавить
          </button>
        </div>
      </div>

      <div className="history-section">
        <h3>📜 История игр</h3>
        {history.length === 0 ? (
          <div className="empty-history">Нет записей</div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-game">Игра #{item.game}</span>
                {item.type === 'match' && (
                  <>
                    <div className="history-match">
                      <span className="guild-name my-guild">{item.myGuild}</span>
                      <span className="match-score">{item.myScore}</span>
                      <span className="match-separator">-</span>
                      <span className="match-score">{item.enemyScore}</span>
                      <span className="guild-name enemy-guild">{item.enemyGuild}</span>
                    </div>
                    <div className="match-result">
                      <span className={`history-points ${item.points >= 0 ? 'positive' : 'negative'}`}>
                        {item.points >= 0 ? '+' : ''}{Math.round(item.points)}
                      </span>
                      <span className="match-type">
                        {item.matchResult?.type === 'win' && '🏆 Победа'}
                        {item.matchResult?.type === 'draw' && '🤝 Ничья'}
                        {item.matchResult?.type === 'loss' && '💔 Поражение'}
                      </span>
                    </div>
                  </>
                )}
                <span className="history-time">{item.timestamp}</span>
                <button 
                  onClick={() => handleDeleteClick(item)}
                  className="btn-delete"
                  title="Удалить запись"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно для удаления записи */}
      <Modal 
        isOpen={showModal} 
        onClose={handleCancelDelete}
        title="⚠️ Подтверждение удаления"
      >
        <div className="modal-delete-content">
          <p>Вы уверены, что хотите удалить эту запись?</p>
          
          <div className="modal-entry-preview">
            <div className="preview-item">
              <span className="preview-label">Игра:</span>
              <span className="preview-value">#{entryToDelete?.game}</span>
            </div>
            {entryToDelete?.type === 'match' && (
              <>
                <div className="preview-item">
                  <span className="preview-label">Матч:</span>
                  <span className="preview-value match-preview">
                    {entryToDelete.myGuild} {entryToDelete.myScore} - {entryToDelete.enemyScore} {entryToDelete.enemyGuild}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Результат:</span>
                  <span className={`preview-value ${entryToDelete.points >= 0 ? 'positive' : 'negative'}`}>
                    {entryToDelete.points >= 0 ? '+' : ''}{Math.round(entryToDelete.points)}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Тип:</span>
                  <span className="preview-value">
                    {entryToDelete.matchResult?.type === 'win' && '🏆 Победа'}
                    {entryToDelete.matchResult?.type === 'draw' && '🤝 Ничья'}
                    {entryToDelete.matchResult?.type === 'loss' && '💔 Поражение'}
                  </span>
                </div>
              </>
            )}
            <div className="preview-item">
              <span className="preview-label">Дата:</span>
              <span className="preview-value">{entryToDelete?.timestamp}</span>
            </div>
          </div>
          
          <p className="modal-warning">⚠️ Это действие нельзя отменить!</p>
          
          <div className="modal-delete-actions">
            <button className="modal-btn-cancel" onClick={handleCancelDelete}>
              Отмена
            </button>
            <button className="modal-btn-confirm" onClick={handleConfirmDelete}>
              Удалить
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно для сброса сезона */}
      <Modal 
        isOpen={showResetModal} 
        onClose={() => setShowResetModal(false)}
        title="🔄 Сброс сезона"
      >
        <div className="modal-delete-content">
          <p>⚠️ Вы уверены, что хотите сбросить сезон?</p>
          <p>Это действие:</p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li>🗑️ Удалит всю историю игр</li>
            <li>📊 Сбросит очки на {INITIAL_POINTS}</li>
            <li>🎮 Установит {INITIAL_GAMES_LEFT} оставшихся игр</li>
            <li>🔄 Вернет все к началу сезона</li>
          </ul>
          <p className="modal-warning">⚠️ Это действие нельзя отменить!</p>
          
          <div className="modal-delete-actions">
            <button className="modal-btn-cancel" onClick={() => setShowResetModal(false)}>
              Отмена
            </button>
            <button className="modal-btn-confirm" onClick={handleResetSeason} disabled={saving}>
              {saving ? 'Сброс...' : '✅ Сбросить сезон'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SmPlan;
