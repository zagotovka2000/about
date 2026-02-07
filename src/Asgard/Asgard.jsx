import React, { useState } from 'react';
import "./asgard.css"
import Week27 from "./week27/week27";
import Week28 from './week28/week28';

const Asgard = () => {
  const [activeWeek, setActiveWeek] = useState(null);

  const toggleWeek = (weekNumber) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };

  return (
    <div className="conteiner">
      <header className="header">
        <p className="abzac">
            Независимо от уровня начального босса, каждый, набрав СЛАБЕЙШИМИ пачками свои 10 млн личного урона, останавливается, дожидаясь вместе с остальными,когда все наберут десятку. Сильнейшей пачкой бьют сразу только игроки,которые не смогли набрать 10 млн, сделав четыре атаки. Европаком по Ошу на 150 лвл не бьем вообще, оставляем на 160. Исключение-опять же более слабые игроки, которые не смогли набрать личный урон или которым не повезло с рандомом, которые понимают,что на 160 набрать урон будет набрать тяжело. По Маэстро - орион с дорианом желательно оставлять на 150 лвл.
        </p>
      </header>
      
      <div className="buttonsContainer">
        <button 
          onClick={() => toggleWeek(27)}
          className="toggleButton"
        >
          Маэстро 01.02.2026 {activeWeek === 27 ? '▲' : '▼'}
        </button>
        <button 
          onClick={() => toggleWeek(28)}  // ← ИСПРАВЛЕНО: было toggleWeek(27)
          className="toggleButton"
        >
          Ош 07.02.2026 {activeWeek === 28 ? '▲' : '▼'} 
        </button>
      </div>
      
      {activeWeek === 27 && <Week27 />}
      {activeWeek === 28 && <Week28 />}
    </div>
  );
};

export default Asgard;
