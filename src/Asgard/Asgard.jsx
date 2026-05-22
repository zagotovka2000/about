import React, { useState } from 'react';
import WeekData from './WeekData/WeekData';
import "./asgard.css";
// Функция определения типа недели (как в WeekData)
const getWeekType = (weekNumber) => (weekNumber % 2 === 0 ? 'osh' : 'maestro');
// Конфигурация недель
const weeksConfig = [ 
   { number: 42, label: 'Ош 17.05.2026' },
   { number: 41, label: 'Маэстро 10.05.2026' },
   { number: 40, label: 'Ош 03.05.2026' },
   { number: 38, label: 'Ош 19.04.2026' },
   { number: 39, label: 'Маэстро 26.04.2026' },
   { number: 37, label: 'Маэстро 12.04.2026' },
   { number: 36, label: 'Ош 05.04.2026' },
   { number: 35, label: 'Маэстро 29.03.2026' }, 
   { number: 34, label: 'Ош 22.03.2026' }, 
];

const Asgard = () => {
  const [activeWeek, setActiveWeek] = useState(null);

  const toggleWeek = (weekNumber) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };
  const oshWeeks = weeksConfig.filter(week => getWeekType(week.number) === 'osh');
  const maestroWeeks = weeksConfig.filter(week => getWeekType(week.number) === 'maestro');
  return (
    <div className="conteiner">
      <header className="header">
        <p className="abzac">
            Независимо от уровня начального босса, каждый, набрав СЛАБЕЙШИМИ пачками свои 10 млн личного урона, останавливается, дожидаясь вместе с остальными,когда все наберут десятку. Сильнейшей пачкой бьют сразу только игроки,которые не смогли набрать 10 млн, сделав четыре атаки. Европаком по Ошу 150 лвл и Орионом с Августом на Маэстро на 150 лвл не бьем вообще, оставляем на 160. Исключение-опять же более слабые игроки, которые не смогли набрать личный урон после 4 атак иными пачками или которым не повезло с рандомом, которые понимают,что на 160 лвл босса набрать минимальный урон будет набрать тяжело. Граждане, которые будут набивать урон по слабым боссам после того,как набрали свои 10 млн урона, будут внезапно занесены в картотеку пропавших без вести. По боссам 160 лвл никаких ограничений нет. 
        </p>
      </header>
      <div className="buttonsContainer">
        <div className="column osh-column">
          <h3 className="column-title">Ош</h3>
          {oshWeeks.map(week => (
            <button
              key={week.number}
              onClick={() => toggleWeek(week.number)}
              className="toggleButton"
            >
              {week.label} {activeWeek === week.number ? '▲' : '▼'}
            </button>
          ))}
        </div>
        <div className="column maestro-column">
          <h3 className="column-title">Маэстро</h3>
          {maestroWeeks.map(week => (
            <button
              key={week.number}
              onClick={() => toggleWeek(week.number)}
              className="toggleButton"
            >
              {week.label} {activeWeek === week.number ? '▲' : '▼'}
            </button>
          ))}
        </div>
      </div>

      {/* Рендер активной недели */}
      {activeWeek && <WeekData weekNumber={activeWeek} />}
    </div>
  );
};

export default Asgard;
