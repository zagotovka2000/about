import { useState } from "react";
import styles from "./war.module.css";
import WarComponent from './WarComponent';

const War = () => {
  const [activeWar, setActiveWar] = useState(null);

  const wars = [
    { id: 'war1508', fileName: 'GW150825.txt', date: '15.08.2025' },
    { id: 'war1908', fileName: 'GW190825.txt', date: '19.08.2025' },
    { id: 'war2208', fileName: 'GW220825.txt', date: '22.08.2025' },
    // Добавляйте новые войны здесь
  ];

  const toggleWar = (warId) => {
    setActiveWar(activeWar === warId ? null : warId);
  };

  const generateDefensesPacks = async (fileName) => {
    try {
      const response = await fetch(`/${fileName}`);
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');

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

      const jsonData = JSON.stringify(packsData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace('.txt', '')}_defensesPacks.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Файл ${a.download} успешно сгенерирован`);
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
        {wars.map((war) => (
          <div key={war.id} className={styles.buttonsContainer}>
            <button
              onClick={() => toggleWar(war.id)}
              className={styles.toggleButton}
            >
              {war.date} {activeWar === war.id ? '▲' : '▼'}
            </button>
            
            <button
              onClick={() => generateDefensesPacks(war.fileName)}
              className={styles.generateButton}
            >
              Выгрузить в файл
            </button>

            {activeWar === war.id && (
              <WarComponent 
                fileName={war.fileName} 
                warDate={war.date} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default War;
