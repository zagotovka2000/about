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

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Теперь загружаем только один файл с обработанными данными
      const filePath = '/smBattle/processed/all_battles.csv';
      console.log('Загрузка файла:', filePath);
      
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        throw new Error('Файл пустой');
      }
      
      // Извлекаем заголовки
      const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
      
      // Парсим данные
      const battles = [];
      const dataLines = lines.slice(1);
      
      dataLines.forEach((line, index) => {
        try {
          // Разделяем строку CSV, учитывая кавычки
          const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
          
          if (values.length >= headers.length) {
            const battle = {};
            headers.forEach((header, i) => {
              battle[header] = values[i] || '';
            });
            
            // Проверяем, что есть основные данные
            if (battle.attackerTeam && battle.defenderTeam) {
              battles.push(battle);
            }
          }
        } catch (error) {
          console.error(`Ошибка парсинга строки ${index}:`, error);
        }
      });
      
      console.log(`Загружено боев: ${battles.length}`);
      setBattleData(battles);
      
      // Извлекаем уникальных существ
      const creaturesSet = new Set();
      
      battles.forEach(battle => {
        // Извлекаем героев из атакующей команды
        if (battle.attackerTeam) {
          const heroMatches = battle.attackerTeam.match(/([А-Яа-яA-Za-zЁё'-]+)\(\d+\)/g);
          if (heroMatches) {
            const heroes = heroMatches.slice(1); // Пропускаем первого (питомца)
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
            const heroes = heroMatches.slice(0, -1); // Пропускаем последнего (питомца)
            heroes.forEach(match => {
              const heroName = match.split('(')[0];
              if (heroName && !patronazhs.includes(heroName)) {
                creaturesSet.add(heroName);
              }
            });
          }
        }
      });
      
      const sortedCreatures = Array.from(creaturesSet).sort();
      setAvailableCreatures(sortedCreatures);
      console.log('Уникальных героев найдено:', sortedCreatures.length);
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      // Запасной вариант - тестовые данные
      setAvailableCreatures(['Аль','Тея','Дор','Хай','Сел','Крв','Авг','Ори','Неб','Дан','Кей','Гал','ЛаК','Фаф','Исм','Эле','Баб','Ясм','Лир','Акс','Себ','Мор','Кир','Аст','Пеп','Руф','Хор','Эйд','Муш','Йор','Фол','Гус','Пол','Дже','Ара','Мод','Арт','Три','Цин','Айз','Айр','Сат','Авр','Гел','Век','Каи','Мар','Мер','Оли','К\'А','Кри','Ами','Фен','Бис','Лап','Айт','Дант','Ню','Чер','Чу','Шив','Юли','Зен','Астм','Атл','Клео','Изи','Кейн','Лю','Май','Фа','Хел','Эш']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Функция извлечения данных из атакующей пачки
  const extractAttackerData = useCallback((teamString, petsString) => {
    if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
    
    const result = {
      generalPet: null,
      heroes: [],
      patronages: []
    };
    
    try {
      // Разбиваем строку команды по пробелам
      const teamParts = teamString.trim().split(/\s+/);
      if (teamParts.length === 0) return result;
      
      // ПЕРВЫЙ элемент - общий питомец
      result.generalPet = teamParts[0].replace(/\(\d+\)$/, '');
      
      // Остальные элементы - герои (максимум 5)
      result.heroes = teamParts.slice(1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
      
      // Извлекаем патронажи для героев из строки питомцев
      if (petsString && petsString.trim() !== '') {
        // Разбиваем строку питомцев по пробелам
        const allPetParts = petsString.trim().split(/\s+/).filter(p => p !== '');
        
        // Если есть 10+ значений, берем первые 5 для атаки
        // Иначе берем все доступные
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
        // Если нет строки питомцев, заполняем ###
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
      // Разбиваем строку команды по пробелам
      const teamParts = teamString.trim().split(/\s+/);
      if (teamParts.length === 0) return result;
      
      // ПОСЛЕДНИЙ элемент - общий питомец
      result.generalPet = teamParts[teamParts.length - 1].replace(/\(\d+\)$/, '');
      
      // Все элементы кроме последнего - герои (максимум 5)
      result.heroes = teamParts.slice(0, -1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
      
      // Извлекаем патронажи для героев из строки питомцев
      if (petsString && petsString.trim() !== '') {
        // Разбиваем строку питомцев по пробелам
        const allPetParts = petsString.trim().split(/\s+/).filter(p => p !== '');
        
        // Если есть 10+ значений, берем последние 5 для защиты (индексы 5-9)
        // Иначе предполагаем, что это уже питомцы защиты
        let defenderPetParts = [];
        if (allPetParts.length >= 10) {
          defenderPetParts = allPetParts.slice(5, 10);
        } else {
          // Если меньше 10 значений, берем все доступные
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
        // Если нет строки питомцев, заполняем ###
        result.patronages = Array(result.heroes.length).fill('###');
      }
    } catch (error) {
      console.error('Ошибка в extractDefenderData:', error);
      result.patronages = Array(5).fill('###');
    }
    
    return result;
  }, []);

  // Основная функция поиска
  const handleSearch = useCallback(() => {
    if (isLoading) {
      alert('Данные еще загружаются. Пожалуйста, подождите.');
      return;
    }
    
    if (battleData.length === 0) {
      alert('Нет данных для поиска.');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    // Получаем выбранных существ
    const selectedPet = selectedCreatures[0]; // Первая ячейка - питомец
    const selectedHeroes = selectedCreatures.slice(1).filter(hero => hero !== null); // Остальные - герои
    
    if (selectedHeroes.length === 0 && !selectedPet) {
      setIsSearching(false);
      alert('Выберите хотя бы одного героя или питомца для поиска.');
      return;
    }

    console.log('Начинаем поиск...');
    console.log('Выбранный питомец:', selectedPet);
    console.log('Выбранные герои:', selectedHeroes);
    console.log('Всего боев:', battleData.length);
    
    const results = [];
    
    // Проходим по всем боям
    battleData.forEach((battle, index) => {
      try {
        // Для защиты используем ту же строку с питомцами, если defenderPets пустой
        const defenderPetsString = battle.defenderPets && battle.defenderPets.trim() !== '' 
          ? battle.defenderPets 
          : battle.attackerPets;
        
        const defenderData = extractDefenderData(battle.defenderTeam, defenderPetsString);
        
        // Проверяем совпадение общего питомца (если выбран)
        if (selectedPet && selectedPet !== defenderData.generalPet) {
          return;
        }
        
        // Проверяем совпадение героев (без учета позиций)
        if (selectedHeroes.length > 0) {
          const allHeroesFound = selectedHeroes.every(hero => 
            defenderData.heroes.includes(hero)
          );
          
          if (!allHeroesFound) {
            return;
          }
        }
        
        // Извлекаем данные атакующей пачки
        const attackerData = extractAttackerData(battle.attackerTeam, battle.attackerPets);
        
        // Если ничего не выбрано, но есть данные - пропускаем
        if (!selectedPet && selectedHeroes.length === 0) {
          return;
        }
        
        // Добавляем результат
        results.push({
          id: index,
          attacker: {
            name: battle.attackerName,
            power: battle.attackerPower,
            generalPet: attackerData.generalPet,
            heroes: attackerData.heroes,
            patronages: attackerData.patronages
          },
          defender: {
            name: battle.defenderName,
            power: battle.defenderPower,
            generalPet: defenderData.generalPet,
            heroes: defenderData.heroes,
            patronages: defenderData.patronages
          },
          points: battle.points,
          replay: battle.replay,
          matchedHeroes: selectedHeroes.filter(hero => defenderData.heroes.includes(hero))
        });
      } catch (error) {
        console.error(`Ошибка при обработке боя ${index}:`, error);
      }
    });
    
    console.log('Найдено результатов:', results.length);
    if (results.length > 0) {
      console.log('Пример результата:', results[0]);
      console.log('Patronages атаки:', results[0].attacker.patronages);
      console.log('Patronages защиты:', results[0].defender.patronages);
    }
    setSearchResults(results);
    setIsSearching(false);
  }, [battleData, extractAttackerData, extractDefenderData, isLoading, selectedCreatures]);

  // Функция для отображения команды с патронажами
  const renderTeamWithPatronage = useCallback((teamData, isAttacker = true) => {
    if (!teamData || !teamData.heroes) {
      return null;
    }
    
    const { heroes, patronages = [], generalPet } = teamData;
    
    return (
      <div className="team-with-patronage">
        {/* Общий питомец */}
        <div className="general-pet-section">
          <div className="general-pet-label">
          </div>
          {generalPet && (
            <div className="general-pet-container">
              <img 
                src={`/images/${generalPet}.png`}
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
        
        {/* Герои с патронажами */}
        <div className="heroes-section">
          <div className="heroes-label">
            Герои {isAttacker ? 'атаки' : 'защиты'}:
          </div>
          <div className="heroes-container">
            {heroes.map((hero, index) => {
              // Для всех команд берем патронаж из массива
              const patron = patronages && index < patronages.length ? patronages[index] : '###';
              
              return (
                <div key={index} className="hero-patron-container">
                  <div className="hero-with-patron">
                    <div className="hero-container">
                      <img 
                        src={`/images/${hero}.png`}
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
                    
                    {/* Патронаж показываем ВСЕГДА */}
                    <div className="patronage-overlay">
                      <div className="patronage-label">Патронаж:</div>
                      <img 
                        src={`/images/${patron}.png`}
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
                  {/* Подпись патронажа показываем ТОЛЬКО если не ### */}
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
      alert('Данные еще загружаются. Пожалуйста, подождите.');
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
  }, [isLoading, pets, heroes, selectedCreatures]);

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
    setSelectedCreatures(Array(6).fill(null));
    setSearchResults([]);
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

  return (
    <div className="territory-container">
      <div className="territory-upper-container">
        <h2 className="territory-title">Подбор пачек</h2>
        
        {/* Информация о данных */}
        <div className="data-info">
          <p>Загружено боев: {battleData.length}</p>
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
                      src={`/images/${creature}.png`}
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
          
          {/* Кнопки управления */}
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
                        src={`/images/${creature}.png`}
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

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="territory-lower-container">
          <div className="results-header">
            <h3 className="results-title">
              Найдено пачек: {searchResults.length}
            </h3>
          </div>
          
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={index} className="battle-result-item">
                <div className="battle-header">
                  <div className="battle-info">
                    <span className="battle-date">{result.attacker.name} vs {result.defender.name}</span>
                    <span className="battle-points">Очки: {result.points}</span>
                  </div>
                  
                  {result.replay && (
                    <a 
                      href={result.replay} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="replay-link"
                    >
                      Смотреть бой
                    </a>
                  )}
                </div>
                
                <div className="battle-teams-container">
                  {/* Атакующая пачка */}
                  <div className="team-container attacking-team">
                    {renderTeamWithPatronage(result.attacker, true)}
                  </div>
                  
                  {/* Разделитель */}
                  <div className="teams-divider">
                    <div className="vs-text">VS</div>
                  </div>
                  
                  {/* Защитная пачка */}
                  <div className="team-container defending-team">
                    {renderTeamWithPatronage(result.defender, false)}
                  </div>
                </div>
                <div className="battle-footer">
                  <div className="selected-summary">
                    <strong>Совпадения в защите:</strong>
                    <div className="selected-creatures-list">
                      {selectedCreatures.slice(1).map((hero, idx) => 
                        hero && result.matchedHeroes.includes(hero) && (
                          <span key={idx} className="selected-creature-tag hero-tag">
                            {hero}
                          </span>
                        )
                      )}
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
