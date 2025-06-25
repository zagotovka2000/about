<<<<<<< HEAD
import React, { useState } from 'react';
import './hrefs.css';

const Hrefs = () => {
  // Countries data
  const countries = [
    {code: "AD", name: "Andorra"},
    {code: "AE", name: "United Arab Emirates"},
    {code: "AF", name: "Afghanistan"},
    // ... (include all other countries from your list)
    {code: "ZW", name: "Zimbabwe"}
  ];

  // Configuration
  const teamsCount = 16; // Must be power of 2
  const currentYear = new Date().getFullYear();
  const tournamentYear = currentYear + Math.floor(Math.random() * 21);

  // State for matches and winners
  const [rounds, setRounds] = useState(() => {
    // Initialize tournament with random countries and scores
    const roundsCount = Math.log2(teamsCount);
    const selectedCountries = [...countries]
      .sort(() => 0.5 - Math.random())
      .slice(0, teamsCount);
    
    const initialRounds = [];
    let currentRound = selectedCountries.map(country => ({
      ...country,
      score: Math.floor(Math.random() * 6) // Random score 0-5
    }));
    
    for (let round = 0; round < roundsCount; round++) {
      if (round === 0) {
        // First round - pair teams
        const paired = [];
        for (let i = 0; i < currentRound.length; i += 2) {
          paired.push([currentRound[i], currentRound[i + 1]]);
        }
        initialRounds.push(paired);
      } else {
        // Subsequent rounds - winners from previous round
        const winners = initialRounds[round - 1].map(match => 
          match[0].score > match[1].score ? match[0] : match[1]
        );
        
        const nextRound = [];
        for (let i = 0; i < winners.length; i += 2) {
          const team1 = {...winners[i], score: Math.floor(Math.random() * 6)};
          const team2 = {...winners[i + 1], score: Math.floor(Math.random() * 6)};
          nextRound.push([team1, team2]);
        }
        initialRounds.push(nextRound);
      }
    }
    
    return initialRounds;
  });

  return (
    <div className="tournament-wrapper">
      <h1>Tournament - {tournamentYear}</h1>
      
      <div className="tournament">
        {rounds.map((roundMatches, roundIndex) => (
          <div key={`round-${roundIndex}`} className="round">
            <h3>
              {roundIndex === 0 ? 'Round of 16' : 
               roundIndex === 1 ? 'Quarter Finals' :
               roundIndex === 2 ? 'Semi Finals' : 
               'Final'}
            </h3>
            
            {roundMatches.map((match, matchIndex) => (
              <div key={`match-${roundIndex}-${matchIndex}`} className="match">
                <div className="teams">
                  {match.map((team, teamIndex) => (
                    <div key={`team-${roundIndex}-${matchIndex}-${teamIndex}`} className="team">
                      <span className="team-flag">
                        <span className={`flag flag-${team.code}`}></span>
                      </span>
                      <span className="team-name" title={team.name}>
                        {team.name}
                      </span>
                      <span className="team-score">
                        {team.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
=======
import React from "react";
import "./hrefs.css";

const Hrefs = () => {
  const leftColumnData = [
    { id: 1, word: "Ain Lerner"  },
    { id: 2, word: "Andrey"  },
    { id: 3, word: "Оди"  },
    { id: 4, word: "Пунь Пунь"  },
    { id: 5, word: "ВАНО"  },
    { id: 6, word: "Наташа"  },
    { id: 7, word: "Тема"  },
    { id: 8, word: "Сибиряк"  }
  ];

  const rightColumnData = [
    { id: 9, word: "Злыдня"  },
    { id: 10, word: "Похераст"  },
    { id: 11, word: "Похерон"  },
    { id: 12, word: "Похерун"  },
    { id: 13, word: "Похесрун"  },
    { id: 14, word: "Похерок"  },
    { id: 15, word: "Похерец"  },
    { id: 16, word: "ЛЮБИМЫЙ"  }
  ];
  
  const middle18ColumnData = [
    { id: 17, word: "1/8"  },
    { id: 18, word: "1/8"  },
    { id: 19, word: "1/8"  },
    { id: 20, word: "1/8"  },
  ];
  const middle14ColumnData = [
    { id: 21, word: "1/4"  },
    { id: 22, word: "1/4"  },
  ];
  const middle12ColumnData = [
    { id: 23, word: "1/2"  },
  ];
  const winnerData = [
    { id: 24, word: "200  сфер"  },
  ];
  
  return (
    <div className="animated-table-container">
      <span>Правила проведения внутригильдейского турнира: ...  </span>
      <span>Тут же будет ссылька на видео жеребьевки участников ...  </span>
      <div className="animated-table">
        {/* Первая колонка с 8 элементами */}
        <div className="table-column first-column">
          {leftColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>

                   {/*   1/8 */}
        <div className="table-column first-column">
          {middle18ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>        
 {/*   1/4 */}
        <div className="table-column first-column">
          {middle14ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>   
 {/*   1/2 */}
 <div className="table-column first-column">
          {middle12ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>  


        <div className="table-column first-column">
          {winnerData.map((item) => (
             <div key={item.id} className="table-cell final">
                <img className="img4emp" src='4emp.png' style={{width:130}}/>
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>  


 {/*   1/2 */}
 <div className="table-column first-column">
          {middle12ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>  

         {/*   1/4 */}
         <div className="table-column first-column">
          {middle14ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>   


                  {/*   1/8 */}
                  <div className="table-column first-column">
          {middle18ColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>    


        {/* Последняя колонка с 8 элементами */}
        <div className="table-column last-column">
          {rightColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>


>>>>>>> af60e4d16a7338675c0c992e11128a046e531536
      </div>
    </div>
  );
};

export default Hrefs;