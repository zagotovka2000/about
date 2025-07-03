import React, { useState, useEffect } from 'react';
import './stats.css';

const Stats = () => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/herr1g.txt');
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
        attackerName: columns[2],
        attackerPower: columns[3],
        attackerTeam: columns[4],
        defenderName: columns[6],
        defenderPower: columns[7],
        defenderTeam: columns[8],
        points: columns[9],
        attackerPatronage: columns[10],
        defenderPatronage: columns[11],
        replay: columns[12]
      };
    });

    setBattleData(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading battle data...</div>;
  }

  return (
    <div className="app">
      <h1>Battle Results</h1>
      <div className="table-container" role="table" aria-label="Battle Results Table">
        {/* Заголовки таблицы */}
        <div className="table-header" role="rowgroup">
          <div className="header-cell attacker" role="columnheader">Атака/Мощь</div>
          <div className="header-cell team" role="columnheader">Пачка атаки</div>
          <div className="header-cell defender" role="columnheader">Атака/Мощь</div>
          <div className="header-cell team" role="columnheader">Пачка защиты</div>
          <div className="header-cell points" role="columnheader">Гроши</div>
          <div className="header-cell replay" role="columnheader">Запись</div>
        </div>

        {/* Строки с данными */}
        {battleData.map((battle, index) => {
          const pointsValue = parseInt(battle.points, 10);
          const pointsClass = pointsValue < 20 ? 'low' : '';
          return (
            <div key={index} className="table-row" role="row">
              <div className="table-cell attacker" role="cell" data-label="Атака/Мощь">
                <div className="player-name">{battle.attackerName}</div>
                <div>{battle.attackerPower}</div>
              </div>
              <div className="table-cell team" role="cell" data-label="Пачка атаки">{battle.attackerTeam}</div>
              <div className="table-cell defender" role="cell" data-label="Атака/Мощь">
                <div className="player-name">{battle.defenderName}</div>
                <div>{battle.defenderPower}</div>
              </div>
              <div className="table-cell team" role="cell" data-label="Пачка защиты">{battle.defenderTeam}</div>
              <div className="table-cell points" role="cell" data-label="Гроши">
                <span className={`points-badge ${pointsClass}`}>
                  {battle.points}
                </span>
              </div>
              <div className="table-cell replay" role="cell" data-label="Запись">
                <a href={battle.replay} target="_blank" rel="noopener noreferrer" className="replay-link">
                  View
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
