import React, { useState, useEffect, useMemo } from 'react';
import './WeekData.css';

const WeekData = ({ weekNumber }) => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'damage', direction: 'desc' });

  useEffect(() => {
   const fetchData = async () => {
     try {
       const response = await fetch(`/weeks/week${weekNumber}.txt`);
       if (!response.ok) {
         console.error(`HTTP error! status: ${response.status}`);
         setLoading(false);
         return;
       }
       const text = await response.text();
       console.log('Raw text length:', text.length);
       console.log('First 500 characters:', text.substring(0, 500));
       processData(text);
     } catch (error) {
       console.error('Error loading file:', error);
       setLoading(false);
     }
   };
   fetchData();
 }, [weekNumber]);

 const processData = (text) => {
   const lines = text.split('\n').filter(line => line.trim() !== '');
   console.log('Lines after split:', lines.length);
   
   const data = lines.map((line, index) => {
     const columns = line.split('\t');
     if (columns.length < 10) {
       console.warn(`Line ${index} has only ${columns.length} columns:`, line);
     }
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
   }).filter(item => {
     const keep = item.attackerName !== "att name" && 
                  item.attackerName.trim() !== "" && 
                  !isNaN(item.damage) && 
                  item.replay !== "бой";
     if (!keep) {
       console.log('Filtered out:', item);
     }
     return keep;
   });
   
   console.log('Final data count:', data.length);
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

  const sortedData = useMemo(() => {
    const sortableData = [...battleData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [battleData, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Вспомогательные функции для покровителей (без изменений)
  const extractPatronagePairs = (patronageString) => {
    if (!patronageString) return [];
    const tokens = patronageString.split(/\s+/).filter(token => token.length > 0);
    return tokens.map(token => {
      const match = token.match(/^([^(]+)\((\d+)\)$/);
      if (match) {
        return { hero: match[1], power: match[2] };
      } else {
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
    return <div className="loading">ЗАГРУЗКА ЕБАЛЫ...</div>;
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
          {/* Новая колонка "Босс" */}
          <div className="header-cell boss" role="columnheader">Босс</div>
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
              {/* Ячейка с уровнем босса */}
              <div className="table-cell boss" role="cell" data-label="Босс">
                {battle.level}
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

export default WeekData;
