// Table/Table.js
import React, { useState, useMemo } from 'react';
import './table.css';

const rawData = [
  "G_G -9", "Big -8", "ZOV+1", "Пунь+3", "Федор+3", "VICTOR+3",
  "3.14+4", "ГошаПукаетВкозу+4", "Victori+5", "Souffle+5", "Diablo+6", "3ve+7",
  "Rom+7", "Лапочка+7", "Сварог+7","Оди+9","Виларт+10", "Nergal+10",
  "Kamul+10"
];

const parsePlayers = (data) => {
  return data.map(item => {
    const match = item.match(/^(.+?)([+-]\d+)$/);
    if (match) {
      return { name: match[1], offset: match[2] };
    }
    return { name: item, offset: '0' };
  }).sort((a, b) => {
    const offsetA = parseInt(a.offset, 10);
    const offsetB = parseInt(b.offset, 10);
    return offsetA - offsetB;
  });
};

const Table = () => {
  const [sortConfig, setSortConfig] = useState(null);
  const players = useMemo(() => parsePlayers(rawData), []);

  const sortedPlayers = useMemo(() => {
    if (!sortConfig) return players;
    const sorted = [...players];
    if (sortConfig.key === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sortConfig.direction === 'desc') sorted.reverse();
    } else if (sortConfig.key === 'offset') {
      sorted.sort((a, b) => parseInt(a.offset, 10) - parseInt(b.offset, 10));
      if (sortConfig.direction === 'desc') sorted.reverse();
    }
    return sorted;
  }, [players, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig?.key !== key) return ' ↕️';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-double-container">
      <div className="table-section">
        <div className="table-wrapper">
          <table className="timezone-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Ник
                </th>
                <th onClick={() => requestSort('offset')} style={{ cursor: 'pointer' }}>
                  Время{getSortIndicator('offset')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, idx) => (
                <tr key={idx}>
                  <td>{player.name}</td>
                  <td>{player.offset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="info-section">
        <div className="info-card">
          <h3>📜 Часовые пояса игроков, которым интересны награды за арену и ГА</h3>
          <div className="info-text">
            <p className="info-paragraph">
              Своих на арене и гранд-арене не бьем кроме случаев:
            </p>
            <p className="info-paragraph">
              — вы точно уверены, что коллеге до пизды на происходящее;
            </p>
            <p className="info-paragraph">
              — игрок находится на первом/втором/максимум третьем месте и у этого игрока 
              в момент получения Вами наград с арены часовой пояс отличается от вашего, 
              т.е. вы не засрете ему арену своей многострадальной атакой;
            </p>
            <p className="info-paragraph">
              — вы уточнили у игрока и он не против;
            </p>
            <p className="info-paragraph">
              Остальные места не трогаем, чтобы пройти дальше.
            </p>
            <p className="info-paragraph">
              Реплика "ну там только наши были" означает, что вам нужно прислать в телеграмм 
              скрин ответного сообщения от этого игрока с текстом "я прощаю тебя, засратый".
            </p>
            <p className="info-paragraph">
              Убогая отмазка "я флаг не заметил и в глаза ебусь" означает, что Вам необходимо 
              срочно получить направление к окулисту, чтобы он выписал Вам тройной стеклопакет, 
              чтобы вы прозрели между делом.
            </p>
            <p className="info-paragraph">
              Фото в телегу полученного нашлемного телескопа или иного прибора приветствуется.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
