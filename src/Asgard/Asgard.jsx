import React, { useState } from 'react';
import styles from "./asgard.module.css";
import Week27 from "./week27/week27";
import Week28 from './week28/week28';

const Asgard = () => {
  const [activeWeek, setActiveWeek] = useState(null);

  const toggleWeek = (weekNumber) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };

  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.abzac}>
          Асгард-без напоминаний ВСЕ бьют босса независимо от вида босса и его
          уровня. Более сильные игроки по понятной причине не должны бить босса в пятницу. 
          Ударить в пятницу сильному игроку не запрещается, но на вас будет смотреть игрок 
          с ником "Любимый", как на мрачного неудачника с тревиальными признаками нервного 
          навозника. Не ударить асгард до понедельника означает отсутствие у игрока желания 
          участвовать в общегильдейском событии. Следует выполнить наказание, которое выбирает 
          вам игрок, которого вы выбираете сами.
        </p>
      </header>
      
      <div className={styles.buttonsContainer}>
        <button 
          onClick={() => toggleWeek(27)}
          className={styles.toggleButton}
        >
          Маэстро 27 неделя {activeWeek === 27 ? '▲' : '▼'}
        </button>
        
        <button 
          onClick={() => toggleWeek(28)}
          className={styles.toggleButton}
        >
          Маэстро 28 неделя {activeWeek === 28 ? '▲' : '▼'}
        </button>
      </div>
      
      {activeWeek === 27 && <Week27 />}
      {activeWeek === 28 && <Week28 />}
    </div>
  );
};

export default Asgard;
