import React, { useState } from 'react';
import './War.css';

const War = () => {
  const [activeWar, setActiveWar] = useState(null);

  const wars = [
    { id: 'war1508', fileName: 'GW150825.txt', date: '15.12.2025' },
    { id: 'war1908', fileName: 'GW190825.txt', date: '19.12.2025' },
    { id: 'war2208', fileName: 'GW220825.txt', date: '22.12.2025' },
  ];

  const toggleWar = (warId) => {
    setActiveWar(activeWar === warId ? null : warId);
  };

  const generateDefensesPacks = async (fileName) => {
    try {
      const response = await fetch(`/${fileName}`);
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');

      // Анализируем заголовки чтобы найти правильные колонки
      let attPowerColumn = 5; // предположим по умолчанию
      let defPowerColumn = 7; // предположим по умолчанию

      if (lines.length > 0) {
        const headers = lines[0].split('\t');
        headers.forEach((header, index) => {
          if (header.toLowerCase().includes('att power')) attPowerColumn = index;
          if (header.toLowerCase().includes('def power')) defPowerColumn = index;
        });
        
        console.log('Найдены колонки:', { attPowerColumn, defPowerColumn });
      }

      const packsData = lines
        .map((line, index) => {
          // Пропускаем заголовок
          if (index === 0) return null;
          
          const columns = line.split('\t');
          return {
            attackerTeam: columns[4]?.split(' ').filter(Boolean) || [],
            defenderTeam: columns[8]?.split(' ').filter(Boolean) || [],
            points: parseInt(columns[9], 10),
            attackerName: columns[2],
            replay: columns[13],
            attackPower: parseInt(columns[attPowerColumn], 10) || 0,
            defensePower: parseInt(columns[defPowerColumn], 10) || 0
          };
        })
        .filter(item => item && !isNaN(item.points) && item.points === 20)
        .map(battle => ({
          attackPack: battle.attackerTeam,
          defensePack: battle.defenderTeam,
          replay: battle.replay,
          attackPower: battle.attackPower,
          defensePower: battle.defensePower
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

      console.log(`Файл ${a.download} успешно сгенерирован с данными о мощи`);
      alert(`Файл ${a.download} успешно сгенерирован!`);
    } catch (error) {
      console.error('Ошибка при генерации файла:', error);
      alert('Ошибка при генерации файла: ' + error.message);
    }
  };

  return (
   <div className="war-container">
     <div className="war-header">
       <p className="war-description">
         Высокий поклон нашему новому главнокомандующему Виларту. ВГ бьем по целям, если Виларт не сообщит,что атакуем иначе. Кто наконячит на ВГ на ровном месте, Виларт выбирает наказание для испытанта из вкладки "Наказания" и выдает ему за артефакт за шиворот. Список чемпионов формируется, исходя из аморальных соображений главнокомандующего и по его внезапному озарению.
       </p>
     </div>

     <div className="war-list">
       {wars.map(war => (
         <div 
           key={war.id}
           className={`war-card ${activeWar === war.id ? 'active' : ''}`}
           onClick={() => setActiveWar(activeWar === war.id ? null : war.id)}
         >
           <div className="war-card-header">
             <span className="war-date">{war.date}</span>
             <span className="war-toggle">
               {activeWar === war.id ? '▲' : '▼'}
             </span>
           </div>
           
           {activeWar === war.id && (
             <div className="war-card-content">
               {/* Здесь будет компонент WarComponent */}
               <p className='btn'>Данные о войне {war.date}</p>
               <button className="war-download-btn">
                 Скачать данные
               </button>
              <p className="txtLoadBattle">Выгрузку боев пока больше не делаем</p> 
             </div>
           )}
         </div>
       ))}
     </div>
   </div>
 );
};

export default War;
