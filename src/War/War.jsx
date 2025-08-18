import { useState } from "react";
import styles from "./war.module.css";
import War1508 from './war1508/war1508';

const War = () => {
  const [activeWeek, setActiveWeek] = useState(null);

  const toggleWeek = (weekNumber) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };

  const generateDefensesPacks = async () => {
    try {
      // Загружаем данные из всех файлов войны
      const response = await fetch('/GW150825.txt');
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');

      // Формируем данные для записи
      const packsData = lines
        .map(line => {
          const columns = line.split('\t');
          return {
            attackerTeam: columns[4]?.split(' ').filter(Boolean) || [],
            defenderTeam: columns[8]?.split(' ').filter(Boolean) || [],
            points: parseInt(columns[9], 10),
            attackerName: columns[2],
            replay: columns[13]
          };
        })
        .filter(item => !isNaN(item.points) && item.points === 20)
        .map(battle => ({
          attackPack: battle.attackerTeam,
          defensePack: battle.defenderTeam,
          replay: battle.replay
        }));

      // Создаем JSON и предлагаем скачать
      const jsonData = JSON.stringify(packsData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'defensesPacks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Файл defensesPacks.json успешно сгенерирован');
    } catch (error) {
      console.error('Ошибка при генерации файла:', error);
    }
  };

  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.abzac}>
          ВГ-атаки только по назначенным целям, иначе внезапно вам выдадут 
          артефакт за шиворот. Список чемпионов формируется, исходя из аморальных
          соображений генерала. Атака по цели без цели-освобождение от чемпионства навсегда. 
          Идете исполнять наказание, которое выбирает вам худший друг.
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
          
          <button
            onClick={generateDefensesPacks}
            className={styles.generateButton}
          >
            Выгрузить в файл
          </button>
        </div>
        
        {activeWeek === 27 && <War1508 />}
      </div>
    </div>
  );
};

export default War;
