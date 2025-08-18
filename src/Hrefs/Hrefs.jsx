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

  const findMatches = () => {
    if (isLoading) return;
    
    if (!pack.pet || pack.heroes.some(hero => !hero)) {
      alert('Заполните все слоты героев и выберите питомца');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const searchTeam = [...pack.heroes, pack.pet].filter(Boolean);
          const foundMatches = defensesPacks.filter(item => 
            JSON.stringify(item.defensePack) === JSON.stringify(searchTeam)
          );

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
      <div className={styles.mainWrapper}>
        <h1 className={styles.title}>Герои и Питомцы</h1>
        
        <div className={styles.packSection}>
          <div className={styles.packSlots}>
            <h2 className={styles.sectionTitle}>Пачка</h2>
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
              Подобрать пачку
            </button>
          </div>

          <div className={styles.packResult}>
            <h3 className={styles.sectionTitle}>Результаты поиска (20 очков)</h3>
            {matches.length > 0 ? (
              <div className={styles.matchesContainer}>
                {matches.map((match, index) => {
                  const attackHeroes = match.attackPack.slice(0, 5);
                  const attackPet = match.attackPack[5];
                  
                  return (
                    <div key={index} className={styles.matchItem}>
                      <h4 className={styles.matchTitle}>Найденная атакующая пачка:</h4>
                      
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
