import { useState } from "react";
import styles from "./war.module.css";
import War1508 from './war1508/war1508';
const War = () => {

   const [activeWeek, setActiveWeek] = useState(null);

   const toggleWeek = (weekNumber) => {
     setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
   };


  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
      <p className={styles.abzac}>
        ВГ-атаки только по назначенным целям, иначе внезапно вам выдадут 
        артефакт за шиворот. Список чемпионов формируется, исходя из аморальных
        соображений генерала. Атака по цели без цели-освобождение от чемпионства навсегда. Идете исполнять наказание, которое выбирает вам худший друг.
      </p>
      </header>

  
      <div className={styles.conteiner}>
 
      
      <div className={styles.buttonsContainer}>
        <button
          onClick={() => toggleWeek(27)}
          className={styles.toggleButton}
        >
          15.08.2025 {activeWeek === 27 ? '▲' : '▼'}
        </button>
        
      </div>
      
      {activeWeek === 27 && <War1508 />}
      
    </div>










    </div>
  );
};

export default War;
