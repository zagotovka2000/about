import React, { useState, useEffect } from 'react';
import './week29.css';

const Week29 = () => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'damage', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/week29.txt');
        const text = await response.text();
        processData(text);
      } catch (error) {
        console.error('Error loading file:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');

    const data = lines.map(line => {
      const columns = line.split('\t');
      return {
        dateTime: columns[0],
        level: columns[1],
        week: columns[2],
        attackerId: columns[3],
        attackerName: columns[4],
        attackerPower: columns[5],
        attackerTeam: columns[6],
        damage: parseInt(columns[7], 10),
        attackerPatronage: columns[8],
        replay: columns[9]
      };
    }).filter(item => 
      item.attackerName !== "att name" && 
      item.attackerName.trim() !== "" && 
      item.damage !== "не число" && 
      item.replay !== "бой"
    );

    setBattleData(data);
    setLoading(false);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...battleData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [battleData, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const extractPatronagePairs = (patronageString) => {
   if (!patronageString) return [];
   // Разделяем по пробелам, удаляем пустые строки (учёт множественных пробелов)
   const tokens = patronageString.split(/\s+/).filter(token => token.length > 0);
   return tokens.map(token => {
     const match = token.match(/^([^(]+)\((\d+)\)$/);
     if (match) {
       // Стандартный формат: Имя(число)
       return { hero: match[1], power: match[2] };
     } else {
       // Нестандартный формат (например, "###") – считаем весь токен именем
       return { hero: token, power: null };
     }
   });
 };


  const renderTeamWithPatronage = (teamString, patronageString) => {
   if (!teamString) return null;
   
   const heroes = teamString.split(' ').filter(Boolean);
   const patronagePairs = extractPatronagePairs(patronageString);
 
   return (
     <div className="team-with-patronage">
       {heroes.map((heroWithLevel, index) => {
         // Извлекаем имя героя без уровня (всё до открывающей скобки)
         const heroName = heroWithLevel.split('(')[0].trim();
         
         if (index === 0) {
           return (
             <div key={index} className="hero-container">
               <img 
                 src={`/images/heroes/${heroName}.png`}
                 alt={heroName}
                 title={heroWithLevel}
                 className="hero-image"
                 onError={(e) => {
                   console.error(`Failed to load image: /images/heroes/${heroName}.png`);
                   e.target.style.display = 'none';
                 }}
               />
             </div>
           );
         }
         
         const patronPair = patronagePairs[index - 1];
         const patron = patronPair ? patronPair.hero : null;
 
         return (
           <div key={index} className="hero-container">
             <img 
               src={`/images/heroes/${heroName}.png`}
               alt={heroName}
               title={heroWithLevel}
               className="hero-image"
               onError={(e) => {
                 console.error(`Failed to load image: /images/heroes/${heroName}.png`);
                 e.target.style.display = 'none';
               }}
             />
             {patron && (
               <img 
                 src={`/images/heroes/${patron}.png`}
                 alt={`Покровитель: ${patron}`}
                 className="patronage-image"
                 title={`Покровитель: ${patron}`}
                 onError={(e) => {
                   console.error(`Failed to load patron image: /images/heroes/${patron}.png`);
                   e.target.style.display = 'none';
                 }}
               />
             )}
           </div>
         );
       })}
     </div>
   );
 };

  if (loading) {
    return <div className="loading">Loading battle data...</div>;
  }

  return (
    <div className="app">
      <div className="table-container" role="table" aria-label="Battle Results Table">
        <div className="table-header" role="rowgroup">
          <div 
            className="header-cell name" 
            role="columnheader"
            onClick={() => requestSort('attackerName')}
          >
            Сортировка по нику{getSortIndicator('attackerName')}
          </div>
          <div className="header-cell team" role="columnheader">Команда</div>
          <div 
            className="header-cell damage" 
            role="columnheader"
            onClick={() => requestSort('damage')}
          >
            Сортир. по урону{getSortIndicator('damage')}
          </div>

        </div>

        {sortedData.map((battle, index) => {
          const damageValue = battle.damage;
          const damageClass = damageValue < 10000000 ? 'low-damage' : 'high-damage';
          return (
            <div key={index} className="table-row" role="row">
              <div className="table-cell name" role="cell" data-label="Имя атакующего">
                <div className="player-name">{battle.attackerName}</div>
              </div>
              <div className="table-cell team" role="cell" data-label="Команда">
                {renderTeamWithPatronage(battle.attackerTeam, battle.attackerPatronage)}
              </div>
              <div className={`table-cell damage ${damageClass}`} role="cell" data-label="Урон">
                {battle.damage.toLocaleString()}
              </div>
 
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Week29;
