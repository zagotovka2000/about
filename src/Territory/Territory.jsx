// Territory.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './territory.css';

const Territory = () => {
  // Состояние для выбранных существ (6 ячеек) - горизонтально
  const [selectedCreatures, setSelectedCreatures] = useState(Array(6).fill(null));
  // Список доступных существ из ВСЕХ файлов
  const [availableCreatures, setAvailableCreatures] = useState([]);
  // Результаты поиска
  const [searchResults, setSearchResults] = useState([]);
  // Статус поиска
  const [isSearching, setIsSearching] = useState(false);
  // Все данные из файла атаки
  const [attackData, setAttackData] = useState([]);
  // Все данные из файла защиты
  const [defenseData, setDefenseData] = useState([]);
  // Состояние для отображения нижнего контейнера
  const [showResults, setShowResults] = useState(false);
  // Модальное окно выбора существ для ячейки
  const [selectionModal, setSelectionModal] = useState({
    isOpen: false,
    cellIndex: null,
    creatureType: 'hero'
  });
  // Список существ для выбора в модальном окне
  const [selectionList, setSelectionList] = useState([]);
  // Статус загрузки данных
  const [isLoading, setIsLoading] = useState(true);
  // Настройки поиска
  const [searchSettings, setSearchSettings] = useState({
    matchType: 'partial', // 'partial' или 'exact'
    require35Points: true,
  });

  // Функция для извлечения существ из данных
  const extractCreaturesFromData = useCallback((data, creaturesSet) => {
    data.forEach(item => {
      // Проверяем поле "Атакующий"
      if (item['Атакующий'] && typeof item['Атакующий'] === 'string' && item['Атакующий'].includes('|')) {
        const parts = item['Атакующий'].split('|');
        if (parts[0] && parts[0].trim()) {
          const creatureName = parts[0].trim();
          if (!/^\d+$/.test(creatureName) && creatureName.length > 1) {
            creaturesSet.add(creatureName);
          }
        }
      }
      
      // Проверяем поле "Защищающийся"
      if (item['Защищающийся'] && typeof item['Защищающийся'] === 'string' && item['Защищающийся'].includes('|')) {
        const parts = item['Защищающийся'].split('|');
        if (parts[0] && parts[0].trim()) {
          const creatureName = parts[0].trim();
          if (!/^\d+$/.test(creatureName) && creatureName.length > 1) {
            creaturesSet.add(creatureName);
          }
        }
      }
    });
  }, []);

  // Загрузка всех JSON файлов
  const loadAllJsonFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Загружаем оба файла
      const [attackResponse, defenseResponse] = await Promise.all([
        fetch('/smBattle/pphrla1.json'),
        fetch('/smBattle/pphrla2.json')
      ]);
      
      const attackJson = await attackResponse.json();
      const defenseJson = await defenseResponse.json();
      
      console.log('Загружен файл атаки, записей:', attackJson.length);
      console.log('Загружен файл защиты, записей:', defenseJson.length);
      
      setAttackData(attackJson);
      setDefenseData(defenseJson);
      
      // Извлекаем существа из обоих файлов
      const allCreatures = new Set();
      extractCreaturesFromData(attackJson, allCreatures);
      extractCreaturesFromData(defenseJson, allCreatures);
      
      const sortedCreatures = Array.from(allCreatures).sort();
      setAvailableCreatures(sortedCreatures);
      console.log('Всего уникальных существ:', sortedCreatures.length);
      
    } catch (error) {
      console.error('Ошибка загрузки JSON файлов:', error);
    } finally {
      setIsLoading(false);
    }
  }, [extractCreaturesFromData]);

  // Инициализация - загрузка данных
  useEffect(() => {
    loadAllJsonFiles();
  }, [loadAllJsonFiles]);

  // Группировка батлов по укреплению для файла защиты
  const groupBattlesByFortification = (data) => {
    const groups = {};
    
    data.forEach(battle => {
      const fortification = battle['Укрепление'] || 'unknown';
      if (!groups[fortification]) {
        groups[fortification] = [];
      }
      groups[fortification].push(battle);
    });
    
    return groups;
  };

  // Поиск группы атаки по укреплению
  const findAttackGroupForFortification = (fortification, attackData) => {
    const group = [];
    let found = false;
    
    // Ищем все записи с таким же укреплением
    attackData.forEach(battle => {
      if (battle['Укрепление'] === fortification) {
        group.push(battle);
        found = true;
      }
    });
    
    return found ? group : null;
  };

  // Извлечение информации об атаке из группы
  const extractAttackInfo = (attackGroup) => {
    const info = {
      points: null,
      attackerName: null,
      attackingCreatures: []
    };
    
    attackGroup.forEach(row => {
      // Очки
      if (row['Очки'] && !info.points) {
        info.points = row['Очки'];
      }
      
      // Имя атакующего (в строке с очками)
      if (row['Очки'] && row['Атакующий'] && !row['Атакующий'].includes('|')) {
        info.attackerName = row['Атакующий'];
      }
      
      // Атакующие существа
      if (row['Атакующий'] && typeof row['Атакующий'] === 'string' && row['Атакующий'].includes('|')) {
        const parts = row['Атакующий'].split('|');
        const creatureName = parts[0].trim();
        info.attackingCreatures.push({
          name: creatureName,
          fullInfo: row['Атакующий']
        });
      }
    });
    
    return info;
  };

  // Извлечение имени защищающегося
  const extractDefenderName = (defenseGroup) => {
    for (const row of defenseGroup) {
      if (row['Защищающийся'] && !row['Защищающийся'].includes('|')) {
        return row['Защищающийся'];
      }
    }
    return null;
  };

  // Основная функция поиска - ИЩЕМ В ФАЙЛЕ ЗАЩИТЫ
  const handleSearch = () => {
    if (isLoading) {
      alert('Данные еще загружаются. Пожалуйста, подождите.');
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    
    // Получаем выбранных существ (без null)
    const selected = selectedCreatures.filter(creature => creature !== null);
    
    if (selected.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      alert('Выберите хотя бы одно существо для поиска.');
      return;
    }

    console.log('Ищем совпадения для:', selected);
    console.log('Настройки поиска:', searchSettings);
    
    const results = [];
    
    // Группируем данные защиты по боям
    const defenseGroups = groupBattlesByFortification(defenseData);
    console.log('Групп в защите:', Object.keys(defenseGroups).length);
    
    // Для каждой группы в защите проверяем совпадения
    Object.entries(defenseGroups).forEach(([fortification, defenseGroup]) => {
      // Ищем соответствующую группу в атаке по тому же укреплению
      const attackGroup = findAttackGroupForFortification(fortification, attackData);
      
      if (!attackGroup) {
        console.log(`Не найдена атака для укрепления: ${fortification}`);
        return;
      }
      
      // Извлекаем всех защищающихся существ из этой группы
      const defendingCreatures = [];
      const defendingCreaturesWithInfo = [];
      
      defenseGroup.forEach((row, rowIndex) => {
        const defender = row['Защищающийся'];
        if (defender && typeof defender === 'string' && defender.includes('|')) {
          const parts = defender.split('|');
          const creatureName = parts[0].trim();
          
          defendingCreatures.push(creatureName);
          defendingCreaturesWithInfo.push({
            name: creatureName,
            fullInfo: defender,
            battlePosition: rowIndex + 1,
            isSelected: selected.includes(creatureName)
          });
        }
      });
      
      // Убираем дубликаты
      const uniqueDefending = [...new Set(defendingCreatures)];
      
      // Проверяем, какие выбранные существа есть в защите
      const matchedCreatures = selected.filter(creature => 
        uniqueDefending.includes(creature)
      );
      
      if (matchedCreatures.length === 0) {
        return; // Ничего не найдено в этой группе
      }
      
      // Рассчитываем процент совпадения
      const matchPercentage = (matchedCreatures.length / selected.length) * 100;
      
      // Определяем тип совпадения
      let matchType = 'partial';
      if (matchedCreatures.length === selected.length) {
        if (selected.length === 6 && uniqueDefending.length === 6) {
          matchType = 'full_exact';
        } else if (selected.length === uniqueDefending.length) {
          matchType = 'exact_subset';
        } else {
          matchType = 'all_selected_found';
        }
      }
      
      // Если ищем только точные совпадения, а это частичное - пропускаем
      if (searchSettings.matchType === 'exact' && matchType !== 'full_exact' && matchType !== 'exact_subset') {
        return;
      }
      
      // Извлекаем информацию об атаке
      const attackInfo = extractAttackInfo(attackGroup);
      
      // Проверяем условие по очкам
      if (searchSettings.require35Points) {
        const has35Points = attackGroup.some(row => {
          if (!row['Очки']) return false;
          const points = row['Очки'].toString().trim();
          return points === '35' || points === '+35';
        });
        
        if (!has35Points) {
          return;
        }
      }
      
      // Собираем информацию о бое
      const battleInfo = {
        id: fortification,
        points: attackInfo.points || '?',
        attackerName: attackInfo.attackerName || 'Неизвестно',
        defenderName: extractDefenderName(defenseGroup) || 'Неизвестно',
        attackingCreatures: attackInfo.attackingCreatures || [],
        defendingCreatures: defendingCreaturesWithInfo,
        matchType: matchType,
        matchPercentage: matchPercentage,
        matchDetails: {
          selectedInDefense: matchedCreatures.length,
          totalSelected: selected.length,
          totalDefending: uniqueDefending.length
        },
        attackData: attackGroup,
        defenseData: defenseGroup
      };
      
      results.push(battleInfo);
    });
    
    // Сортируем результаты
    const sortedResults = results.sort((a, b) => {
      // Сначала по типу совпадения
      const typeOrder = {
        'full_exact': 1,
        'exact_subset': 2,
        'all_selected_found': 3,
        'partial': 4
      };
      
      if (typeOrder[a.matchType] !== typeOrder[b.matchType]) {
        return typeOrder[a.matchType] - typeOrder[b.matchType];
      }
      
      // Затем по проценту совпадения
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      
      return 0;
    });
    
    console.log('Найдено результатов:', sortedResults.length);
    setSearchResults(sortedResults);
    setIsSearching(false);
  };

  // Разделение существ на питомцев и героев
  const { pets, heroes } = useMemo(() => {
    const petsList = [];
    const heroesList = [];
    
    availableCreatures.forEach(creature => {
      if (creature.toLowerCase().includes('тотем')) {
        petsList.push(creature);
      } else {
        heroesList.push(creature);
      }
    });
    
    return { 
      pets: petsList.sort((a, b) => a.localeCompare(b)), 
      heroes: heroesList.sort((a, b) => a.localeCompare(b)) 
    };
  }, [availableCreatures]);

  // Обработчик клика по ячейке
  const handleCellClick = (index) => {
    if (isLoading) {
      alert('Данные еще загружаются. Пожалуйста, подождите.');
      return;
    }
    
    const creatureType = index === 0 ? 'pet' : 'hero';
    
    let availableForSelection = [];
    if (creatureType === 'pet') {
      availableForSelection = pets.filter(pet => !selectedCreatures.includes(pet));
    } else {
      availableForSelection = heroes.filter(hero => !selectedCreatures.includes(hero));
    }
    
    setSelectionList(availableForSelection);
    setSelectionModal({
      isOpen: true,
      cellIndex: index,
      creatureType
    });
  };

  // Обработчик выбора существа из модального окна
  const handleCreatureSelect = (creatureName) => {
    const newSelectedCreatures = [...selectedCreatures];
    newSelectedCreatures[selectionModal.cellIndex] = creatureName;
    setSelectedCreatures(newSelectedCreatures);
    setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' });
  };

  // Обработчик очистки ячейки
  const handleClearCell = (index) => {
    const newSelectedCreatures = [...selectedCreatures];
    newSelectedCreatures[index] = null;
    setSelectedCreatures(newSelectedCreatures);
  };

  // Очистка всех ячеек
  const clearAllCells = () => {
    setSelectedCreatures(Array(6).fill(null));
    setSearchResults([]);
    setShowResults(false);
  };

  // Получение пути к иконке
  const getIconPath = (creatureName) => {
    return `/images/${creatureName}.png`;
  };

  // Получение текста для типа совпадения
  const getMatchTypeText = (matchType, details) => {
    switch (matchType) {
      case 'full_exact':
        return `✓ Точное совпадение 6 существ`;
      case 'exact_subset':
        return `✓ Точное совпадение ${details.totalSelected} существ`;
      case 'all_selected_found':
        return `✓ Найдены все ${details.totalSelected} выбранных существ`;
      case 'partial':
        return `✓ Найдено ${details.selectedInDefense} из ${details.totalSelected} существ`;
      default:
        return 'Совпадение';
    }
  };

  // Показать предупреждение о загрузке
  if (isLoading) {
    return (
      <div className="territory-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div>Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="territory-container">
      {/* Верхний контейнер */}
      <div className="territory-upper-container">
        <h2 className="territory-title">Поиск защитных пачек</h2>
        
        {/* Настройки поиска */}
        <div className="search-settings-panel">
          <div className="settings-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={searchSettings.require35Points}
                onChange={(e) => setSearchSettings({
                  ...searchSettings,
                  require35Points: e.target.checked
                })}
              />
              Только бои с 35 очками
            </label>
            
            <div className="match-type-selector">
              <span className="setting-label">Тип поиска:</span>
              <div className="match-type-buttons">
                <button
                  className={`match-type-btn ${searchSettings.matchType === 'partial' ? 'active' : ''}`}
                  onClick={() => setSearchSettings({...searchSettings, matchType: 'partial'})}
                >
                  Частичный
                </button>
                <button
                  className={`match-type-btn ${searchSettings.matchType === 'exact' ? 'active' : ''}`}
                  onClick={() => setSearchSettings({...searchSettings, matchType: 'exact'})}
                >
                  Точный
                </button>
              </div>
            </div>
          </div>
          
          <div className="search-info">
            <div><strong>Файлы:</strong> pphrla1.json (атака), pphrla2.json (защита)</div>
            <div><strong>Выбрано:</strong> {selectedCreatures.filter(c => c).length} из 6 существ</div>
            <div>Поиск ведется в файле защиты (pphrla2.json)</div>
          </div>
        </div>
        
        {/* Горизонтальные 6 ячеек для выбранных существ */}
        <div className="selected-creatures-container">
          <div className="selected-creatures-grid">
            {selectedCreatures.map((creature, index) => (
              <div 
                key={index} 
                className={`creature-cell ${index === 0 ? 'pet-cell' : 'hero-cell'}`}
                onClick={() => handleCellClick(index)}
              >
                {creature ? (
                  <>
                    <img 
                      src={getIconPath(creature)} 
                      alt={creature}
                      className="creature-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.querySelector('.creature-name-fallback').textContent = creature;
                        e.target.parentNode.querySelector('.creature-name-fallback').style.display = 'block';
                      }}
                    />
                    <div className="creature-name">{creature}</div>
                    <div className="creature-name-fallback" style={{display: 'none'}}></div>
                    <button 
                      className="clear-cell-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCell(index);
                      }}
                    >
                      ×
                    </button>
                    <div className="cell-label">
                      {index === 0 ? 'Питомец' : `Герой ${index}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="empty-cell">
                      {index === 0 ? 'Выберите питомца' : `Выберите героя ${index}`}
                    </div>
                    <div className="cell-label">
                      {index === 0 ? 'Питомец' : `Герой ${index}`}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Кнопки управления */}
          <div className="controls-container">
            <button 
              onClick={handleSearch} 
              className="search-button"
              disabled={isSearching || selectedCreatures.every(creature => creature === null)}
            >
              {isSearching ? 'Поиск...' : 'Найти в защите'}
            </button>
            <button 
              onClick={clearAllCells} 
              className="clear-all-button"
            >
              Очистить все
            </button>
          </div>
        </div>

        {/* Информация о выбранных существах */}
        <div className="selection-info">
          <p>
            <strong>Питомец:</strong> только в первой ячейке. 
            <strong> Герои:</strong> только уникальные, без повторений в остальных ячейках.
          </p>
          <p>Доступно питомцев: {pets.length}, героев: {heroes.length}</p>
          <p><em>Поиск осуществляется в файле защиты (pphrla2.json)</em></p>
        </div>
      </div>

      {/* Модальное окно выбора существ */}
      {selectionModal.isOpen && (
        <div className="creature-selection-modal">
          <div className="creature-selection-content">
            <div className="selection-modal-header">
              <h3>
                {selectionModal.cellIndex === 0 ? 'Выберите питомца' : `Выберите героя для ячейки ${selectionModal.cellIndex}`}
                <br />
                <small>(Доступно: {selectionList.length})</small>
              </h3>
              <button 
                className="close-selection-modal"
                onClick={() => setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' })}
              >
                ×
              </button>
            </div>
            
            <div className="selection-list-container">
              {selectionList.length === 0 ? (
                <div className="no-available-creatures">
                  {selectedCreatures.filter(c => c).length === availableCreatures.length 
                    ? 'Все существа уже выбраны. Очистите некоторые ячейки.' 
                    : 'Нет доступных существ для выбора в этой категории.'}
                </div>
              ) : (
                <div className="selection-grid">
                  {selectionList.map((creature, index) => (
                    <div 
                      key={index} 
                      className="selection-item"
                      onClick={() => handleCreatureSelect(creature)}
                    >
                      <img 
                        src={getIconPath(creature)} 
                        alt={creature}
                        className="selection-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'selection-name-fallback';
                          fallback.textContent = creature;
                          fallback.style.display = 'block';
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                      <div className="selection-name">{creature}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="selection-modal-footer">
              <button 
                className="cancel-selection"
                onClick={() => setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' })}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Нижний контейнер с результатами */}
      {showResults && (
        <div className="territory-lower-container">
          <div className="results-header">
            <h3 className="results-title">
              Результаты поиска: {searchResults.length} совпадений
            </h3>
            <div className="results-summary">
              Найдено защитных пачек с выбранными существами
            </div>
          </div>
          
          {isSearching ? (
            <div className="search-loading">
              <div className="spinner"></div>
              Поиск в файле защиты...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="no-results">
              <div className="warning-icon">⚠️</div>
              <p>Ничего не найдено. Попробуйте:</p>
              <ul className="hint-list">
                <li>Выбрать других существ</li>
                <li>Отключить фильтр "Только 35 очков"</li>
                <li>Использовать частичный поиск</li>
              </ul>
              <div className="data-stats">
                <p><strong>Статистика данных:</strong></p>
                <p>Записей в атаке: {attackData.length}</p>
                <p>Записей в защите: {defenseData.length}</p>
              </div>
            </div>
          ) : (
            <div className="results-list">
              {searchResults.map((result, index) => (
                <div key={index} className={`battle-result-item ${result.matchType}`}>
                  <div className="battle-header">
                    <div className="battle-info">
                      <strong>Бой #{index + 1}:</strong> {result.id}
                    </div>
                    <div className="battle-header-right">
                      <span className="battle-points">{result.points} очков</span>
                      <span className={`match-percentage ${result.matchType}`}>
                        {result.matchPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="match-info">
                    <div className={`match-type-indicator ${result.matchType}`}>
                      {getMatchTypeText(result.matchType, result.matchDetails)}
                    </div>
                    <div className="match-details">
                      Совпадение: {result.matchDetails.selectedInDefense}/{result.matchDetails.totalSelected}
                    </div>
                  </div>
                  
                  <div className="battle-teams-container">
                    {/* Атакующая пачка */}
                    <div className="team-container attacking-team">
                      <h4 className="team-title">Атакующая пачка (pphrla1.json):</h4>
                      <div className="player-name">{result.attackerName}</div>
                      
                      <div className="creatures-list">
                        {result.attackingCreatures.map((creature, idx) => (
                          <div key={idx} className="creature-info">
                            <div className="creature-info-header">
                              <img 
                                src={getIconPath(creature.name)} 
                                alt={creature.name}
                                className="creature-info-icon"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.textContent = creature.name;
                                  fallback.style.marginLeft = '0';
                                  e.target.parentNode.appendChild(fallback);
                                }}
                              />
                              <div className="creature-info-name">{creature.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Разделитель */}
                    <div className="teams-divider">
                      <div className="vs-text">VS</div>
                    </div>
                    
                    {/* Защитная пачка */}
                    <div className="team-container defending-team">
                      <h4 className="team-title">Защитная пачка (pphrla2.json):</h4>
                      <div className="player-name">{result.defenderName}</div>
                      
                      <div className="creatures-list">
                        {result.defendingCreatures.map((creature, idx) => {
                          const isSelected = selectedCreatures.includes(creature.name);
                          return (
                            <div 
                              key={idx} 
                              className={`creature-info ${isSelected ? 'selected-creature' : ''}`}
                            >
                              <div className="creature-info-header">
                                <img 
                                  src={getIconPath(creature.name)} 
                                  alt={creature.name}
                                  className="creature-info-icon"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.textContent = creature.name;
                                    fallback.style.marginLeft = '0';
                                    e.target.parentNode.appendChild(fallback);
                                  }}
                                />
                                <div className="creature-info-name">
                                  {creature.name}
                                  {isSelected && <span className="selected-marker">✓</span>}
                                </div>
                              </div>
                              <div className="creature-position-info">
                                Позиция: {creature.battlePosition}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="battle-footer">
                    <div className="selected-summary">
                      <strong>Найдены в защите:</strong>
                      <div className="selected-creatures-list">
                        {result.defendingCreatures
                          .filter(creature => selectedCreatures.includes(creature.name))
                          .map((creature, idx) => (
                            <span key={idx} className="selected-creature-tag">
                              {creature.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Territory;
