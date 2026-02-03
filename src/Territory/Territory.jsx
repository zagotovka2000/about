// Territory.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './territory.css';

// Выносим питомцев наружу, чтобы они не пересоздавались
const patronazhs = ['Акс','Аль','Век','Каи','Мар','Мер','Оли','Хор'];

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

  // Функция извлечения героев из строки команды
  const extractHeroesFromTeam = useCallback((teamString) => {
    if (!teamString) return [];
    
    const heroes = [];
    const parts = teamString.trim().split(/\s+/);
    
    parts.forEach(part => {
      const match = part.match(/^([А-Яа-яA-Za-zЁё\-']+)\(/);
      if (match && match[1]) {
        heroes.push(match[1]);
      }
    });
    
    return heroes;
  }, []);

  // Функция извлечения патронажей из строки питомцев
  const extractPatronages = useCallback((petsString) => {
    if (!petsString || petsString.trim() === '' || petsString === '###') {
      return Array(5).fill(null);
    }
    
    const patronages = Array(5).fill(null);
    const parts = petsString.trim().split(/\s+/);
    
    for (let i = 0; i < Math.min(parts.length, 5); i++) {
      if (parts[i] && parts[i] !== '###') {
        const match = parts[i].match(/^([А-Яа-яA-Za-zЁё\-']+)\(/);
        if (match && match[1]) {
          patronages[i] = match[1];
        }
      }
    }
    
    return patronages;
  }, []);

  // Функция загрузки файлов - только один раз при монтировании
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Загрузка данных...');
      
      // Загружаем только один файл для теста
      const filePath = '/smBattle/wataha.txt';
      
      // Добавляем кэширование, чтобы избежать повторных загрузок
      const timestamp = new Date().getTime();
      const response = await fetch(`${filePath}?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log(`Файл загружен, размер: ${text.length} символов`);
      
      // Парсим файл
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const battles = [];
      
      // Пропускаем заголовок если есть
      const startIndex = lines[0].includes('date time') ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split('\t');
        
        if (parts.length >= 18) {
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
            replay: parts[17]?.trim() || ''
          };
          battles.push(battle);
        }
      }
      
      console.log(`Извлечено боев: ${battles.length}`);
      setBattleData(battles);
      
      // Извлекаем уникальных существ
      const creaturesSet = new Set();
      battles.forEach(battle => {
        // Герои из атакующей пачки
        const attackers = extractHeroesFromTeam(battle.attackerTeam);
        attackers.forEach(hero => {
          if (hero && !patronazhs.includes(hero)) {
            creaturesSet.add(hero);
          }
        });
        
        // Герои из защитной пачки
        const defenders = extractHeroesFromTeam(battle.defenderTeam);
        defenders.forEach(hero => {
          if (hero && !patronazhs.includes(hero)) {
            creaturesSet.add(hero);
          }
        });
      });
      
      const sortedCreatures = Array.from(creaturesSet).sort();
      setAvailableCreatures(sortedCreatures);
      console.log('Уникальных героев найдено:', sortedCreatures.length);
      
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      // Используем тестовые данные
      setAvailableCreatures(['Аль','Тея','Дор','Хай','Сел','Крв','Авг','Ори','Неб','Дан','Кей','Гал','ЛаК','Фаф','Исм','Эле','Баб','Ясм','Лир','Акс','Себ','Мор','Кир','Аст','Пеп','Руф','Хор','Эйд','Муш','Йор','Фол','Гус','Пол','Дже','Ара','Мод','Арт','Три','Цин','Айз','Айр','Сат','Авр','Гел','Век','Каи','Мар','Мер','Оли','К\'А','Кри','Ами','Фен','Бис','Лап','Айт','Дант','Ню','Чер','Чу','Шив','Юли','Зен','Астм','Атл','Клео','Изи','Кейн','Лю','Май','Фа','Хел','Эш']);
    } finally {
      setIsLoading(false);
      console.log('Загрузка завершена');
    }
  }, [extractHeroesFromTeam]);

  // Инициализация - загрузка данных только один раз
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Основная функция поиска
  const handleSearch = useCallback(() => {
    if (isLoading) {
      alert('Данные еще загружаются. Пожалуйста, подождите.');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    // Получаем выбранных существ
    const selectedPet = selectedCreatures[0]; // Первая ячейка - питомец
    const selectedHeroes = selectedCreatures.slice(1).filter(hero => hero !== null); // Остальные - герои
    
    if (selectedHeroes.length === 0) {
      setIsSearching(false);
      alert('Выберите хотя бы одного героя для поиска.');
      return;
    }

    console.log('Начинаем поиск...');
    console.log('Выбранный питомец:', selectedPet);
    console.log('Выбранные герои:', selectedHeroes);
    
    const results = [];
    
    // Проходим по всем боям
    battleData.forEach((battle, index) => {
      try {
        // Извлекаем героев из защитной пачки (первые 5 - герои, последний 6-й - общий питомец)
        const defenderHeroes = extractHeroesFromTeam(battle.defenderTeam);
        
        // Общий питомец защиты - последний герой в команде (6-й)
        const defenderGeneralPet = defenderHeroes.length >= 6 ? defenderHeroes[5] : null;
        
        // Герои защиты (первые 5)
        const defenderHeroesOnly = defenderHeroes.slice(0, 5);
        
        // Извлекаем патронажи защиты
        const defenderPatronages = extractPatronages(battle.defenderPets);
        
        // Проверяем совпадение общего питомца (если выбран)
        if (selectedPet && selectedPet !== defenderGeneralPet) {
          return;
        }
        
        // Проверяем совпадение героев (без учета позиций и порядка)
        const allHeroesFound = selectedHeroes.every(hero => 
          defenderHeroesOnly.includes(hero)
        );
        
        if (!allHeroesFound) {
          return;
        }
        
        // Извлекаем данные атакующей пачки
        const attackerHeroes = extractHeroesFromTeam(battle.attackerTeam);
        const attackerPatronages = extractPatronages(battle.attackerPets);
        
        // Общий питомец атаки - первый в списке питомцев
        const attackerGeneralPet = attackerPatronages[0] || null;
        
        // Если всё совпало - добавляем результат
        results.push({
          id: index,
          attacker: {
            name: battle.attackerName,
            power: battle.attackerPower,
            generalPet: attackerGeneralPet,
            heroes: attackerHeroes.slice(0, 5), // Первые 5 героев
            patronages: attackerPatronages.slice(1) // Патронажи для героев (со 2-го)
          },
          defender: {
            name: battle.defenderName,
            power: battle.defenderPower,
            generalPet: defenderGeneralPet,
            heroes: defenderHeroesOnly, // Первые 5 героев
            patronages: defenderPatronages.slice(0, 5) // Патронажи для 5 героев
          },
          points: battle.points,
          replay: battle.replay,
          matchedHeroes: selectedHeroes.filter(hero => defenderHeroesOnly.includes(hero))
        });
      } catch (error) {
        console.error('Ошибка при обработке боя:', error);
      }
    });
    
    console.log('Найдено результатов:', results.length);
    setSearchResults(results);
    setIsSearching(false);
  }, [battleData, extractHeroesFromTeam, extractPatronages, isLoading, selectedCreatures]);

  // Функция для отображения команды с патронажами
  const renderTeamWithPatronage = useCallback((teamData, isAttacker = true) => {
    if (!teamData || !teamData.heroes) {
      return null;
    }
    
    const { heroes, patronages, generalPet, power } = teamData;
    
    return (
      <div className="team-with-patronage">
        {/* Общий питомец - большая картинка */}
        {generalPet && (
          <div className="general-pet-container">
            <img 
              src={`/images/${generalPet}.png`}
              alt={generalPet}
              className="general-pet-image"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentNode.querySelector('.general-pet-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="general-pet-fallback">{generalPet}</div>
          </div>
        )}
        
        {/* Герои с патронажами */}
        <div className="heroes-container">
          {heroes.map((hero, index) => {
            // Для атаки: первый герой без патронажа, остальные с патронажами
            // Для защиты: все 5 героев могут иметь патронажи
            const patronIndex = isAttacker 
              ? (index === 0 ? null : index - 1) // Для атаки первый герой без патронажа
              : index; // Для защиты все герои могут иметь патронажи
            
            const patron = patronIndex !== null && patronIndex < patronages.length 
              ? patronages[patronIndex] 
              : null;
            
            return (
              <div key={index} className="hero-patron-container">
                <div className="hero-container">
                  <img 
                    src={`/images/${hero}.png`}
                    alt={hero}
                    className="hero-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentNode.querySelector('.hero-fallback');
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="hero-fallback">{hero}</div>
                  
                  {patron && (
                    <img 
                      src={`/images/${patron}.png`}
                      alt={`Патронаж: ${patron}`}
                      className="patronage-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.patron-fallback');
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                  )}
                  {patron && <div className="patron-fallback">{patron}</div>}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Мощь пачки */}
        <div className="team-power">{power}</div>
      </div>
    );
  }, []);

  // Разделение существ на питомцев и героев
  const { pets, heroes } = useMemo(() => {
    const petsList = [...patronazhs];
    const heroesList = availableCreatures.filter(creature => 
      !patronazhs.includes(creature)
    );
    
    return { 
      pets: petsList.sort((a, b) => a.localeCompare(b)), 
      heroes: heroesList.sort((a, b) => a.localeCompare(b)) 
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
          <div style={{marginTop: '10px', fontSize: '14px', color: '#aaa'}}>
            Загружаем файлы...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="territory-container">
      <div className="territory-upper-container">
        <h2 className="territory-title">Поиск защитных пачек</h2>
        
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
                        const fallback = e.target.parentNode.querySelector('.creature-fallback');
                        if (fallback) fallback.style.display = 'block';
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
                  {index === 0 ? 'Только питомцы' : `Герой ${index}`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Кнопки управления */}
          <div className="controls-container">
            <button 
              onClick={handleSearch} 
              className="search-button"
              disabled={isSearching || selectedCreatures.slice(1).every(creature => creature === null)}
            >
              {isSearching ? 'Поиск...' : 'Найти в файлах'}
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
          <p><strong>Первая ячейка:</strong> только для питомцев ({patronazhs.join(', ')}).</p>
          <p><strong>Остальные ячейки:</strong> только для героев.</p>
          <p>Все существа должны быть уникальными.</p>
          <p>Поиск ведется по защитным пачкам в загруженных файлах.</p>
        </div>
      </div>

      {/* Модальное окно выбора */}
      {selectionModal.isOpen && (
        <div className="creature-selection-modal">
          <div className="creature-selection-content">
            <div className="selection-modal-header">
              <h3>
                {selectionModal.cellIndex === 0 ? 'Выберите питомца' : `Выберите героя ${selectionModal.cellIndex}`}
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
                    : 'Нет доступных существ'}
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
                          const fallback = e.target.parentNode.querySelector('.selection-fallback');
                          if (fallback) fallback.style.display = 'block';
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
                    <strong>Бой #{index + 1}</strong> • {result.points} очков
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
                    <div className="team-title">Атакующая пачка</div>
                    <div className="player-name">{result.attacker.name}</div>
                    {renderTeamWithPatronage(result.attacker, true)}
                  </div>
                  
                  {/* Разделитель */}
                  <div className="teams-divider">
                    <div className="vs-text">VS</div>
                  </div>
                  
                  {/* Защитная пачка */}
                  <div className="team-container defending-team">
                    <div className="team-title">Защитная пачка</div>
                    <div className="player-name">{result.defender.name}</div>
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
