// War.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './War.css';

const War = () => {
  const [selectedTitans, setSelectedTitans] = useState(Array(7).fill(null));
  const [availableTitans, setAvailableTitans] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [battleData, setBattleData] = useState([]);
  const [selectionModal, setSelectionModal] = useState({
    isOpen: false,
    cellIndex: null,
  });
  const [selectionList, setSelectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Состояние для умений тотемов
  const [totemSkills, setTotemSkills] = useState([[null, null], [null, null]]);
  const [skillModal, setSkillModal] = useState({
    isOpen: false,
    totemIndex: null,
    slotIndex: null,
    group: null,
  });

  // ---------- Константы ----------
  const TITAN_TYPES = {
    light: ['Сол', 'Ияр', 'Риг', 'Амо'],
    dark: ['Тен', 'Бру', 'Мор', 'Кер'],
    water: ['Сиг', 'Тид', 'Нов', 'Маи', 'Гип'],
    fire: ['Ара', 'Мол', 'Аше', 'Игн', 'Вул'],
    wood: ['Эде', 'Анг', 'Ава', 'Сил', 'Вер']
  };

  const TYPE_TO_TOTEM = {
    light: 'С',
    dark: 'Т',
    water: 'В',
    fire: 'О',
    wood: 'Д'
  };

  const TITAN_WEIGHTS = {
    'Вер': 2,
    'Аше': 2,
    'Тид': 2
  };

  const TYPE_THRESHOLDS = {
    light: 2,
    dark: 2,
    water: 3,
    fire: 3,
    wood: 3
  };

  const SKILL_GROUPS = {
    group1: ['ПВ', 'ЛП', 'ГН', 'ТП', 'ШГ', 'ГС'],
    group2: ['ПД', 'ПР', 'ЭЭ', 'ТК', 'ЗС']
  };

  // ---------- Вспомогательные функции ----------
  const getTitanType = useCallback((titanName) => {
    for (const [type, names] of Object.entries(TITAN_TYPES)) {
      if (names.includes(titanName)) return type;
    }
    return null;
  }, []);

  const getTitanWeight = useCallback((titanName) => {
    return TITAN_WEIGHTS[titanName] || 1;
  }, []);

  const computeTotemsFromTitans = useCallback((titansArray) => {
    const typeWeight = {
      light: 0,
      dark: 0,
      water: 0,
      fire: 0,
      wood: 0
    };

    titansArray.forEach(titan => {
      if (titan) {
        const type = getTitanType(titan);
        if (type) {
          typeWeight[type] += getTitanWeight(titan);
        }
      }
    });

    const activeTypes = [];
    for (const [type, weight] of Object.entries(typeWeight)) {
      if (weight >= TYPE_THRESHOLDS[type]) {
        activeTypes.push({ type, weight });
      }
    }

    activeTypes.sort((a, b) => b.weight - a.weight);

    const totems = [null, null];
    activeTypes.slice(0, 2).forEach((item, index) => {
      totems[index] = TYPE_TO_TOTEM[item.type];
    });
    return totems;
  }, [getTitanType, getTitanWeight]);

  const resetTotemSkills = useCallback(() => {
    setTotemSkills([[null, null], [null, null]]);
  }, []);

  // ---------- Парсинг тотемов и умений ----------
  const parseTotems = useCallback((totemString) => {
    if (!totemString) return [];
    const items = totemString.replace(/,/g, ' ').split(/\s+/).filter(s => s.trim() !== '');
    return items.map(item => {
      const match = item.match(/^([A-Za-zА-Яа-я])(\d+)-(\d+)$/);
      if (match) {
        return {
          letter: match[1],
          stars: parseInt(match[2], 10),
          level: parseInt(match[3], 10)
        };
      }
      return null;
    }).filter(t => t !== null);
  }, []);

  const parseSkills = useCallback((skillString) => {
    if (!skillString) return [];
    return skillString.split(/\s+/).filter(s => s.trim() !== '').map(s => {
      const match = s.match(/^([A-Za-zА-Яа-я]{2})(\d+)$/);
      if (match) {
        return { code: match[1], rank: parseInt(match[2], 10) };
      }
      return null;
    }).filter(s => s !== null);
  }, []);

  const extractTitansFromTeam = useCallback((teamString) => {
    if (!teamString) return [];
    const matches = teamString.match(/([А-Яа-яA-Za-zЁё'-]+)\(\d+\)/g);
    if (!matches) return [];
    return matches.map(m => m.split('(')[0]);
  }, []);

  // ---------- Загрузка данных ----------
  const processFileLines = useCallback((lines, allBattles, titanSet, headers) => {
    lines.forEach((line, idx) => {
      try {
        let values = line.split(',');
        while (values.length < headers.length) {
          values.push('');
        }
        values = values.map(v => v.trim());

        const battle = {};
        headers.forEach((header, i) => {
          battle[header] = values[i] || '';
        });

        if (!battle['att team'] || !battle['team']) return;

        allBattles.push(battle);

        const attTitans = extractTitansFromTeam(battle['att team']);
        attTitans.forEach(t => titanSet.add(t));

        const defTitans = extractTitansFromTeam(battle['team']);
        defTitans.forEach(t => titanSet.add(t));

      } catch (err) {
        console.error('Ошибка парсинга строки:', err, line);
      }
    });
  }, [extractTitansFromTeam]);

  const loadAllFiles = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    const allBattles = [];
    const titanSet = new Set();
    let headers = [];

    const fileName = '/smBattleTitan/processed/all_titan_battles.csv';
    try {
      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length > 0) {
        headers = lines[0].split(',').map(h => h.trim());
        processFileLines(lines.slice(1), allBattles, titanSet, headers);
      }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setLoadError('Не удалось загрузить данные. Проверьте путь к файлу.');
    }

    const sortedTitans = Array.from(titanSet).sort((a, b) => a.localeCompare(b, 'ru'));
    setAvailableTitans(sortedTitans);
    setBattleData(allBattles);
    setIsLoading(false);
    console.log(`Загружено боёв: ${allBattles.length}, уникальных титанов: ${sortedTitans.length}`);
  }, [processFileLines]);

  useEffect(() => {
    loadAllFiles();
  }, [loadAllFiles]);

  // ---------- Поиск (с учётом умений) ----------
  const handleSearch = useCallback(() => {
    if (isLoading) {
      alert('Данные ещё загружаются. Пожалуйста, подождите.');
      return;
    }
    if (battleData.length === 0) {
      alert('Нет данных для поиска.');
      return;
    }

    const selectedTitansList = selectedTitans.slice(2).filter(t => t !== null);
    if (selectedTitansList.length === 0) {
      alert('Выберите хотя бы одного титана для поиска.');
      return;
    }

    // Собираем активные тотемы с выбранными умениями
    const activeTotems = [];
    for (let i = 0; i < 2; i++) {
      const letter = selectedTitans[i];
      if (letter) {
        const skills = totemSkills[i].filter(s => s !== null);
        activeTotems.push({ letter, skills });
      }
    }

    setHasSearched(true);
    setIsSearching(true);
    setSearchResults([]);

    const results = [];

    battleData.forEach((battle, index) => {
      try {
        const defTeamString = battle['team'];
        const defTitans = extractTitansFromTeam(defTeamString);
        const allTitansFound = selectedTitansList.every(t => defTitans.includes(t));
        if (!allTitansFound) return;

        if (activeTotems.length > 0) {
          const defTotems = parseTotems(battle['D flag/totem'] || '');
          const defSkills = parseSkills(battle['D flag desc/Totem skills'] || '');

          const defTotemsWithSkills = defTotems.map((totem, idx) => {
            const start = idx * 2;
            const totemSkills = defSkills.slice(start, start + 2).map(s => s.code);
            return { letter: totem.letter, skills: totemSkills };
          });

          let allTotemsMatch = true;
          for (const ourTotem of activeTotems) {
            const matchingDefTotem = defTotemsWithSkills.find(dt => dt.letter === ourTotem.letter);
            if (!matchingDefTotem) {
              allTotemsMatch = false;
              break;
            }
            const ourSkillsSet = new Set(ourTotem.skills);
            const defSkillsSet = new Set(matchingDefTotem.skills);
            for (const skill of ourSkillsSet) {
              if (!defSkillsSet.has(skill)) {
                allTotemsMatch = false;
                break;
              }
            }
            if (!allTotemsMatch) break;
          }
          if (!allTotemsMatch) return;
        }

        const attTeamString = battle['att team'];
        const attTitans = extractTitansFromTeam(attTeamString);

        results.push({
          id: index,
          attacker: {
            name: battle['att name'],
            power: battle['att power'],
            titans: attTitans,
          },
          defender: {
            name: battle['def name'],
            power: battle['def power'],
            titans: defTitans,
          },
          aTotem: battle['A flag/totem'] || '',
          dTotem: battle['D flag/totem'] || '',
          aTotemDesc: battle['A flag desc/Totem skills'] || '',
          dTotemDesc: battle['D flag desc/Totem skills'] || '',
          replay: battle['replay'] || '',
        });
      } catch (err) {
        console.error(`Ошибка обработки боя ${index}:`, err);
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [battleData, isLoading, selectedTitans, totemSkills, extractTitansFromTeam, parseTotems, parseSkills]);

  // ---------- Работа с выбором титанов ----------
  const availableForSelection = useMemo(() => {
    const selected = selectedTitans.slice(2).filter(t => t !== null);
    return availableTitans.filter(t => !selected.includes(t));
  }, [availableTitans, selectedTitans]);

  const handleCellClick = useCallback((index) => {
    if (isLoading) {
      alert('Данные ещё загружаются.');
      return;
    }
    if (index < 2) return;
    setSelectionList(availableForSelection);
    setSelectionModal({ isOpen: true, cellIndex: index });
  }, [isLoading, availableForSelection]);

  const handleTitanSelect = useCallback((titanName) => {
    const newSelected = [...selectedTitans];
    newSelected[selectionModal.cellIndex] = titanName;

    const titans = newSelected.slice(2);
    const [totem0, totem1] = computeTotemsFromTitans(titans);
    newSelected[0] = totem0;
    newSelected[1] = totem1;

    setSelectedTitans(newSelected);
    resetTotemSkills();
    setSelectionModal({ isOpen: false, cellIndex: null });
  }, [selectedTitans, selectionModal.cellIndex, computeTotemsFromTitans, resetTotemSkills]);

  const handleClearCell = useCallback((index) => {
    if (index < 2) return;
    const newSelected = [...selectedTitans];
    newSelected[index] = null;

    const titans = newSelected.slice(2);
    const [totem0, totem1] = computeTotemsFromTitans(titans);
    newSelected[0] = totem0;
    newSelected[1] = totem1;

    setSelectedTitans(newSelected);
    resetTotemSkills();
  }, [selectedTitans, computeTotemsFromTitans, resetTotemSkills]);

  const clearAllTitans = useCallback(() => {
    const newSelected = [...selectedTitans];
    for (let i = 2; i < newSelected.length; i++) {
      newSelected[i] = null;
    }

    const titans = newSelected.slice(2);
    const [totem0, totem1] = computeTotemsFromTitans(titans);
    newSelected[0] = totem0;
    newSelected[1] = totem1;

    setSelectedTitans(newSelected);
    resetTotemSkills();
    setHasSearched(false);
    setSearchResults([]);
  }, [selectedTitans, computeTotemsFromTitans, resetTotemSkills]);

  // ---------- Работа с умениями тотемов ----------
  const handleSkillSlotClick = useCallback((totemIndex, slotIndex) => {
    if (!selectedTitans[totemIndex]) return;
    const group = slotIndex === 0 ? 'group1' : 'group2';
    setSkillModal({
      isOpen: true,
      totemIndex,
      slotIndex,
      group,
    });
  }, [selectedTitans]);

  const handleSkillSelect = useCallback((skillCode) => {
    const { totemIndex, slotIndex } = skillModal;
    const newTotemSkills = [...totemSkills];
    newTotemSkills[totemIndex][slotIndex] = skillCode;
    setTotemSkills(newTotemSkills);
    setSkillModal({ isOpen: false, totemIndex: null, slotIndex: null, group: null });
  }, [skillModal, totemSkills]);

  const handleSkillModalClose = useCallback(() => {
    setSkillModal({ isOpen: false, totemIndex: null, slotIndex: null, group: null });
  }, []);

  // ---------- Рендер команды титанов (для результатов) ----------
  const renderTitansTeam = useCallback((titans) => {
    return (
      <div className="titans-container">
        {titans.map((titan, idx) => (
          <div key={idx} className="titan-item">
            <img
              src={`/images/titans/${titan}.png`}
              alt={titan}
              className="titan-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="titan-fallback" style={{ display: 'none' }}>{titan}</div>
            <div className="titan-name">{titan}</div>
          </div>
        ))}
      </div>
    );
  }, []);

  // Рендер тотемов в результатах поиска (без изменений, но используем useCallback с зависимостями)
  const renderTotems = useCallback((totemString, skillString, side) => {
    const totems = parseTotems(totemString);
    const skills = parseSkills(skillString);
    if (totems.length === 0 && skills.length === 0) return null;

    const totemsWithSkills = totems.map((totem, index) => {
      const start = index * 2;
      const totemSkills = skills.slice(start, start + 2);
      return { ...totem, skills: totemSkills };
    });

    const renderSkill = (skill, position) => {
      if (!skill) return null;
      const { code, rank } = skill;
      return (
        <div className={`skill-wrapper skill-${position}`} key={code + rank}>
          <img
            src={`/images/totems/${code}.png`}
            alt={code}
            className="skill-icon"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="skill-rank">{rank}</span>
        </div>
      );
    };

    return (
      <div className="totems-section">
        <div className="totems-list">
          {totemsWithSkills.map((totem, idx) => (
            <div key={idx} className="totem-with-skills" data-side={side}>
              {side === 'defense' && totem.skills.length > 0 && (
                <div className="skills-left">
                  {totem.skills.map(skill => renderSkill(skill, 'left'))}
                </div>
              )}
              <div className="totem-icon-wrapper">
                <img
                  src={`/images/totems/${totem.letter}.png`}
                  alt={`Тотем ${totem.letter}`}
                  className="totem-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="totem-fallback" style={{ display: 'none' }}>{totem.letter}</div>
                <div className="totem-level-badge">{totem.level}</div>
                <div className="totem-stars">
                  {totem.stars === 6 ? (
                    <img src="/images/totems/abs.png" alt="max" className="star-icon star-icon-max" />
                  ) : (
                    Array.from({ length: totem.stars }).map((_, i) => (
                      <img key={i} src="/images/totems/zvezda.png" alt="star" className="star-icon" />
                    ))
                  )}
                </div>
              </div>
              {side === 'attack' && totem.skills.length > 0 && (
                <div className="skills-right">
                  {totem.skills.map(skill => renderSkill(skill, 'right'))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }, [parseTotems, parseSkills]);

  // ---------- Рендер ----------
  if (isLoading) {
    return (
      <div className="war-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div>Загрузка данных о битвах титанов...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="war-container">
        <div className="error-message">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="war-container">
      <div className="war-upper-container">
        <h2 className="war-title">Подбор пачек титанов</h2>

        <div className="data-info">
          <p>Загружено боёв: {battleData.length}</p>
        </div>

        {/* 7 ячеек */}
        <div className="selected-titans-container">
          <div className="selected-titans-grid">
            {selectedTitans.map((creature, index) => {
              const isTotem = index < 2;
              return (
                <div
                  key={index}
                  className={`titan-cell ${isTotem ? 'totem-cell' : 'titan-cell-active'} ${creature ? 'filled' : 'empty'}`}
                  onClick={() => !isTotem && handleCellClick(index)}
                >
                  {creature ? (
                    <>
                      <img
                        src={`/images/${isTotem ? 'totems' : 'titans'}/${creature}.png`}
                        alt={creature}
                        className="titan-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div className="titan-fallback" style={{ display: 'none' }}>{creature}</div>
                     
                      {!isTotem && (
                        <button
                          className="clear-cell-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearCell(index);
                          }}
                        >
                          ×
                        </button>
                      )}
                      {isTotem && (
                        <div className="totem-skills-container">
                          {[0, 1].map(slotIdx => (
                            <div
                              key={slotIdx}
                              className={`totem-skill-slot ${totemSkills[index][slotIdx] ? 'filled' : 'empty'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSkillSlotClick(index, slotIdx);
                              }}
                            >
                              {totemSkills[index][slotIdx] ? (
                                <img
                                  src={`/images/totems/${totemSkills[index][slotIdx]}.png`}
                                  alt={totemSkills[index][slotIdx]}
                                  className="skill-icon"
                                />
                              ) : (
                                <span>+</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-cell">
                      {isTotem ? 'Тотем' : `Титан ${index - 1}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="controls-container">
            <button
              onClick={handleSearch}
              className="search-button"
              disabled={isSearching || selectedTitans.slice(2).every(t => t === null)}
            >
              {isSearching ? 'Поиск...' : 'Найти победные пачки'}
            </button>
            <button onClick={clearAllTitans} className="clear-all-button">
              Очистить титанов
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно выбора титана */}
      {selectionModal.isOpen && (
        <div className="titan-selection-modal">
          <div className="titan-selection-content">
            <div className="selection-modal-header">
              <h3>
                Выберите титана для ячейки {selectionModal.cellIndex - 1}
                <br />
                <small>Доступно: {selectionList.length}</small>
              </h3>
              <button
                className="close-selection-modal"
                onClick={() => setSelectionModal({ isOpen: false, cellIndex: null })}
              >
                ×
              </button>
            </div>

            <div className="selection-list-container">
              {selectionList.length === 0 ? (
                <div className="no-available-creatures">Нет доступных титанов</div>
              ) : (
                <div className="selection-grid">
                  {selectionList.map((titan, idx) => (
                    <div
                      key={idx}
                      className="selection-item"
                      onClick={() => handleTitanSelect(titan)}
                    >
                      <img
                        src={`/images/titans/${titan}.png`}
                        alt={titan}
                        className="selection-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div className="selection-fallback" style={{ display: 'none' }}>{titan}</div>
                      <div className="selection-name">{titan}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="selection-modal-footer">
              <button
                className="cancel-selection"
                onClick={() => setSelectionModal({ isOpen: false, cellIndex: null })}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора умения тотема */}
      {skillModal.isOpen && (
        <div className="skill-selection-modal">
          <div className="skill-selection-content">
            <div className="selection-modal-header">
              <h3>Выберите умение</h3>
              <button className="close-selection-modal" onClick={handleSkillModalClose}>×</button>
            </div>
            <div className="selection-list-container">
              <div className="selection-grid">
                {SKILL_GROUPS[skillModal.group].map(skillCode => (
                  <div
                    key={skillCode}
                    className="selection-item"
                    onClick={() => handleSkillSelect(skillCode)}
                  >
                    <img
                      src={`/images/totems/${skillCode}.png`}
                      alt={skillCode}
                      className="selection-image"
                    />
                    <div className="selection-name">{skillCode}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="selection-modal-footer">
              <button className="cancel-selection" onClick={handleSkillModalClose}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      {hasSearched && !isSearching && searchResults.length === 0 ? (
        <div className="war-lower-container no-results">
          <div className="no-results-message">ТАКОГО ГАВНА ПОКА НЕ ОБНАРУЖЕНО В НАШЕЙ БАЗЕ</div>
        </div>
      ) : searchResults.length > 0 && (
        <div className="war-lower-container">
          <div className="results-header">
            <h3 className="results-title">
              Победивший в атаке ← Найдено {searchResults.length} боёв → Проигравший в обороне
            </h3>
          </div>

          <div className="results-list">
            {searchResults.map((result, idx) => (
              <div key={idx} className="battle-result-item">
                <div className="battle-teams-container">
                  <div className="team-container attacking-team">
                    <div className="team-header">
                      <span className="player-name">{result.attacker.name}</span>
                      <span className="player-power">{result.attacker.power}</span>
                    </div>
                    {renderTitansTeam(result.attacker.titans)}
                    {renderTotems(result.aTotem, result.aTotemDesc, 'attack')}
                  </div>

                  <div className="teams-divider">
                    <div className="vs-text">VS</div>
                  </div>

                  <div className="team-container defending-team">
                    <div className="team-header">
                      <span className="player-name">{result.defender.name}</span>
                      <span className="player-power">{result.defender.power}</span>
                    </div>
                    {renderTitansTeam(result.defender.titans)}
                    {renderTotems(result.dTotem, result.dTotemDesc, 'defense')}
                  </div>
                </div>


              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default War;
