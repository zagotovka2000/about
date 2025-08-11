import React, { useState } from 'react';
import './table.css'
const Table = () => {
  // Исходные данные игроков
  const initialPlayers = [
    // { name: 'Русский', active: 0, prestige: 1, titanite: 0, asgard: 0 },
    // { name: 'Русская', active: 0, prestige: 2, titanite: 0, asgard: 0 },
    // { name: 'Хам', active: 1, prestige: 2, titanite: 1, asgard: 0 },
    { name: 'Alex', active: 0, prestige: 1, titanite: 0, asgard: 0 },
    { name: 'Дин', active: 0, prestige: 1, titanite: 0, asgard: 0 },
  ];

  const [players, setPlayers] = useState(initialPlayers);

  // Обновление значения в ячейке
  const handleChange = (playerIndex, field, value) => {
    const newPlayers = [...players];
    newPlayers[playerIndex][field] = Number(value) || 0;
    setPlayers(newPlayers);
  };

  // Подсчёт total для игрока
  const calculateTotal = (player) => {
    return player.active + player.prestige + player.titanite + player.asgard;
  };

  return (
    <div className="table">
      {/* Заголовки колонок */}
      <div className="table-row header">
        <div className="table-cell">Игрок</div>
        <div className="table-cell">Актив</div>
        <div className="table-cell">Престиж</div>
        <div className="table-cell">Титанит</div>
        <div className="table-cell">Асгард</div>
        <div className="table-cell">Total</div>
      </div>

      {/* Строки с данными игроков */}
      {players.map((player, index) => (
        <div key={index} className="table-row">
          <div className="table-cell">{player.name}</div>
          <div className="table-cell">
            <input
              type="number"
              value={player.active}
              onChange={(e) => handleChange(index, 'active', e.target.value)}
            />
          </div>
          <div className="table-cell">
            <input
              type="number"
              value={player.prestige}
              onChange={(e) => handleChange(index, 'prestige', e.target.value)}
            />
          </div>
          <div className="table-cell">
            <input
              type="number"
              value={player.titanite}
              onChange={(e) => handleChange(index, 'titanite', e.target.value)}
            />
          </div>
          <div className="table-cell">
            <input
              type="number"
              value={player.asgard}
              onChange={(e) => handleChange(index, 'asgard', e.target.value)}
            />
          </div>
          <div className="table-cell">{calculateTotal(player)}</div>
        </div>
      ))}
    </div>
  );
};

export default Table;
