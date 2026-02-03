// Territory.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './territory.css';

// Выносим питомцев наружу
const patronazhs = ['Акс','Аль','Век','Каи','Мар','Мер','Оли','Хор','Фен','Бис'];

const Territory = () => {
  // Состояние для выбранных существ (6 ячеек)
  const [selectedCreatures, setSelectedCreatures] = useState(Array(6).fill(null));
  // Список доступных существ
  const [availableCreatures, setAvailableCreatures] = useState([]);
  // Результаты поиска
  const [searchResults, setSearchResults] = useState([]);
  // Статус поиска
  const [isSearching, setIsSearching] = useState(false);
  // Все данные из файлов
  const [battleData, setBattleData] = useState([]);
  // Модальное окно выбора существ
  const [selectionModal, setSelectionModal] = useState({
    isOpen: false,
    cellIndex: null,
    creatureType: 'hero'
  });
  // Список существ для выбора в модальном окне
  const [selectionList, setSelectionList] = useState([]);
  // Статус загрузки данных
  const [isLoading, setIsLoading] = useState(true);

  // Функция загрузки файлов
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Загрузка данных...');
      
      // Загружаем файл
      const filePath = '/smBattle/wataha.txt';
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log(`Файл загружен, размер: ${text.length} символов`);
      
      // Разбиваем на строки
      const lines = text.split('\n').filter(line => line.trim() !== '');
      console.log(`Всего строк: ${lines.length}`);
      
      // Первая строка - заголовок, пропускаем
      const dataLines = lines.slice(1);
      console.log(`Строк данных: ${dataLines.length}`);
      
      // Парсим каждую строку
      const battles = [];
      
      dataLines.forEach((line, index) => {
        try {
          // Разбиваем по табуляции
          const parts = line.split('\t');
          
          // Минимальное количество частей для корректного парсинга
          if (parts.length >= 12) {
            const battle = {
              dateTime: parts[0]?.trim() || '',
              attackerName: parts[2]?.trim() || '',
              attackerPower: parts[3]?.trim() || '',
              attackerTeam: parts[4]?.trim() || '',
              defenderName: parts[6]?.trim() || '',
              defenderPower: parts[7]?.trim() || '',
              defenderTeam: parts[8]?.trim() || '',
              points: parts[9]?.trim() || '',
              attackerPets: parts[10]?.trim() || '',
              defenderPets: parts[11]?.trim() || '',
              replay: parts.length > 17 ? parts[17]?.trim() : ''
            };
            
            // Проверяем, что есть необходимые данные
            if (battle.attackerTeam && battle.defenderTeam) {
              battles.push(battle);
            }
          }
        } catch (error) {
          console.error(`Ошибка парсинга строки ${index}:`, error);
        }
      });
      
      console.log(`Извлечено боев: ${battles.length}`);
      
      if (battles.length > 0) {
        console.log('Первый бой:', battles[0]);
      }
      
      setBattleData(battles);
      
      // Извлекаем уникальных существ
      const creaturesSet = new Set();
      battles.slice(0, 50).forEach(battle => {
        // Извлекаем героев из атакующей команды
        const attackerTeam = battle.attackerTeam;
        if (attackerTeam) {
          // Ищем имена героев в формате "Имя(цифры)"
          const heroMatches = attackerTeam.match(/([А-Яа-яA-Za-zЁё\'\-]+)\(\d+\)/g);
          if (heroMatches) {
            // Пропускаем первого - это общий питомец, остальные - герои
            heroMatches.slice(1).forEach(match => {
              const heroName = match.split('(')[0];
              if (heroName && !patronazhs.includes(heroName)) {
                creaturesSet.add(heroName);
              }
            });
          }
        }
        
        // Извлекаем героев из защитной команды
        const defenderTeam = battle.defenderTeam;
        if (defenderTeam) {
          const heroMatches = defenderTeam.match(/([А-Яа-яA-Za-zЁё\'\-]+)\(\d+\)/g);
          if (heroMatches) {
            // Все кроме последнего - герои (последний - общий питомец)
            heroMatches.slice(0, -1).forEach(match => {
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
      console.log('Пример героев:', sortedCreatures.slice(0, 10));
      
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      // Используем тестовые данные
      setAvailableCreatures(['Аль','Тея','Дор','Хай','Сел','Крв','Авг','Ори','Неб','Дан','Кей','Гал','ЛаК','Фаф','Исм','Эле','Баб','Ясм','Лир','Акс','Себ','Мор','Кир','Аст','Пеп','Руф','Хор','Эйд','Муш','Йор','Фол','Гус','Пол','Дже','Ара','Мод','Арт','Три','Цин','Айз','Айр','Сат','Авр','Гел','Век','Каи','Мар','Мер','Оли','К\'А','Кри','Ами','Фен','Бис','Лап','Айт','Дант','Ню','Чер','Чу','Шив','Юли','Зен','Астм','Атл','Клео','Изи','Кейн','Лю','Май','Фа','Хел','Эш']);
    } finally {
      setIsLoading(false);
      console.log('Загрузка завершена');
    }
  }, []);

  // Инициализация - загрузка данных только один раз
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
    
    // Разбиваем строку команды по пробелам
    const teamParts = teamString.trim().split(/\s+/);
    if (teamParts.length === 0) return result;
    
    // ПЕРВЫЙ элемент - общий питомец
    result.generalPet = teamParts[0].replace(/\(\d+\)$/, '');
    
    // Остальные элементы - герои (максимум 5)
    result.heroes = teamParts.slice(1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
    
    // Извлекаем патронажи для героев из строки питомцев
    if (petsString && petsString.trim() !== '') {
      // Разбиваем строку питомцев по пробелам и фильтруем пустые строки
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      
      // В строке attackerPets 5 значений для атаки
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < petParts.length) {
          const petPart = petParts[i];
          if (petPart === '###') {
            result.patronages.push('###');
          } else {
            // Удаляем уровень в скобках
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
    
    return result;
  }, []);

  // Функция извлечения данных из защитной пачки
  const extractDefenderData = useCallback((teamString, petsString) => {
    if (!teamString) return { generalPet: null, heroes: [], patronages: [] };
    
    const result = {
      generalPet: null,
      heroes: [],
      patronages: [] // Для защиты ТОЖЕ показываем патронажи на героях
    };
    
    // Разбиваем строку команды по пробелам
    const teamParts = teamString.trim().split(/\s+/);
    if (teamParts.length === 0) return result;
    
    // ПОСЛЕДНИЙ элемент - общий питомец
    result.generalPet = teamParts[teamParts.length - 1].replace(/\(\d+\)$/, '');
    
    // Все элементы кроме последнего - герои (максимум 5)
    result.heroes = teamParts.slice(0, -1).map(part => part.replace(/\(\d+\)$/, '')).slice(0, 5);
    
    // Извлекаем патронажи для героев из строки питомцев
    // В строке defenderPets уже 5 значений для защиты
    if (petsString && petsString.trim() !== '') {
      // Разбиваем строку питомцев по пробелам и фильтруем пустые строки
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      
      console.log('defenderPets:', petsString);
      console.log('petParts:', petParts);
      console.log('heroes:', result.heroes);
      
      // Сопоставляем патронажи с героями по порядку
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < petParts.length) {
          const petPart = petParts[i];
          if (petPart === '###') {
            result.patronages.push('###');
          } else {
            // Удаляем уровень в скобках
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
    
    console.log('Результат извлечения защиты:', result);
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
        // Извлекаем данные защитной пачки
        const defenderData = extractDefenderData(battle.defenderTeam, battle.defenderPets);
        
        // Проверяем совпадение общего питомца (если выбран)
        if (selectedPet && selectedPet !== defenderData.generalPet) {
          return;
        }
        
        // Проверяем совпадение героев (без учета позиций)
        // Если выбраны герои, проверяем что все выбранные герои есть в защитной пачке
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
            patronages: defenderData.patronages // Для защиты ТОЖЕ передаем патронажи
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
    console.log('Пример результата:', results.length > 0 ? results[0] : 'нет');
    setSearchResults(results);
    setIsSearching(false);
  }, [battleData, extractAttackerData, extractDefenderData, isLoading, selectedCreatures]);

  // Функция для отображения команды с патронажами
  const renderTeamWithPatronage = useCallback((teamData, isAttacker = true) => {
    if (!teamData || !teamData.heroes) {
      return null;
    }
    
    const { heroes, patronages, generalPet, power, name } = teamData;
    
    console.log(`renderTeamWithPatronage ${isAttacker ? 'атака' : 'защита'}:`, {
      heroes,
      patronages,
      generalPet
    });
    
    return (
      <div className="team-with-patronage">
        {/* Общий питомец */}
        <div className="general-pet-section">
          <div className="general-pet-label">
            {isAttacker ? 'Общий питомец атаки' : 'Общий питомец защиты'}
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
                    
                    {/* Патронаж показываем ВСЕГДА, даже если он ### */}
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
        
        {/* Мощь пачки */}
        <div className="team-power">
          <span className="power-label">Мощь:</span>
          <span className="power-value">{power}</span>
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
          <p>Доступно героев: {heroes.length}</p>
          <p>Доступно питомцев: {pets.length}</p>
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
        
        <div className="selection-info">

          <p>Можно искать только по питомцу, только по героям или по комбинации.</p>
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
              Найдено защитных пачек: {searchResults.length}
            </h3>
          </div>
          
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={index} className="battle-result-item">
                <div className="battle-header">
                  <div className="battle-info">
                    <strong>#{index + 1}</strong> {result.attacker.name} vs {result.defender.name}
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
                      {result.matchedHeroes.map((hero, idx) => (
                        <span key={idx} className="selected-creature-tag">
                          {hero}
                        </span>
                      ))}
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
