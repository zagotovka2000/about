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
      </div>
    </div>
  );
};

export default Hrefs;