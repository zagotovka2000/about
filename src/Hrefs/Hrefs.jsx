import React, { useState } from 'react';
import styles from './Hrefs.module.css';
import defensesPacks from '../defensesPacks.json';

const Hrefs = () => {
  const petsList = ['Акс', 'Аль', 'Век', 'Каи', 'Оли', 'Хор', 'Мар', 'Мер'];
  const heroesList = ['Авг', 'Авр', 'Айз', 'Айр', 'Алв', 'Ами', 'Анд', 'Ара', 'Арт', 'Аст', 'Баб', 'Без', 'Гал','Гел','Дан','Дже','Джи','Джу','Дор','Зир','Исм','Йор','Кай','Кей','Кир','Крв','Кри','Крн','Кха','Лар','Лил','Лир','Лиэ','Лук','Лют','Май','Мод','Мор','Мрк','Муш','Неб','Ори','Пеп','Пол','Руф','Сат','Себ','Сел','Сор','Суд','Тем','Тес','Тея','Три','Фаф','Фоб','Фок','Фол','Хай','Цин','Чаб','Эйд','Эль','Юли','Ясм'].filter(
    hero => !petsList.includes(hero)
  );

  const [pack, setPack] = useState({
    pet: null,
    heroes: Array(5).fill(null)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна

  const clearAllFields = () => {
    setPack({
      pet: null,
      heroes: Array(5).fill(null)
    });
    setMatches([]);
  };

  const findMatches = () => {
   if (isLoading) return;
   
   if (!pack.pet || pack.heroes.some(hero => !hero)) {
     // Вместо alert показываем модальное окно
     setShowModal(true);
     return;
   }
 
   setIsLoading(true);
   setProgress(0);
   setMatches([]);
   
   const interval = setInterval(() => {
     setProgress(prev => {
       if (prev >= 100) {
         clearInterval(interval);
         
         // Создаем отсортированные копии для сравнения
         const searchHeroes = [...pack.heroes].sort();
         const searchPet = pack.pet;
         
         const foundMatches = defensesPacks.filter(item => {
           // Сравниваем питомцев
           if (item.defensePack[5] !== searchPet) return false;
           
           // Сравниваем героев (первые 5 элементов)
           const defenseHeroes = [...item.defensePack.slice(0, 5)].sort();
           
           // Проверяем, что массивы идентичны после сортировки
           return JSON.stringify(defenseHeroes) === JSON.stringify(searchHeroes);
         });
 
         setMatches(foundMatches);
         setIsLoading(false);
         return 0;
       }
       return prev + 1;
     });
   }, 50);
 };

  const handlePetClick = (pet) => {
    if (pack.pet === pet) {
      setPack({...pack, pet: null});
      return;
    }
    if (!pack.pet) {
      setPack({...pack, pet});
    }
  };

  const handleHeroClick = (hero) => {
    const heroIndex = pack.heroes.indexOf(hero);
    if (heroIndex !== -1) {
      const newHeroes = [...pack.heroes];
      newHeroes[heroIndex] = null;
      setPack({...pack, heroes: newHeroes});
      return;
    }
    const emptySlotIndex = pack.heroes.findIndex(h => h === null);
    if (emptySlotIndex !== -1) {
      const newHeroes = [...pack.heroes];
      newHeroes[emptySlotIndex] = hero;
      setPack({...pack, heroes: newHeroes});
    }
  };

  const handlePackPetClick = () => {
    setPack({...pack, pet: null});
  };

  const handlePackHeroClick = (index) => {
    const newHeroes = [...pack.heroes];
    newHeroes[index] = null;
    setPack({...pack, heroes: newHeroes});
  };

  return (
    <div className={styles.container}>
      {/* Модальное окно */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className={styles.modalContent}>
              <p>Не,не, хуйню ищем-надо заполнить ячейки...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.mainWrapper}>
        <h1 className={styles.title}></h1>
        
        <div className={styles.packSection}>
          <div className={styles.packSlots}>
            <div className={styles.packHeader}>
              <h2 className={styles.sectionTitle}>Пачка, которую надо победить</h2>
              <button 
                className={styles.clearButton}
                onClick={clearAllFields}
                disabled={isLoading}
                title="Очистить все поля"
              >
                🗑️ Очистить
              </button>
            </div>
            
            <div className={styles.packGrid}>
              <div className={styles.card}>
                {pack.pet ? (
                  <img 
                    src={`/images/${pack.pet}.png`} 
                    alt={pack.pet}
                    className={styles.packImage}
                    onClick={handlePackPetClick}
                    onError={(e) => e.target.src = '/images/placeholder.png'}
                  />
                ) : (
                  <div className={styles.emptySlot}>Питомец</div>
                )}
                <span className={styles.name}>{pack.pet || 'Пусто'}</span>
              </div>

              {pack.heroes.map((hero, index) => (
                <div key={index} className={styles.card}>
                  {hero ? (
                    <img 
                      src={`/images/${hero}.png`}
                      alt={hero}
                      className={styles.packImage}
                      onClick={() => handlePackHeroClick(index)}
                      onError={(e) => e.target.src = '/images/placeholder.png'}
                    />
                  ) : (
                    <div className={styles.emptySlot}>Герой {index + 1}</div>
                  )}
                  <span className={styles.name}>{hero || 'Пусто'}</span>
                </div>
              ))}
            </div>
            
            {isLoading && (
              <div className={styles.loaderContainer}>
                <div 
                  className={styles.loaderBar} 
                  style={{ width: `${progress}%` }}
                ></div>
                <div className={styles.loaderText}>Поиск... {progress}%</div>
              </div>
            )}
          </div>

          <div className={styles.packButton}>
            <button 
              className={styles.generateButton}
              onClick={findMatches}
              disabled={isLoading}
            >
              Найти пачку
            </button>
          </div>

          <div className={styles.packResult}>
            <h3 className={styles.sectionTitle}>Результат</h3>
            {matches.length > 0 ? (
              <div className={styles.matchesContainer}>
                {matches.map((match, index) => {
                  const attackHeroes = match.attackPack.slice(0, 5);
                  const attackPet = match.attackPack[5];
                  const defenseHeroes = match.defensePack.slice(0, 5);
                  const defensePet = match.defensePack[5];
                  
                  return (
                    <div key={index} className={styles.matchItem}>
                      <div className={styles.matchComparison}>
                        {/* Атакующая пачка */}
                        <div className={styles.packComparison}>
                          <h4 className={styles.packTitle}>Атакующая пачка</h4>
                          <div className={styles.foundPackGrid}>
                            {attackHeroes.map((hero, i) => (
                              <div key={i} className={styles.foundCard}>
                                <img 
                                  src={`/images/${hero}.png`}
                                  alt={hero}
                                  className={styles.foundImage}
                                  onError={(e) => e.target.src = '/images/placeholder.png'}
                                />
                                <span className={styles.foundName}>{hero}</span>
                              </div>
                            ))}
                            
                            <div className={styles.foundCard}>
                              <img 
                                src={`/images/${attackPet}.png`}
                                alt={attackPet}
                                className={styles.foundImage}
                                onError={(e) => e.target.src = '/images/placeholder.png'}
                              />
                              <span className={styles.foundName}>{attackPet}</span>
                            </div>
                          </div>
                          <div className={styles.powerInfo}>
                            Мощь атаки: <strong>{match.attackPower || 0}</strong>
                          </div>
                        </div>

                        <div className={styles.vsSeparator}>VS</div>

                        {/* Защитная пачка */}
                        <div className={styles.packComparison}>
                          <h4 className={styles.packTitle}>Защитная пачка</h4>
                          <div className={styles.foundPackGrid}>
                            {defenseHeroes.map((hero, i) => (
                              <div key={i} className={styles.foundCard}>
                                <img 
                                  src={`/images/${hero}.png`}
                                  alt={hero}
                                  className={styles.foundImage}
                                  onError={(e) => e.target.src = '/images/placeholder.png'}
                                />
                                <span className={styles.foundName}>{hero}</span>
                              </div>
                            ))}
                            
                            <div className={styles.foundCard}>
                              <img 
                                src={`/images/${defensePet}.png`}
                                alt={defensePet}
                                className={styles.foundImage}
                                onError={(e) => e.target.src = '/images/placeholder.png'}
                              />
                              <span className={styles.foundName}>{defensePet}</span>
                            </div>
                          </div>
                          <div className={styles.powerInfo}>
                            Мощь защиты: <strong>{match.defensePower || 0}</strong>
                          </div>
                        </div>
                      </div>
                      
                      {match.replay && (
                        <div className={styles.replayLinkContainer}>
                          <a 
                            href={match.replay} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.replayLink}
                          >
                            Посмотреть бой
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noMatches}>
                {!isLoading ? "Совпадений не найдено" : "Поиск совпадений..."}
              </div>
            )}
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={`${styles.section} ${styles.petsSection}`}>
            <h2 className={styles.sectionTitle}>Питомцы</h2>
            <div className={styles.petsGrid}>
              {petsList.map(pet => (
                <div key={pet} className={styles.card} onClick={() => handlePetClick(pet)}>
                  <img 
                    src={`/images/${pet}.png`}
                    alt={pet}
                    className={styles.image}
                    onError={(e) => e.target.src = '/images/placeholder.png'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.section} ${styles.heroesSection}`}>
            <h2 className={styles.sectionTitle}>Герои</h2>
            <div className={styles.heroesGrid}>
              {heroesList.map(hero => (
                <div key={hero} className={styles.card} onClick={() => handleHeroClick(hero)}>
                  <img 
                    src={`/images/${hero}.png`}
                    alt={hero}
                    className={styles.image}
                    onError={(e) => e.target.src = '/images/placeholder.png'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hrefs;
