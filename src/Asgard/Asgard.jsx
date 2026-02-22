import React, { useState } from 'react';
import WeekData from './WeekData/WeekData';
import "./asgard.css";

// Конфигурация недель
const weeksConfig = [
  { number: 27, label: 'Маэстро 01.02.2026' },
  { number: 28, label: 'Ош 07.02.2026' },
  { number: 29, label: 'Маэстро 15.02.2026' },
  { number: 30, label: 'Ош 22.02.2026' },
/*   { number: 31, label: 'Новый босс 01.03.2026' },  */

];

const Asgard = () => {
  const [activeWeek, setActiveWeek] = useState(null);

  const toggleWeek = (weekNumber) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };

  return (
    <div className="conteiner">
      <header className="header">
        <p className="abzac">
            Независимо от уровня начального босса, каждый, набрав СЛАБЕЙШИМИ пачками свои 10 млн личного урона, останавливается, дожидаясь вместе с остальными,когда все наберут десятку. Сильнейшей пачкой бьют сразу только игроки,которые не смогли набрать 10 млн, сделав четыре атаки. Европаком по Ошу 150 лвл и Орионом с Августом на Маэстро на 150 лвл не бьем вообще, оставляем на 160. Исключение-опять же более слабые игроки, которые не смогли набрать личный урон после 4 атак иными пачками или которым не повезло с рандомом, которые понимают,что на 160 лвл босса набрать минимальный урон будет набрать тяжело. Граждане, которые будут набивать урон по слабым боссам после того,как набрали свои 10 млн урона, будут внезапно занесены в картотеку пропавших без вести. По боссам 160 лвл никаких ограничений нет. 
        </p>
      </header>
      
      <div className="buttonsContainer">
        {weeksConfig.map(week => (
          <button
            key={week.number}
            onClick={() => toggleWeek(week.number)}
            className="toggleButton"
          >
            {week.label} {activeWeek === week.number ? '▲' : '▼'}
          </button>
        ))}
      </div>

      {/* Рендер активной недели */}
      {activeWeek && <WeekData weekNumber={activeWeek} />}
    </div>
  );
};

export default Asgard;

