// UnloadingTitans.jsx
import React, { useState, useEffect, useMemo } from 'react';
import './UnloadingTitans.css';



// Парсер TSV
const parseTSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && !inQuotes) {
      inQuotes = true;
      i++;
    } else if (ch === '"' && inQuotes && next === '"') {
      field += '"';
      i += 2;
    } else if (ch === '"' && inQuotes) {
      inQuotes = false;
      i++;
    } else if ((ch === '\t' || ch === '\n') && !inQuotes) {
      if (ch === '\t') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      }
    } else {
      field += ch;
      i++;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

// Извлечение имён титанов из строки вида "Тен(295) Ияр(221) Сол(295)"
const extractTitansFromTeam = (teamString) => {
  if (!teamString) return [];
  const matches = teamString.match(/([А-Яа-яA-Za-zЁё'-]+)\(\d+\)/g);
  if (!matches) return [];
  return matches.map(m => m.split('(')[0]);
};

// Парсинг тотемов из строки вида "Т6-130 С4-130"
const parseTotems = (totemString) => {
  if (!totemString) return [];
  const items = totemString.replace(/,/g, ' ').split(/\s+/).filter(s => s.trim() !== '');
  return items.map(item => {
    const match = item.match(/^([A-Za-zА-Яа-я])(\d+)-(\d+)$/);
    if (match) {
      return {
        letter: match[1],
        stars: parseInt(match[2], 10),
        level: parseInt(match[3], 10)
      };
    }
    return null;
  }).filter(t => t !== null);
};

// Парсинг умений тотемов из строки вида "ГС1 ТК2 ШГ1 ЗС4"
const parseSkills = (skillString) => {
  if (!skillString) return [];
  return skillString.split(/\s+/).filter(s => s.trim() !== '').map(s => {
    const match = s.match(/^([A-Za-zА-Яа-я]{2})(\d+)$/);
    if (match) {
      return { code: match[1], rank: parseInt(match[2], 10) };
    }
    return null;
  }).filter(s => s !== null);
};

// ---------- Компонент ----------
const UnloadingTitans = ({ fileName }) => {
  const [battleData, setBattleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });

  useEffect(() => {
    if (!fileName) {
      setBattleData([]);
      return;
    }

    const fetchFileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/arrayWars/${encodeURIComponent(fileName)}`);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }
        const text = await response.text();
        processData(text);
      } catch (err) {
        setError(err.message);
        setBattleData([]);
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileName]);

  const processData = (text) => {
    const rows = parseTSV(text);
    if (rows.length < 2) {
      setBattleData([]);
      setLoading(false);
      return;
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const battles = dataRows.map(row => {
      const entry = {};
      header.forEach((key, index) => {
        entry[key] = row[index] || '';
      });
      return entry;
    }).filter(item => item['att name'] && item['att name'].trim() !== '');

    setBattleData(battles);
    setLoading(false);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...battleData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'points' || sortConfig.key === 'att power' || sortConfig.key === 'def power') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [battleData, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Рендер команды титанов (иконки) – как в War
  const renderTitansTeam = (titans) => {
    return (
      <div className="titans-container">
        {titans.map((titan, idx) => (
          <div key={idx} className="titan-item">
            <img
              src={`/images/titans/${titan}.png`}
              alt={titan}
              className="titan-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="titan-fallback" style={{ display: 'none' }}>{titan}</div>
            <div className="titan-name">{titan}</div>
          </div>
        ))}
      </div>
    );
  };

  // Рендер тотемов с умениями (точно как в War)
  const renderTotems = (totemString, skillString, side) => {
    const totems = parseTotems(totemString);
    const skills = parseSkills(skillString);
    if (totems.length === 0 && skills.length === 0) return null;

    const totemsWithSkills = totems.map((totem, index) => {
      const start = index * 2;
      const totemSkills = skills.slice(start, start + 2);
      return { ...totem, skills: totemSkills };
    });

    const renderSkill = (skill, position) => {
      if (!skill) return null;
      const { code, rank } = skill;
      return (
        <div className={`skill-wrapper skill-${position}`} key={code + rank}>
          <img
            src={`/images/totems/${code}.png`}
            alt={code}
            className="skill-icon"
            onError={(e) => {
              e.target.style.display = 'none';
              // fallback текст для умения (опционально)
              const parent = e.target.parentNode;
              const fallback = document.createElement('span');
              fallback.className = 'skill-fallback';
              fallback.textContent = code;
              parent.appendChild(fallback);
            }}
          />
          <span className="skill-rank">{rank}</span>
        </div>
      );
    };

    return (
      <div className="totems-section">
        <div className="totems-list">
          {totemsWithSkills.map((totem, idx) => (
            <div key={idx} className="totem-with-skills" data-side={side}>
              {side === 'defense' && totem.skills.length > 0 && (
                <div className="skills-left">
                  {totem.skills.map(skill => renderSkill(skill, 'left'))}
                </div>
              )}
              <div className="totem-icon-wrapper">
                <img
                  src={`/images/totems/${totem.letter}.png`}
                  alt={`Тотем ${totem.letter}`}
                  className="totem-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="totem-fallback" style={{ display: 'none' }}>{totem.letter}</div>
                <div className="totem-level-badge">{totem.level}</div>
                <div className="totem-stars">
                  {totem.stars === 6 ? (
                    <img
                      src="/images/totems/abs.png"
                      alt="max"
                      className="star-icon star-icon-max"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        // fallback текст
                        const parent = e.target.parentNode;
                        parent.innerHTML = '<span class="star-fallback">6★</span>';
                      }}
                    />
                  ) : (
                    Array.from({ length: totem.stars }).map((_, i) => (
                      <img
                        key={i}
                        src="/images/totems/zvezda.png"
                        alt="star"
                        className="star-icon"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          // Если все звёзды не загрузились, заменим весь блок на текст
                          const starsContainer = e.target.closest('.totem-stars');
                          if (starsContainer && !starsContainer.querySelector('.star-fallback')) {
                            starsContainer.innerHTML = `<span class="star-fallback">${totem.stars}★</span>`;
                          }
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
              {side === 'attack' && totem.skills.length > 0 && (
                <div className="skills-right">
                  {totem.skills.map(skill => renderSkill(skill, 'right'))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!fileName) return null;

  return (
    <div className="app">
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка данных...</div>}

      {!loading && !error && battleData.length > 0 && (
        <div className="table-container" role="table" aria-label="Выгрузки боёв титанов">
          <div className="table-header" role="rowgroup">
            <div className="header-cell attacker-header" onClick={() => requestSort('att name')}>
              Атака{getSortIndicator('att name')}
            </div>
            <div className="header-cell defender-header" onClick={() => requestSort('def name')}>
              Защита{getSortIndicator('def name')}
            </div>
            <div className="header-cell points-header" onClick={() => requestSort('points')}>
              Очки
            </div>
            <div className="header-cell replay-header">Ссыль</div>
          </div>

          {sortedData.map((battle, index) => {
            const attTitans = extractTitansFromTeam(battle['att team']);
            const defTitans = extractTitansFromTeam(battle['team']);

            // Берём тотемы и умения из соответствующих полей
            const attTotemString = battle['A flag/totem'] || battle['attacker pets'] || '';
            const defTotemString = battle['D flag/totem'] || battle['defender pets'] || '';
            const attSkillString = battle['A flag desc/Totem skills'] || '';
            const defSkillString = battle['D flag desc/Totem skills'] || '';

            const points = parseInt(battle['points']) || 0;
            let pointsClass = '';
            if (points === 20) pointsClass = 'points-high';
            else if (points < 20) pointsClass = 'points-low';

            const replayKey = Object.keys(battle).find(k => k.trim().toLowerCase() === 'replay');
            const replayUrl = replayKey ? battle[replayKey] : '';

            return (
              <div key={index} className="table-row">
                <div className="table-cell attacker-cell">
                  <div className="player-info">
                    <span className="player-name" title={battle['att name']}>
                      {battle['att name']}
                    </span>
                    <span className="player-power">
                      {parseInt(battle['att power']).toLocaleString()}
                    </span>
                  </div>
                  {renderTitansTeam(attTitans)}
                  {renderTotems(attTotemString, attSkillString, 'attack')}
                </div>

                <div className="table-cell defender-cell">
                  <div className="player-info">
                    <span className="player-name" title={battle['def name']}>
                      {battle['def name']}
                    </span>
                    <span className="player-power">
                      {parseInt(battle['def power']).toLocaleString()}
                    </span>
                  </div>
                  {renderTitansTeam(defTitans)}
                  {renderTotems(defTotemString, defSkillString, 'defense')}
                </div>

                <div className={`table-cell points-cell ${pointsClass}`}>
                  {battle['points']}
                </div>

                <div className="table-cell replay-cell">
                  {replayUrl ? (
                    <a
                      href={replayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="replay-link"
                    >
                      бой
                    </a>
                  ) : (
                    <span className="no-replay">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && battleData.length === 0 && (
        <div className="no-data">В файле нет данных о боях.</div>
      )}
    </div>
  );
};

export default UnloadingTitans;
