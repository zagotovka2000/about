import React, { useState, useEffect } from 'react';
import './war1508.css';


const War1508 = () => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/GW150825.txt');
        const text = await response.text();
        processData(text);
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
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
        attackerId: columns[1],
        attackerName: columns[2],
        attackerPower: columns[3],
        attackerTeam: columns[4],
        defenderId: columns[5],
        defenderName: columns[6],
        defenderPower: columns[7],
        defenderTeam: columns[8],
        points: parseInt(columns[9], 10),
        attackerPatronage: columns[10],
        defenderPatronage: columns[11],
        comment: columns[12],
        replay: columns[13]
      };
    }).filter(item => 
      item.attackerName && 
      item.attackerName.trim() !== "" && 
      !isNaN(item.points)
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

  const renderTeamWithPatronage = (teamString, patronageString, isAttacker = false) => {
    if (!teamString) return null;
    
    const heroes = teamString.split(' ').filter(Boolean);
    const patronagePairs = extractPatronagePairs(patronageString);

    return (
      <div className="team-with-patronage">
        {heroes.map((hero, index) => {
          const patronPair = isAttacker && index === 0 ? null : patronagePairs[isAttacker ? index - 1 : index];
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
    return <div className="loading">Загрузка данных о боях...</div>;
  }

  return (
    <div className="app">
      <h1>Выгрузка боев с войны от 15.08.2025 г.</h1>
      <div className="table-container" role="table" aria-label="Таблица результатов боев">
        <div className="table-header" role="rowgroup">
          <div className="header-cell attacker-team" role="columnheader">Пачка атаки</div>
          <div className="header-cell defender-team" role="columnheader">Пачка обороны</div>
          <div 
            className="header-cell points" 
            role="columnheader"
            onClick={() => requestSort('points')}
          >
            Очки {getSortIndicator('points')}
          </div>
          <div className="header-cell replay" role="columnheader">Запись</div>
        </div>

        {sortedData.map((battle, index) => {
          const pointsValue = battle.points;
          const pointsClass = pointsValue < 10 ? 'low-points' : 'high-points';
          return (
            <div key={index} className="table-row" role="row">
              <div className="table-cell attacker-team" role="cell" data-label="Пачка атаки">
                <div className="table-cell attacker-name" role="cell" data-label="Атакующий">
                  {battle.attackerName}
                </div>
                {renderTeamWithPatronage(battle.attackerTeam, battle.attackerPatronage, true)}
                <div className="power-value">{parseInt(battle.attackerPower).toLocaleString()}</div>
              </div>

              <div className="table-cell defender-team" role="cell" data-label="Пачка обороны">
                <div className="table-cell defender-name" role="cell" data-label="Защитник">
                  {battle.defenderName}
                </div>
                {renderTeamWithPatronage(battle.defenderTeam, battle.defenderPatronage)}
                <div className="power-value">{parseInt(battle.defenderPower).toLocaleString()}</div>
              </div>

              <div className={`table-cell points ${pointsClass}`} role="cell" data-label="Очки">
                {battle.points}
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

export default War1508;
