import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './WeekData.css';

const damageOptions = [
  { label: '0', value: 0 },
  { label: '50 000', value: 50000 },
  { label: '100 000', value: 100000 },
  { label: '200 000', value: 200000 },
  { label: '300 000', value: 300000 },
  { label: '400 000', value: 400000 },
  { label: '500 000', value: 500000 },
  { label: '1 000 000', value: 1000000 },
  { label: '5 000 000', value: 5000000 },
  { label: '10 000 000', value: 10000000 },
  { label: '15 000 000', value: 15000000 },
  { label: '25 000 000', value: 25000000 },
  { label: '50 000 000', value: 50000000 },
  { label: '100 000 000', value: 100000000 },
  { label: '200 000 000', value: 200000000 },
  { label: '300 000 000', value: 300000000 },
  { label: '500 000 000', value: 500000000 },
  { label: 'свыше 500 000 000', value: Infinity },
];

const PATRONS = ['Акс','Аль','Век','Каи','Мар','Мер','Оли','Хор','Фен','Бис'];

// Определяем тип недели по номеру: нечётные – Маэстро, чётные – Ош
const getWeekType = (weekNumber) => (weekNumber % 2 === 0 ? 'osh' : 'maestro');

const WeekData = ({ weekNumber }) => {
  const [allBattles, setAllBattles] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWeekLoading, setIsWeekLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'damage', direction: 'desc' });

  // Фильтры для глобального поиска (используются и кнопкой "Найти", и поиском пака)
  const [globalWeekType, setGlobalWeekType] = useState('all'); // 'all', 'osh', 'maestro'

  // Временные значения для формы фильтров (пока не нажали "Найти")
  const [tempLevel, setTempLevel] = useState('all');
  const [tempDamageFrom, setTempDamageFrom] = useState(0);
  const [tempDamageTo, setTempDamageTo] = useState(500000000);
  const [tempWeekType, setTempWeekType] = useState('all');

  // Состояния для поиска по команде (пак)
  const [selectedCreatures, setSelectedCreatures] = useState(Array(6).fill(null));
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionModalData, setSelectionModalData] = useState({
    cellIndex: null,
    creatureType: 'hero',
  });
  const [availableHeroes, setAvailableHeroes] = useState([]);

  // Загрузка всех файлов недель
  useEffect(() => {
    const weeksConfig = [
      { number: 27, label: 'Маэстро 01.02.2026' },
      { number: 28, label: 'Ош 07.02.2026' },
      { number: 29, label: 'Маэстро 15.02.2026' },
      { number: 30, label: 'Ош 22.02.2026' },
      { number: 31, label: 'Маэстро 02.03.2026' },
      { number: 32, label: 'Ош 09.03.2026' },
      { number: 33, label: 'Маэстро 15.03.2026' },
    ];

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const allData = [];
        for (const week of weeksConfig) {
          const response = await fetch(`/weeks/week${week.number}.txt`);
          if (!response.ok) {
            console.error(`Не удалось загрузить неделю ${week.number}`);
            continue;
          }
          const text = await response.text();
          const parsed = processTextData(text, week.number);
          console.log(`Неделя ${week.number}: загружено ${parsed.length} записей`);
          allData.push(...parsed);
        }
        console.log(`Всего загружено записей: ${allData.length}`);
        setAllBattles(allData);
        const heroesSet = new Set();
        allData.forEach(battle => {
          const team = battle.attackerTeam;
          if (team) {
            const heroNames = team.split(' ').slice(1).map(part => part.split('(')[0]);
            heroNames.forEach(name => {
              if (!PATRONS.includes(name)) heroesSet.add(name);
            });
          }
        });
        setAvailableHeroes(Array.from(heroesSet).sort());
        console.log(`Уникальных героев: ${heroesSet.size}`);
      } catch (error) {
        console.error('Ошибка загрузки всех данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const processTextData = (text, sourceWeek) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line) => {
      const columns = line.split('\t');
      return {
        dateTime: columns[0],
        level: columns[1],
        week: columns[2],
        attackerId: columns[3],
        attackerName: columns[4],
        attackerPower: columns[5],
        attackerTeam: columns[6],
        damage: parseInt(columns[7], 10),
        attackerPatronage: columns[8],
        replay: columns[9],
        sourceWeek: sourceWeek,
      };
    }).filter(item => {
      return item.attackerName !== "att name" &&
             item.attackerName.trim() !== "" &&
             !isNaN(item.damage) &&
             item.replay !== "бой";
    });
  };

  // Обновление данных при смене недели
  useEffect(() => {
    if (allBattles.length === 0) return;
    setIsWeekLoading(true);
    const weekNum = Number(weekNumber);
    const filtered = allBattles.filter(b => b.sourceWeek === weekNum);
    console.log(`Неделя ${weekNum}: отфильтровано ${filtered.length} записей`);
    setWeekData(filtered);
    setIsWeekLoading(false);
    setSearchMode(false);
    setSearchResults([]);
  }, [weekNumber, allBattles]);

  // Поиск по составу команды (пак)
  const performTeamSearch = useCallback(() => {
    const selectedPet = selectedCreatures[0];
    const selectedHeroes = selectedCreatures.slice(1).filter(h => h !== null);

    if (selectedHeroes.length === 0 && !selectedPet) {
      alert('Выберите хотя бы одного героя или питомца для поиска.');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    // Фильтруем все бои по типу недели (если выбран)
    let filteredBattles = allBattles;
    if (globalWeekType !== 'all') {
      filteredBattles = filteredBattles.filter(battle => getWeekType(battle.sourceWeek) === globalWeekType);
    }

    const results = [];
    for (const battle of filteredBattles) {
      const teamString = battle.attackerTeam;
      if (!teamString) continue;

      const teamParts = teamString.trim().split(/\s+/);
      if (teamParts.length === 0) continue;

      const generalPet = teamParts[0].split('(')[0];
      if (selectedPet && generalPet !== selectedPet) continue;

      const heroes = teamParts.slice(1).map(part => part.split('(')[0]);
      const allHeroesFound = selectedHeroes.every(hero => heroes.includes(hero));
      if (selectedHeroes.length > 0 && !allHeroesFound) continue;

      results.push(battle);
    }

    setSearchResults(results);
    setSearchMode(true);
    setIsSearching(false);
  }, [allBattles, selectedCreatures, globalWeekType]);

  // Применение фильтров из формы (копируем временные значения в реальные и запускаем поиск)
  const applyFilters = () => {
    const newLevel = tempLevel;
    const newDamageFrom = tempDamageFrom;
    const newDamageTo = tempDamageTo;
    const newWeekType = tempWeekType;

    setIsSearching(true);
    let filtered = allBattles;

    if (newWeekType !== 'all') {
      filtered = filtered.filter(battle => getWeekType(battle.sourceWeek) === newWeekType);
    }
    if (newLevel !== 'all') {
      filtered = filtered.filter(battle => battle.level === newLevel);
    }
    filtered = filtered.filter(battle => battle.damage >= newDamageFrom);
    if (isFinite(newDamageTo)) {
      filtered = filtered.filter(battle => battle.damage <= newDamageTo);
    }

    setSearchResults(filtered);
    setSearchMode(true);
    setIsSearching(false);
    setGlobalWeekType(newWeekType);
  };

  const resetFilters = () => {
    setTempLevel('all');
    setTempDamageFrom(0);
    setTempDamageTo(500000000);
    setTempWeekType('all');
    setGlobalWeekType('all');
    setSearchMode(false);
    setSearchResults([]);
  };

  const resetTeamSearch = () => {
    setSelectedCreatures(Array(6).fill(null));
    setSearchMode(false);
    setSearchResults([]);
  };

  const handleOpenSelectionModal = (index) => {
    const creatureType = index === 0 ? 'pet' : 'hero';
    setSelectionModalData({ cellIndex: index, creatureType });
    setShowSelectionModal(true);
  };

  const handleSelectCreature = (creature) => {
    const newSelected = [...selectedCreatures];
    newSelected[selectionModalData.cellIndex] = creature;
    setSelectedCreatures(newSelected);
    setShowSelectionModal(false);
  };

  const handleClearCell = (index) => {
    const newSelected = [...selectedCreatures];
    newSelected[index] = null;
    setSelectedCreatures(newSelected);
    if (searchMode) {
      performTeamSearch();
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Данные для отображения: либо результаты поиска, либо данные текущей недели
  const displayData = useMemo(() => {
    const source = searchMode ? searchResults : weekData;
    let filtered = source;

    // Применяем сортировку
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [searchMode, searchResults, weekData, sortConfig]);

  const extractPatronagePairs = (patronageString) => {
    if (!patronageString) return [];
    const tokens = patronageString.split(/\s+/).filter(token => token.length > 0);
    return tokens.map(token => {
      const match = token.match(/^([^(]+)\((\d+)\)$/);
      if (match) {
        return { hero: match[1], power: match[2] };
      } else {
        return { hero: token, power: null };
      }
    });
  };

  const renderTeamWithPatronage = (teamString, patronageString) => {
    if (!teamString) return null;
    const heroes = teamString.split(' ').filter(Boolean);
    const patronagePairs = extractPatronagePairs(patronageString);
    return (
      <div className="team-with-patronage">
        {heroes.map((heroWithLevel, index) => {
          const heroName = heroWithLevel.split('(')[0].trim();
          if (index === 0) {
            return (
              <div key={index} className="hero-container">
                <img 
                  src={`/images/heroes/${heroName}.png`}
                  alt={heroName}
                  title={heroWithLevel}
                  className="hero-image"
                  onError={(e) => {
                    console.error(`Failed to load image: /images/heroes/${heroName}.png`);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          }
          const patronPair = patronagePairs[index - 1];
          const patron = patronPair ? patronPair.hero : null;
          return (
            <div key={index} className="hero-container">
              <img 
                src={`/images/heroes/${heroName}.png`}
                alt={heroName}
                title={heroWithLevel}
                className="hero-image"
                onError={(e) => {
                  console.error(`Failed to load image: /images/heroes/${heroName}.png`);
                  e.target.style.display = 'none';
                }}
              />
              {patron && (
                <img 
                  src={`/images/heroes/${patron}.png`}
                  alt={`Покровитель: ${patron}`}
                  className="patronage-image"
                  title={`Покровитель: ${patron}`}
                  onError={(e) => {
                    console.error(`Failed to load patron image: /images/heroes/${patron}.png`);
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading || isWeekLoading) {
    return <div className="loading">ЗАГРУЗКА ДАННЫХ...</div>;
  }

  return (
    <div className="app">
      <div className="search-pack-container">
        <div className="creature-selection-bar">
          <div className="creature-cells">
            {selectedCreatures.map((creature, idx) => (
              <div
                key={idx}
                className={`creature-cell ${idx === 0 ? 'pet-cell' : 'hero-cell'}`}
                onClick={() => handleOpenSelectionModal(idx)}
              >
                {creature ? (
                  <>
                    <img
                      src={`/images/heroes/${creature}.png`}
                      alt={creature}
                      className="creature-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="creature-fallback" style={{ display: 'none' }}>
                      {creature}
                    </div>
                    <div className="creature-name">{creature}</div>
                    <button
                      className="clear-cell-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCell(idx);
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="empty-cell">
                    {idx === 0 ? 'Выпердыш' : `Калека ${idx}`}
                  </div>
                )}
                <div className="cell-label">
                  {idx === 0 ? '' : ''}
                </div>
              </div>
            ))}
          </div>
          <div className="search-pack-buttons">
            {/* Общий фильтр по типу недели для поиска */}
            <div className="search-week-filter">
              <select
                value={globalWeekType}
                onChange={(e) => setGlobalWeekType(e.target.value)}
              >
                <option value="all">Все недели</option>
                <option value="osh">Искать по Ошу</option>
                <option value="maestro">Искать по Маэстро</option>
              </select>
            </div>
            <button
              onClick={performTeamSearch}
              className="search-pack-button"
              disabled={isSearching}
            >
              {isSearching ? 'Поиск...' : 'Собрать пак из навоза'}
            </button> 
            <button onClick={resetTeamSearch} className="reset-pack-button">
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Уровень босса:</label>
          <select value={tempLevel} onChange={(e) => setTempLevel(e.target.value)}>
            <option value="all">Все</option>
            <option value="150">150</option>
            <option value="160">160</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Урон от:</label>
          <select
            value={tempDamageFrom}
            onChange={(e) => {
              let val = e.target.value;
              if (val === 'Infinity') val = Infinity;
              else val = Number(val);
              setTempDamageFrom(val);
            }}
          >
            {damageOptions.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Урон до:</label>
          <select
            value={tempDamageTo}
            onChange={(e) => {
              let val = e.target.value;
              if (val === 'Infinity') val = Infinity;
              else val = Number(val);
              setTempDamageTo(val);
            }}
          >
            {damageOptions.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Фильтр по типу недели (синхронизирован с общим) */}
        <div className="filter-group">
          <label>Тип недели:</label>
          <select
            value={tempWeekType}
            onChange={(e) => setTempWeekType(e.target.value)}
          >
            <option value="all">Все недели</option>
            <option value="osh">Ош</option>
            <option value="maestro">Маэстро</option>
          </select>
        </div>
        <div className="filter-buttons">
          <button onClick={applyFilters} className="find-button">Найти</button>
          <button onClick={resetFilters} className="reset-button">Сбросить</button>
        </div>
      </div>

      <div className="table-container" role="table" aria-label="Battle Results Table">
        <div className="table-header" role="rowgroup">
          <div className="header-cell name" role="columnheader" onClick={() => requestSort('attackerName')}>
            Сортировка по нику{getSortIndicator('attackerName')}
          </div>
          <div className="header-cell team" role="columnheader">Команда</div>
          <div className="header-cell boss" role="columnheader">Босс</div>
          <div className="header-cell damage" role="columnheader" onClick={() => requestSort('damage')}>
            Сортир. по урону{getSortIndicator('damage')}
          </div>
        </div>

        {displayData.length === 0 ? (
          <div className="no-results-message">Такой скудной ебаты нет в наличии</div>
        ) : ( 
          displayData.map((battle, index) => {
            const damageClass = battle.damage < 10000000 ? 'low-damage' : 'high-damage';
            return (
              <div key={index} className="table-row" role="row">
                <div className="table-cell name" role="cell" data-label="Имя атакующего">
                  <div className="player-name">{battle.attackerName}</div>
                </div>
                <div className="table-cell team" role="cell" data-label="Команда">
                  {renderTeamWithPatronage(battle.attackerTeam, battle.attackerPatronage)}
                </div>
                <div className="table-cell boss" role="cell" data-label="Босс">
                  {battle.level}
                </div>
                <div className={`table-cell damage ${damageClass}`} role="cell" data-label="Урон">
                  {battle.damage.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showSelectionModal && (
        <div className="creature-selection-modal">
          <div className="creature-selection-content">
            <div className="selection-modal-header">
              <h3>
                {selectionModalData.cellIndex === 0
                  ? 'Выберите питомца'
                  : `Выберите героя для ячейки ${selectionModalData.cellIndex}`}
              </h3>
              <button
                className="close-selection-modal"
                onClick={() => setShowSelectionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="selection-list-container">
              {selectionModalData.cellIndex === 0 ? (
                <div className="selection-grid">
                  {PATRONS.map(pet => {
                    if (selectedCreatures.includes(pet)) return null;
                    return (
                      <div key={pet} className="selection-item" onClick={() => handleSelectCreature(pet)}>
                        <img
                          src={`/images/heroes/${pet}.png`}
                          alt={pet}
                          className="selection-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <div className="selection-fallback" style={{ display: 'none' }}>{pet}</div>
                        <div className="selection-name">{pet}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="selection-grid">
                  {availableHeroes.map(hero => {
                    if (selectedCreatures.includes(hero)) return null;
                    return (
                      <div key={hero} className="selection-item" onClick={() => handleSelectCreature(hero)}>
                        <img
                          src={`/images/heroes/${hero}.png`}
                          alt={hero}
                          className="selection-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <div className="selection-fallback" style={{ display: 'none' }}>{hero}</div>
                        <div className="selection-name">{hero}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectionModalData.cellIndex === 0 && PATRONS.filter(p => !selectedCreatures.includes(p)).length === 0 && (
                <div className="no-available-creatures">Все питомцы уже выбраны</div>
              )}
              {selectionModalData.cellIndex !== 0 && availableHeroes.filter(h => !selectedCreatures.includes(h)).length === 0 && (
                <div className="no-available-creatures">Все герои уже выбраны</div>
              )}
            </div>
            <div className="selection-modal-footer">
              <button className="cancel-selection" onClick={() => setShowSelectionModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekData;
