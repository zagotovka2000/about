import React, { useState, useEffect } from 'react';
import styles from './Tournament.module.css';

const Tournament = () => {
  const [tournamentData, setTournamentData] = useState({
    rounds: [],
    winner: null
  });

  const sampleTournamentData = {
    rounds: [
      {
        name: "1/8 финала",
        matches: [
          { team1: "Похер", team2: "Похерист", score: "0:0", winner: "team1" },
          { team1: "Похерун", team2: "Похесрун", score: "0:0", winner: "team1" },
          { team1: "Похераст", team2: "Похерист", score: "0:0", winner: "team1" },
          { team1: "Похеран", team2: "Похесран", score: "0:0", winner: "team2" },
          { team1: "Похесрист", team2: "Похюрун", score: "0:0", winner: "team1" },
          { team1: "Похерцист", team2: "Похермаст", score: "0:0", winner: "team2" },
          { team1: "Похерел", team2: "Похедрист", score: "0:0", winner: "team1" },
          { team1: "Похеръыщъь", team2: "Похерглист", score: "0:0", winner: "team2" },
        ]
      },
      {
        name: "1/4 финала",
        matches: [
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team1" },
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team2" },
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team1" },
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team2" },
        ]
      },
      {
        name: "1/2 финала",
        matches: [
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team1" },
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team1" },
        ]
      },
      {
        name: "Финал",
        matches: [
          { team1: "'__'", team2: "'__'", score: "0:0", winner: "team1" },
        ]
      }
    ],
    winner: "'_'"
  };

  useEffect(() => {
    setTournamentData(sampleTournamentData);
  }, []);

  const TournamentBracket = () => {
    return (
      <div className={styles.tournamentContainer}>
        <div className={styles.bracketGrid}>
          {/* 1/8 финала - левая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/8 финала</h3>
            <div className={styles.matches}>
              {tournamentData.rounds[0]?.matches.slice(0, 4).map((match, index) => (
                <div key={index} className={styles.match}>
                  <div className={`${styles.team} ${match.winner === 'team1' ? styles.winner : ''}`}>
                    {match.team1}
                  </div>
                  <div className={styles.score}>{match.score}</div>
                  <div className={`${styles.team} ${match.winner === 'team2' ? styles.winner : ''}`}>
                    {match.team2}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1/4 финала - левая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/4 финала</h3>
            <div className={styles.matches}>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[0]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[0]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[1]?.matches[0]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[0]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[0]?.team2}
                </div>
              </div>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[1]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[1]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[1]?.matches[1]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[1]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[1]?.team2}
                </div>
              </div>
            </div>
          </div>

          {/* 1/2 финала - левая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/2 финала</h3>
            <div className={styles.matches}>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[2]?.matches[0]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[2]?.matches[0]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[2]?.matches[0]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[2]?.matches[0]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[2]?.matches[0]?.team2}
                </div>
              </div>
            </div>
          </div>

        <div>
                {/* Блок победителя */}
                <p className={styles.winnerSection}>
          <div className={styles.winnerCard}>
            <h3 className={styles.winnerTitle}> <br/>200 000 ИЗЮМА НА НГ!!! 🏆</h3>
            <div className={styles.winnerName}>
               {tournamentData.winner} 
            </div>
            <div className={styles.winnerText}>


            </div>
          </div>
        </p>


          {/* Финал */}
          <div className={`${styles.round} ${styles.finalRound}`}>
            <h3 className={styles.roundTitle}>Финал</h3>
            <div className={styles.matches}>
              {tournamentData.rounds[3]?.matches.map((match, index) => (
                <div key={index} className={styles.match}>
                  <div className={`${styles.team} ${match.winner === 'team1' ? styles.winner : ''}`}>
                    {match.team1}
                  </div>
                  <div className={styles.score}>{match.score}</div>
                  <div className={`${styles.team} ${match.winner === 'team2' ? styles.winner : ''}`}>
                    {match.team2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* 1/2 финала - правая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/2 финала</h3>
            <div className={styles.matches}>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[2]?.matches[1]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[2]?.matches[1]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[2]?.matches[1]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[2]?.matches[1]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[2]?.matches[1]?.team2}
                </div>
              </div>
            </div>
          </div>

          {/* 1/4 финала - правая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/4 финала</h3>
            <div className={styles.matches}>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[2]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[2]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[1]?.matches[2]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[2]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[2]?.team2}
                </div>
              </div>
              <div className={styles.match}>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[3]?.winner === 'team1' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[3]?.team1}
                </div>
                <div className={styles.score}>{tournamentData.rounds[1]?.matches[3]?.score}</div>
                <div className={`${styles.team} ${tournamentData.rounds[1]?.matches[3]?.winner === 'team2' ? styles.winner : ''}`}>
                  {tournamentData.rounds[1]?.matches[3]?.team2}
                </div>
              </div>
            </div>
          </div>

          {/* 1/8 финала - правая часть */}
          <div className={styles.round}>
            <h3 className={styles.roundTitle}>1/8 финала</h3>
            <div className={styles.matches}>
              {tournamentData.rounds[0]?.matches.slice(4, 8).map((match, index) => (
                <div key={index} className={styles.match}>
                  <div className={`${styles.team} ${match.winner === 'team1' ? styles.winner : ''}`}>
                    {match.team1}
                  </div>
                  <div className={styles.score}>{match.score}</div>
                  <div className={`${styles.team} ${match.winner === 'team2' ? styles.winner : ''}`}>
                    {match.team2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    );
  };

  return <TournamentBracket />;
};

export default Tournament;
