// UnloadingWars.jsx
import React, { useState, useEffect, useMemo } from 'react';
import './UnloadingWars.css';

// Парсер TSV с поддержкой кавычек и многострочных полей
const parseTSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && !inQuotes) {
      // начало кавычек
      inQuotes = true;
      i++;
    } else if (ch === '"' && inQuotes && next === '"') {
      // экранированная кавычка внутри поля
      field += '"';
      i += 2;
    } else if (ch === '"' && inQuotes) {
      // конец кавычек
      inQuotes = false;
      i++;
    } else if ((ch === '\t' || ch === '\n') && !inQuotes) {
      // конец поля или строки
      if (ch === '\t') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      }
    } else {
      field += ch;
      i++;
    }
  }
  // последняя строка
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

// Извлечение данных атакующей пачки
const extractAttackerData = (teamString, petsString) => {
  if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
  const result = { generalPet: null, heroes: [], patronages: [] };
  try {
    const teamParts = teamString.trim().split(/\s+/);
    if (teamParts.length === 0) return result;
    result.generalPet = teamParts[0].replace(/\(\d+\)$/, '');
    result.heroes = teamParts.slice(1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
    if (petsString && petsString.trim() !== '') {
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < petParts.length) {
          result.patronages.push(petParts[i]);
        } else {
          result.patronages.push('###');
        }
      }
    } else {
      result.patronages = Array(result.heroes.length).fill('###');
    }
  } catch (error) {
    console.error('Ошибка в extractAttackerData:', error);
    result.patronages = Array(5).fill('###');
  }
  return result;
};

// Извлечение данных защитной пачки
const extractDefenderData = (teamString, petsString) => {
  if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
  const result = { generalPet: null, heroes: [], patronages: [] };
  try {
    const teamParts = teamString.trim().split(/\s+/);
    if (teamParts.length === 0) return result;
    result.generalPet = teamParts[teamParts.length - 1].replace(/\(\d+\)$/, '');
    result.heroes = teamParts.slice(0, -1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
    if (petsString && petsString.trim() !== '') {
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < petParts.length) {
          result.patronages.push(petParts[i]);
        } else {
          result.patronages.push('###');
        }
      }
    } else {
      result.patronages = Array(result.heroes.length).fill('###');
    }
  } catch (error) {
    console.error('Ошибка в extractDefenderData:', error);
    result.patronages = Array(5).fill('###');
  }
  return result;
};

const UnloadingWars = ({ fileName }) => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });

  useEffect(() => {
    if (!fileName) {
      setBattleData([]);
      return;
    }

    const fetchFileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/arrayWars/${encodeURIComponent(fileName)}`);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }
        const text = await response.text();
        processData(text);
      } catch (err) {
        setError(err.message);
        setBattleData([]);
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileName]);

  const processData = (text) => {
    const rows = parseTSV(text);
    if (rows.length < 2) {
      setBattleData([]);
      setLoading(false);
      return;
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const battles = dataRows.map(row => {
      const entry = {};
      header.forEach((key, index) => {
        entry[key] = row[index] || '';
      });
      return entry;
    }).filter(item => item['att name'] && item['att name'].trim() !== '');

    setBattleData(battles);
    setLoading(false);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...battleData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'points' || sortConfig.key === 'att power' || sortConfig.key === 'def power') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [battleData, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const renderTeamWithPatronage = (teamData) => {
    if (!teamData || !teamData.heroes) return null;

    const { heroes, patronages, generalPet } = teamData;

    return (
      <div className="team-with-patronage">
        {generalPet && (
          <div className="general-pet-section">
            <div className="general-pet-container">
              <img
                src={`/images/heroes/${generalPet}.png`}
                alt={generalPet}
                className="general-pet-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="general-pet-fallback" style={{ display: 'none' }}>
                {generalPet}
              </div>
            </div>
          </div>
        )}

        <div className="heroes-section">
          <div className="heroes-container">
            {heroes.map((hero, index) => {
              let patronImageName = patronages[index] || '###';
              patronImageName = patronImageName.replace(/\(\d+\)$/, '');

              return (
                <div key={index} className="hero-patron-container">
                  <div className="hero-with-patron">
                    <div className="hero-container">
                      <img
                        src={`/images/heroes/${hero}.png`}
                        alt={hero}
                        className="hero-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hero-fallback" style={{ display: 'none' }}>
                        {hero}
                      </div>
                    </div>
                    <div className="patronage-overlay">
                      <img
                        src={`/images/heroes/${patronImageName}.png`}
                        alt={`Патронаж: ${patronImageName}`}
                        className="patronage-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="patron-fallback" style={{ display: 'none' }}>
                        {patronImageName}
                      </div>
                    </div>
                  </div>
                  <div className="hero-name">{hero}</div>
                  {patronImageName !== '###' && (
                    <div className="patron-name">+ {patronImageName}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!fileName) return null;

  return (
    <div className="app">
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка данных...</div>}

      {!loading && !error && battleData.length > 0 && (
        <div className="table-container" role="table" aria-label="Выгрузки боёв">
          <div className="table-header" role="rowgroup">
            <div className="header-cell attacker-header" onClick={() => requestSort('att name')}>
              Атакующий{getSortIndicator('att name')}
            </div>
            <div className="header-cell defender-header" onClick={() => requestSort('def name')}>
              Защитник{getSortIndicator('def name')}
            </div>
            <div className="header-cell points-header" onClick={() => requestSort('points')}>
              Очки
            </div>
            <div className="header-cell replay-header">Ссыль</div>
          </div>

          {sortedData.map((battle, index) => {
            const attackerData = extractAttackerData(battle['att team'], battle['attacker pets']);
            const defenderData = extractDefenderData(battle['team'], battle['defender pets']);

            const points = parseInt(battle['points']) || 0;
            let pointsClass = '';
            if (points === 20) pointsClass = 'points-high';
            else if (points < 20) pointsClass = 'points-low';

            const replayKey = Object.keys(battle).find(k => k.trim().toLowerCase() === 'replay');
            const replayUrl = replayKey ? battle[replayKey] : '';

            return (
              <div key={index} className="table-row">
                <div className="table-cell attacker-cell">
                  <div className="player-info">
                    <span className="player-name" title={battle['att name']}>
                      {battle['att name']}
                    </span>
                    <span className="player-power">
                      {parseInt(battle['att power']).toLocaleString()}
                    </span>
                  </div>
                  {renderTeamWithPatronage(attackerData)}
                </div>

                <div className="table-cell defender-cell">
                  <div className="player-info">
                    <span className="player-name" title={battle['def name']}>
                      {battle['def name']}
                    </span>
                    <span className="player-power">
                      {parseInt(battle['def power']).toLocaleString()}
                    </span>
                  </div>
                  {renderTeamWithPatronage(defenderData)}
                </div>

                <div className={`table-cell points-cell ${pointsClass}`}>
                  {battle['points']}
                </div>

                <div className="table-cell replay-cell">
                  {replayUrl ? (
                    <a
                      href={replayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="replay-link"
                    >
                      бой
                    </a>
                  ) : (
                    <span className="no-replay">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && battleData.length === 0 && (
        <div className="no-data">В файле нет данных о боях.</div>
      )}
    </div>
  );
};

export default UnloadingWars;
