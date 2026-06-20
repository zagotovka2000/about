// Territory.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './territory.css';

const patronazhs = ['Акс','Аль','Век','Каи','Мар','Мер','Оли','Хор','Фен','Бис'];

const Territory = () => {
  const [selectedCreatures, setSelectedCreatures] = useState(Array(6).fill(null));
  const [availableCreatures, setAvailableCreatures] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [battleData, setBattleData] = useState([]);
  const [selectionModal, setSelectionModal] = useState({
    isOpen: false,
    cellIndex: null,
    creatureType: 'hero'
  });
  const [selectionList, setSelectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Состояния для поиска по нику защищающегося
  const [defenderNameSearch, setDefenderNameSearch] = useState('');
  const [isNameSearchActive, setIsNameSearchActive] = useState(false);

  // Состояние для модального окна сообщений
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      const filePath = '/smBattle/processed/all_battles.csv';
      console.log('Загрузка файла:', filePath);
      
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        throw new Error('Файл пустой');
      }
      
      // Извлекаем заголовки (убираем кавычки)
      const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
      console.log('Заголовки:', headers);
      
      const battles = [];
      const creaturesSet = new Set();
      
      // Парсим строки с учетом кавычек
      for (let i = 1; i < lines.length; i++) {
        try {
          const line = lines[i];
          // Разбиваем CSV с учетом кавычек
          const values = [];
          let current = '';
          let inQuotes = false;
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          
          // Убираем кавычки из значений
          const cleanValues = values.map(v => v.replace(/^"|"$/g, ''));
          
          const battle = {};
          headers.forEach((header, idx) => {
            battle[header] = cleanValues[idx] || '';
          });
          
          if (!battle.attackerTeam || !battle.defenderTeam) continue;
          
          battles.push(battle);
          
          // Извлекаем героев из атакующей команды
          if (battle.attackerTeam) {
            const heroMatches = battle.attackerTeam.match(/([А-Яа-яA-Za-zЁё'-]+)\(\d+\)/g);
            if (heroMatches) {
              const heroes = heroMatches.slice(1);
              heroes.forEach(match => {
                const heroName = match.split('(')[0];
                if (heroName && !patronazhs.includes(heroName)) {
                  creaturesSet.add(heroName);
                }
              });
            }
          }
          
          // Извлекаем героев из защитной команды
          if (battle.defenderTeam) {
            const heroMatches = battle.defenderTeam.match(/([А-Яа-яA-Za-zЁё'-]+)\(\d+\)/g);
            if (heroMatches) {
              const heroes = heroMatches.slice(0, -1);
              heroes.forEach(match => {
                const heroName = match.split('(')[0];
                if (heroName && !patronazhs.includes(heroName)) {
                  creaturesSet.add(heroName);
                }
              });
            }
          }
          
        } catch (err) {
          console.error('Ошибка парсинга строки:', err, lines[i]);
        }
      }
      
      if (battles.length === 0) {
        throw new Error('Не удалось загрузить данные из файла');
      }
      
      console.log(`Загружено боев: ${battles.length}`);
      setBattleData(battles);
      
      const sortedCreatures = Array.from(creaturesSet).sort();
      setAvailableCreatures(sortedCreatures);
      console.log('Уникальных героев найдено:', sortedCreatures.length);
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoadError(`Ошибка загрузки данных: ${error.message}`);
      // Запасной вариант - тестовые данные
      setAvailableCreatures(['Аль','Тея','Дор','Хай','Сел','Крв','Авг','Ори','Неб','Дан','Кей','Гал','ЛаК','Фаф','Исм','Эле','Баб','Ясм','Лир','Акс','Себ','Мор','Кир','Аст','Пеп','Руф','Хор','Эйд','Муш','Йор','Фол','Гус','Пол','Дже','Ара','Мод','Арт','Три','Цин','Айз','Айр','Сат','Авр','Гел','Век','Каи','Мар','Мер','Оли','К\'А','Кри','Ами','Фен','Бис','Лап','Айт','Дант','Ню','Чер','Чу','Шив','Юли','Зен','Астм','Атл','Клео','Изи','Кейн','Лю','Май','Фа','Хел','Эш']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------- Показать модальное сообщение ----------
  const showMessage = useCallback((title, message, type = 'info') => {
    setMessageModal({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  const closeMessageModal = useCallback(() => {
    setMessageModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
    });
  }, []);

  // Функция извлечения данных из атакующей пачки
  const extractAttackerData = useCallback((teamString, petsString) => {
    if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
    
    const result = {
      generalPet: null,
      heroes: [],
      patronages: []
    };
    
    try {
      const teamParts = teamString.trim().split(/\s+/);
      if (teamParts.length === 0) return result;
      
      result.generalPet = teamParts[0].replace(/\(\d+\)$/, '');
      result.heroes = teamParts.slice(1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
      
      if (petsString && petsString.trim() !== '') {
        const allPetParts = petsString.trim().split(/\s+/).filter(p => p !== '');
        const attackerPetParts = allPetParts.length >= 10 ? 
          allPetParts.slice(0, 5) : 
          allPetParts.slice(0, Math.min(5, allPetParts.length));
        
        for (let i = 0; i < result.heroes.length; i++) {
          if (i < attackerPetParts.length) {
            const petPart = attackerPetParts[i];
            if (petPart === '###') {
              result.patronages.push('###');
            } else {
              const petName = petPart.replace(/\(\d+\)$/, '');
              result.patronages.push(petName);
            }
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
  }, []);

  // Функция извлечения данных из защитной пачки
  const extractDefenderData = useCallback((teamString, petsString) => {
    if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
    
    const result = {
      generalPet: null,
      heroes: [],
      patronages: []
    };
    
    try {
      const teamParts = teamString.trim().split(/\s+/);
      if (teamParts.length === 0) return result;
      
      result.generalPet = teamParts[teamParts.length - 1].replace(/\(\d+\)$/, '');
      result.heroes = teamParts.slice(0, -1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
      
      if (petsString && petsString.trim() !== '') {
        const allPetParts = petsString.trim().split(/\s+/).filter(p => p !== '');
        let defenderPetParts = [];
        if (allPetParts.length >= 10) {
          defenderPetParts = allPetParts.slice(5, 10);
        } else {
          defenderPetParts = allPetParts.slice(0, Math.min(5, allPetParts.length));
        }
        
        for (let i = 0; i < result.heroes.length; i++) {
          if (i < defenderPetParts.length) {
            const petPart = defenderPetParts[i];
            if (petPart === '###') {
              result.patronages.push('###');
            } else {
              const petName = petPart.replace(/\(\d+\)$/, '');
              result.patronages.push(petName);
            }
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
  }, []);

  // ---------- Поиск по нику защищающегося ----------
  const handleDefenderNameSearch = useCallback(() => {
    if (isLoading) {
      showMessage('Загрузка данных', 'Данные ещё загружаются. Пожалуйста, подождите.', 'warning');
      return;
    }

    if (!defenderNameSearch.trim()) {
      showMessage('Введите ник', 'Пожалуйста, введите ник защищающегося для поиска.', 'warning');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setIsNameSearchActive(true);
    setSearchResults([]);

    const searchName = defenderNameSearch.trim();
    const results = [];

    battleData.forEach((battle, index) => {
      try {
        const defenderName = battle.defenderName || '';
        if (defenderName.toLowerCase().includes(searchName.toLowerCase())) {
          const defenderPetsString = battle.defenderPets && battle.defenderPets.trim() !== '' 
            ? battle.defenderPets 
            : battle.attackerPets;
          const defenderData = extractDefenderData(battle.defenderTeam, defenderPetsString);
          const attackerData = extractAttackerData(battle.attackerTeam, battle.attackerPets);

          results.push({
            id: index,
            attacker: {
              name: battle.attackerName || '',
              power: battle.attackerPower || '',
              generalPet: attackerData.generalPet,
              heroes: attackerData.heroes,
              patronages: attackerData.patronages,
              id: battle.attackerId || ''
            },
            defender: {
              name: defenderName,
              power: battle.defenderPower || '',
              generalPet: defenderData.generalPet,
              heroes: defenderData.heroes,
              patronages: defenderData.patronages,
              id: battle.defenderId || '',
              guild: battle.defenderGuild || ''
            },
            points: battle.points || '0',
            replay: battle.replay || '',
          });
        }
      } catch (err) {
        console.error(`Ошибка обработки боя ${index}:`, err);
      }
    });

    setSearchResults(results);
    setIsSearching(false);
    
    if (results.length === 0) {
      showMessage(
        'Не, хуйня 😢',
        `${searchName} в какой помойке валялся,что его потом не нашли?`,
        'error'
      );
    }
  }, [battleData, isLoading, defenderNameSearch, extractDefenderData, extractAttackerData, showMessage]);

  // Основная функция поиска
  const handleSearch = useCallback(() => {
    if (isLoading) {
      showMessage('Загрузка данных', 'Данные ещё загружаются. Пожалуйста, подождите.', 'warning');
      return;
    }
    
    if (battleData.length === 0) {
      showMessage('Нет данных', 'Нет данных для поиска. Проверьте загрузку файла.', 'error');
      return;
    }
    
    const selectedPet = selectedCreatures[0];
    const selectedHeroes = selectedCreatures.slice(1).filter(hero => hero !== null);
    
    if (selectedHeroes.length === 0 && !selectedPet) {
      showMessage('Выберите героев', 'Пожалуйста, выберите хотя бы одного героя или питомца для поиска.', 'warning');
      return;
    }

    setHasSearched(true);
    setIsNameSearchActive(false);
    setIsSearching(true);
    setSearchResults([]);
    
    const results = [];
    
    battleData.forEach((battle, index) => {
      try {
        const defenderPetsString = battle.defenderPets && battle.defenderPets.trim() !== '' 
          ? battle.defenderPets 
          : battle.attackerPets;
        
        const defenderData = extractDefenderData(battle.defenderTeam, defenderPetsString);
        
        if (selectedPet && selectedPet !== defenderData.generalPet) {
          return;
        }
        
        if (selectedHeroes.length > 0) {
          const allHeroesFound = selectedHeroes.every(hero => 
            defenderData.heroes.includes(hero)
          );
          
          if (!allHeroesFound) {
            return;
          }
        }
        
        const attackerData = extractAttackerData(battle.attackerTeam, battle.attackerPets);
        
        if (!selectedPet && selectedHeroes.length === 0) {
          return;
        }
        
        results.push({
          id: index,
          attacker: {
            name: battle.attackerName || '',
            power: battle.attackerPower || '',
            generalPet: attackerData.generalPet,
            heroes: attackerData.heroes,
            patronages: attackerData.patronages,
            id: battle.attackerId || ''
          },
          defender: {
            name: battle.defenderName || '',
            power: battle.defenderPower || '',
            generalPet: defenderData.generalPet,
            heroes: defenderData.heroes,
            patronages: defenderData.patronages,
            id: battle.defenderId || '',
            guild: battle.defenderGuild || ''
          },
          points: battle.points || '0',
          replay: battle.replay || '',
          matchedHeroes: selectedHeroes.filter(hero => defenderData.heroes.includes(hero))
        });
      } catch (error) {
        console.error(`Ошибка при обработке боя ${index}:`, error);
      }
    });
    
    setSearchResults(results);
    setIsSearching(false);
    
    if (results.length === 0) {
      showMessage(
        'Ничего не найдено 😢',
        'Таких пачек пока нет в нашей базе данных. Попробуйте изменить набор героев.',
        'error'
      );
    }
  }, [battleData, extractAttackerData, extractDefenderData, isLoading, selectedCreatures, showMessage]);

  // Функция для отображения команды с патронажами
  const renderTeamWithPatronage = useCallback((teamData, isAttacker = true) => {
    if (!teamData || !teamData.heroes) {
      return null;
    }
    
    const { heroes, patronages = [], generalPet } = teamData;
    
    return (
      <div className="team-with-patronage">
        <div className="general-pet-section">
          <div className="general-pet-label">
          </div>
          {generalPet && (
            <div className="general-pet-container">
              <img 
                src={`/images/heroes/${generalPet}.png`}
                alt={generalPet}
                className="general-pet-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="general-pet-fallback" style={{display: 'none'}}>
                {generalPet}
              </div>
            </div>
          )}
        </div>
        
        <div className="heroes-section">
          <div className="heroes-container">
            {heroes.map((hero, index) => {
              const patron = patronages && index < patronages.length ? patronages[index] : '###';
              
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
                          const fallback = e.target.nextElementSibling;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hero-fallback" style={{display: 'none'}}>
                        {hero}
                      </div>
                    </div>
                    
                    <div className="patronage-overlay">
                      <div className="patronage-label">Патронаж:</div>
                      <img 
                        src={`/images/heroes/${patron}.png`}
                        alt={`Патронаж: ${patron === '###' ? 'нет' : patron}`}
                        className="patronage-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="patron-fallback" style={{display: 'none'}}>
                        {patron === '###' ? 'нет' : patron}
                      </div>
                    </div>
                  </div>
                  <div className="hero-name">{hero}</div>
                  {patron !== '###' && (
                    <div className="patron-name">+ {patron}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, []);

  // Разделение существ на питомцев и героев
  const { pets, heroes } = useMemo(() => {
    const petsList = [...new Set(patronazhs)].sort((a, b) => a.localeCompare(b));
    const heroesList = availableCreatures.filter(creature => 
      !petsList.includes(creature)
    ).sort((a, b) => a.localeCompare(b));
    
    return { 
      pets: petsList, 
      heroes: heroesList 
    };
  }, [availableCreatures]);

  // Обработчик клика по ячейке
  const handleCellClick = useCallback((index) => {
    if (isLoading) {
      showMessage('Загрузка данных', 'Данные ещё загружаются. Пожалуйста, подождите.', 'warning');
      return;
    }
    
    const creatureType = index === 0 ? 'pet' : 'hero';
    
    let availableForSelection = [];
    if (creatureType === 'pet') {
      availableForSelection = pets.filter(pet => !selectedCreatures.includes(pet));
    } else {
      availableForSelection = heroes.filter(hero => 
        !selectedCreatures.includes(hero)
      );
    }
    
    setSelectionList(availableForSelection);
    setSelectionModal({
      isOpen: true,
      cellIndex: index,
      creatureType
    });
  }, [isLoading, pets, heroes, selectedCreatures, showMessage]);

  // Обработчик выбора существа
  const handleCreatureSelect = useCallback((creatureName) => {
    const newSelectedCreatures = [...selectedCreatures];
    newSelectedCreatures[selectionModal.cellIndex] = creatureName;
    setSelectedCreatures(newSelectedCreatures);
    setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' });
  }, [selectedCreatures, selectionModal.cellIndex]);

  // Обработчик очистки ячейки
  const handleClearCell = useCallback((index) => {
    const newSelectedCreatures = [...selectedCreatures];
    newSelectedCreatures[index] = null;
    setSelectedCreatures(newSelectedCreatures);
  }, [selectedCreatures]);

  // Очистка всех ячеек
  const clearAllCells = useCallback(() => {
    setHasSearched(false);
    setSelectedCreatures(Array(6).fill(null));
    setSearchResults([]);
    setIsNameSearchActive(false);
    setDefenderNameSearch('');
  }, []);

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

  if (loadError) {
    return (
      <div className="territory-container">
        <div className="error-message">
          <h2>Ошибка загрузки данных</h2>
          <p>{loadError}</p>
          <button onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="territory-container">
      <div className="territory-upper-container">
        <h2 className="territory-title">Подбор пачек</h2>
        
        <div className="data-info">
          <p>Загружено боев: {battleData.length}</p>
        </div>

        {/* Поиск по нику защищающегося */}
        <div className="search-by-name-container">
          <div className="search-by-name-wrapper">
            <input
              type="text"
              className="search-by-name-input"
              placeholder="Поиск боя по нику защищающегося..."
              value={defenderNameSearch}
              onChange={(e) => setDefenderNameSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDefenderNameSearch();
                }
              }}
            />
            <button
              className="search-by-name-button"
              onClick={handleDefenderNameSearch}
              disabled={isSearching || !defenderNameSearch.trim() || battleData.length === 0}
            >
              {isSearching ? 'Поиск...' : 'Найти по нику'}
            </button>
          </div>
          {isNameSearchActive && (
            <button
              className="clear-name-search-button"
              onClick={() => {
                setDefenderNameSearch('');
                setIsNameSearchActive(false);
                setSearchResults([]);
                setHasSearched(false);
              }}
            >
              Очистить поиск по нику
            </button>
          )}
        </div>
        
        {/* 6 ячеек для выбора */}
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
                      src={`/images/heroes/${creature}.png`}
                      alt={creature}
                      className="creature-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                    <div className="creature-fallback" style={{display: 'none'}}>
                      {creature}
                    </div>
                    <div className="creature-name">{creature}</div>
                    <button 
                      className="clear-cell-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCell(index);
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="empty-cell">
                    {index === 0 ? 'Питомец' : `Герой ${index}`}
                  </div>
                )}
                <div className="cell-label">
                  {index === 0 ? 'Только питомцы' : `Только герои`}
                </div>
              </div>
            ))}
          </div>
          
          <div className="controls-container">
            <button 
              onClick={handleSearch} 
              className="search-button"
              disabled={isSearching || (selectedCreatures.slice(1).every(creature => creature === null) && !selectedCreatures[0])}
            >
              {isSearching ? 'Поиск...' : 'Найти победные пачки'}
            </button>
            <button 
              onClick={clearAllCells} 
              className="clear-all-button"
            >
              Очистить все
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно выбора */}
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
                  {selectedCreatures.filter(c => c).length === (pets.length + heroes.length)
                    ? 'Все существа уже выбраны' 
                    : 'Нет доступных существ в этой категории'}
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
                        src={`/images/heroes/${creature}.png`}
                        alt={creature}
                        className="selection-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) {
                            fallback.style.display = 'block';
                          }
                        }}
                      />
                      <div className="selection-fallback" style={{display: 'none'}}>
                        {creature}
                      </div>
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

      {/* Модальное окно для сообщений */}
      {messageModal.isOpen && (
        <div className="message-modal-overlay" onClick={closeMessageModal}>
          <div className={`message-modal-content message-${messageModal.type}`} onClick={(e) => e.stopPropagation()}>
            <div className="message-modal-header">
              <div className="message-modal-icon">
                {messageModal.type === 'success' && '✅'}
                {messageModal.type === 'warning' && '⚠️'}
                {messageModal.type === 'info' && 'ℹ️'}
              </div>
              <h3>{messageModal.title}</h3>
              <button className="message-modal-close" onClick={closeMessageModal}>×</button>
            </div>
            <div className="message-modal-body">
              <p>{messageModal.message}</p>
            </div>
            <div className="message-modal-footer">
              <button className="message-modal-button" onClick={closeMessageModal}>
                Да и насрать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      {hasSearched && !isSearching && searchResults.length === 0 ? (
        <div className="territory-lower-container no-results">
          <div className="no-results-message">
            {isNameSearchActive 
              ? `Боев с "${defenderNameSearch}" в защите не найдено`
              : 'В СМ такую пачку еще не побеждали'}
          </div>
        </div>
      ) : searchResults.length > 0 && (
        <div className="territory-lower-container">
          <div className="results-header">
            <h3 className="results-title">
              {isNameSearchActive 
                ? `Найдено ${searchResults.length} победных боёв с защитником "${defenderNameSearch}"`
                : `кем побеждалось → Найдено ${searchResults.length} боев → кого побеждалось`
              }
            </h3>
          </div>
          
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={index} className="battle-result-item">
                <div className="battle-teams-container">
                  {/* Атакующая пачка */}
                  <div className="team-container attacking-team">
                    <div className="team-header">
                      <span className="player-name">⚔️ {result.attacker.name}</span>
                      <span className="player-power">{result.attacker.power}</span>
                    </div>
         
                    {renderTeamWithPatronage(result.attacker, true)}
                  </div>
                  
                  {/* Разделитель */}
                  <div className="teams-divider">
                    <div className="vs-text">VS</div>
                  </div>
                  
                  {/* Защитная пачка */}
                  <div className="team-container defending-team">
                    <div className="team-header">
                      <span className="player-name">🛡️ {result.defender.name}</span>
                      <span className="player-power">{result.defender.power}</span>
                    </div>
 
                    {result.defender.guild && (
                      <div className="guild-info">🏰 Гильдия: {result.defender.guild}</div>
                    )}
                    {renderTeamWithPatronage(result.defender, false)}
                  </div>
                </div>
                <div className="battle-footer">
                  <div className="selected-summary">
                    <div className="selected-creatures-list">
                      {selectedCreatures[0] && (
                        <span className="selected-creature-tag pet-tag">
                          {selectedCreatures[0]} (питомец)
                        </span>
                      )}
                    </div>
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

export default Territory;
