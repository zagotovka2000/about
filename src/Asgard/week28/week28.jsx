/* import React, { useState, useEffect } from 'react';
import './week27.css';

const Week28 = () => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'damage', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/week27.txt');
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
    return patronageString.split(' ').map(item => {
      const match = item.match(/^([^(]+)\((\d+)\)$/);
      return match ? { hero: match[1], power: match[2] } : null;
    }).filter(Boolean);
  };

  const renderTeamWithPatronage = (teamString, patronageString) => {
    if (!teamString) return null;
    
    const heroes = teamString.split(' ').filter(Boolean);
    const patronagePairs = extractPatronagePairs(patronageString);

    return (
      <div className="team-with-patronage">
        {heroes.map((hero, index) => {
          if (index === 0) {
            return (
              <div key={index} className="hero-container">
                <img 
                  src={`/images/${hero}.png`}
                  alt={''}
                  title={hero}
                  className="hero-image"
                  onError={(e) => {
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
                src={`/images/${hero}.png`}
                alt={''}
                title={hero}
                className="hero-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {patron && (
                <img 
                  src={`/images/${patron}.png`}
                  alt={''}
                  className="patronage-image"
                  title={`Покровитель: ${patron}`}
                  onError={(e) => {
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
      <h1>Week 27 Маэстро</h1>
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
          <div className="header-cell replay" role="columnheader">Запись</div>
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
              <div className="table-cell replay" role="cell" data-label="Запись">
                <a href={battle.replay} target="_blank" rel="noopener noreferrer" className="replay-link">
                  Бой
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Week28; */


import React, { useState, useEffect } from 'react';
import './week28.css';

const Week28 = () => {

  return (
    <div>Ага, писюлек пока тут...неделя даже не началась...</div>
  )
}
  export default Week28;