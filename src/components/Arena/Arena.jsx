import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Arena.css';

// Питомцы (патронажи) – они не должны появляться в списке героев
const PATRONAZHS = ['Акс', 'Аль', 'Век', 'Каи', 'Мар', 'Мер', 'Оли', 'Хор', 'Фен', 'Бис', '###'];

// Резервный список героев (на случай, если файл пуст или не удалось извлечь героев)
// Включает всех героев, которые встречаются в ваших данных
const FALLBACK_HEROES = [
  'Авг', 'Айз', 'Айр', 'Ами', 'Ара', 'Аст', 'Атл', 'Баб', 'Бир', 'Бис',
  'Гал', 'Гел', 'Гус', 'Дан', 'Джу', 'Дор', 'Изи', 'Исм', 'Йор', 'Кас',
  'Кей', 'Клео', 'Кри', 'Крв', 'ЛаК', 'Лир', 'Лю', 'Май', 'Мор', 'Муш',
  'Неб', 'Ори', 'Пол', 'Себ', 'Тея', 'Три', 'Фаф', 'Фен', 'Фла', 'Фоб',
  'Хай', 'Хор', 'Шив', 'Эйд', 'Эле', 'Юли', 'Ясм'
];

const Arena = () => {
  const [selectedCreatures, setSelectedCreatures] = useState(Array(6).fill(null));
  const [availableCreatures, setAvailableCreatures] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [battleData, setBattleData] = useState([]);
  const [selectionModal, setSelectionModal] = useState({ isOpen: false, cellIndex: null, creatureType: 'hero' });
  const [selectionList, setSelectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const [activeTab, setActiveTab] = useState('arena');
  const [grandFolders, setGrandFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Загрузка данных Арены (предполагается, что файл уже корректный TSV)
  const loadArenaData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/arena/arena.txt');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length === 0) throw new Error('Файл пуст');

      // Заголовки
      const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
      
      // Индексы колонок
      const idxAttName = headers.findIndex(h => h === 'att name');
      const idxAttPower = headers.findIndex(h => h === 'att power');
      const idxAttTeam = headers.findIndex(h => h === 'att team');
      const idxDefName = headers.findIndex(h => h === 'def name');
      const idxDefPower = headers.findIndex(h => h === 'def power');
      const idxDefTeam = headers.findIndex(h => h === 'team');
      const idxWin = headers.findIndex(h => h === 'win');
      const idxAttPets = headers.findIndex(h => h === 'attacker pets');
      const idxDefPets = headers.findIndex(h => h === 'defender pets');
      const idxReplay = headers.findIndex(h => h === 'replay');

      const requiredCount = Math.max(
        idxAttName, idxAttPower, idxAttTeam, idxDefName, idxDefPower,
        idxDefTeam, idxWin, idxAttPets, idxDefPets, idxReplay
      ) + 1;

      const battles = [];
      const heroesSet = new Set();

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split('\t');
        while (columns.length < requiredCount) columns.push('');
        
        const get = (idx) => (idx >= 0 && idx < columns.length) ? columns[idx].trim() : '';

        const attTeam = get(idxAttTeam);
        const defTeam = get(idxDefTeam);
        if (!attTeam || !defTeam) continue;

        const winVal = get(idxWin);
        const battle = {
          attackerName: get(idxAttName),
          attackerPower: get(idxAttPower),
          attackerTeam: attTeam,
          defenderName: get(idxDefName),
          defenderPower: get(idxDefPower),
          defenderTeam: defTeam,
          win: winVal === 'true',
          attackerPets: get(idxAttPets),
          defenderPets: get(idxDefPets),
          replay: get(idxReplay)
        };
        battles.push(battle);

        // Сбор героев из атакующей команды (исключая питомцев и ###)
        const attParts = attTeam.trim().split(/\s+/);
        for (let j = 1; j < attParts.length; j++) {
          let hero = attParts[j].replace(/\(\d+\)$/, '');
          if (hero && !PATRONAZHS.includes(hero)) heroesSet.add(hero);
        }
        // Сбор героев из защитной команды
        const defParts = defTeam.trim().split(/\s+/);
        for (let j = 0; j < defParts.length - 1; j++) {
          let hero = defParts[j].replace(/\(\d+\)$/, '');
          if (hero && !PATRONAZHS.includes(hero)) heroesSet.add(hero);
        }
      }

      const heroesList = Array.from(heroesSet).sort();
      console.log(`Загружено боёв: ${battles.length}, героев: ${heroesList.length}`);
      
      setBattleData(battles);
      setAvailableCreatures(heroesList.length ? heroesList : FALLBACK_HEROES);
    } catch (error) {
      console.error('Ошибка загрузки arena.txt:', error);
      setAvailableCreatures(FALLBACK_HEROES);
      setBattleData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загрузка манифеста Гранд-арены
  const loadGrandArenaManifest = useCallback(async () => {
    try {
      const response = await fetch('/data/ga-manifest.json');
      if (!response.ok) throw new Error('Манифест Гранд-арены не найден');
      const data = await response.json();
      setGrandFolders(data);
    } catch (err) {
      console.error('Ошибка загрузки Гранд-арены:', err);
      setGrandFolders([]);
    }
  }, []);

  useEffect(() => {
    loadArenaData();
    loadGrandArenaManifest();
  }, [loadArenaData, loadGrandArenaManifest]);

  // Извлечение данных атакующего
  const extractAttackerData = useCallback((teamString, petsString) => {
    const result = { generalPet: null, heroes: [], patronages: [] };
    if (!teamString) return result;
    const parts = teamString.trim().split(/\s+/);
    if (parts.length === 0) return result;
    result.generalPet = parts[0].replace(/\(\d+\)$/, '');
    const rawHeroes = parts.slice(1).map(p => p.replace(/\(\d+\)$/, ''));
    result.heroes = rawHeroes.slice(0, 5);
    if (petsString && petsString.trim()) {
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < petParts.length) {
          let pet = petParts[i].replace(/\(\d+\)$/, '');
          result.patronages.push(pet === '###' ? '###' : pet);
        } else {
          result.patronages.push('###');
        }
      }
    } else {
      result.patronages = Array(result.heroes.length).fill('###');
    }
    return result;
  }, []);

  // Извлечение данных защитника
  const extractDefenderData = useCallback((teamString, petsString) => {
    const result = { generalPet: null, heroes: [], patronages: [] };
    if (!teamString) return result;
    const parts = teamString.trim().split(/\s+/);
    if (parts.length === 0) return result;
    result.generalPet = parts[parts.length - 1].replace(/\(\d+\)$/, '');
    const rawHeroes = parts.slice(0, -1).map(p => p.replace(/\(\d+\)$/, ''));
    result.heroes = rawHeroes.slice(0, 5);
    if (petsString && petsString.trim()) {
      const petParts = petsString.trim().split(/\s+/).filter(p => p !== '');
      const defenderPets = petParts.slice(0, 5);
      for (let i = 0; i < result.heroes.length; i++) {
        if (i < defenderPets.length) {
          let pet = defenderPets[i].replace(/\(\d+\)$/, '');
          result.patronages.push(pet === '###' ? '###' : pet);
        } else {
          result.patronages.push('###');
        }
      }
    } else {
      result.patronages = Array(result.heroes.length).fill('###');
    }
    return result;
  }, []);

  // Поиск только по защитной пачке (без переключателя)
  const handleSearch = useCallback(() => {
    if (isLoading) { alert('Данные ещё загружаются...'); return; }
    if (battleData.length === 0) { alert('Нет данных для поиска'); return; }

    const selectedPet = selectedCreatures[0];
    const selectedHeroes = selectedCreatures.slice(1).filter(hero => hero !== null);
    if (selectedHeroes.length === 0 && !selectedPet) {
      alert('Выберите хотя бы одного героя или питомца');
      return;
    }

    setHasSearched(true);
    setIsSearching(true);
    setSearchResults([]);

    const results = [];
    for (let idx = 0; idx < battleData.length; idx++) {
      const battle = battleData[idx];
      if (!battle.win) continue;

      try {
        const defender = extractDefenderData(battle.defenderTeam, battle.defenderPets);
        // Проверка питомца защитника
        if (selectedPet && selectedPet !== defender.generalPet) continue;
        // Проверка героев защитника
        if (selectedHeroes.length > 0) {
          const allFound = selectedHeroes.every(hero => defender.heroes.includes(hero));
          if (!allFound) continue;
        }
        const attacker = extractAttackerData(battle.attackerTeam, battle.attackerPets);
        results.push({
          id: idx,
          attacker: {
            name: battle.attackerName,
            power: battle.attackerPower,
            generalPet: attacker.generalPet,
            heroes: attacker.heroes,
            patronages: attacker.patronages
          },
          defender: {
            name: battle.defenderName,
            power: battle.defenderPower,
            generalPet: defender.generalPet,
            heroes: defender.heroes,
            patronages: defender.patronages
          },
          win: battle.win,
          replay: battle.replay,
          matchedHeroes: selectedHeroes.filter(h => defender.heroes.includes(h))
        });
      } catch (err) {
        console.warn(`Ошибка обработки боя ${idx}:`, err);
      }
    }
    setSearchResults(results);
    setIsSearching(false);
  }, [battleData, extractAttackerData, extractDefenderData, isLoading, selectedCreatures]);

  const renderTeamWithPatronage = useCallback((teamData) => {
    if (!teamData || !teamData.heroes) return null;
    const { heroes, patronages = [], generalPet } = teamData;
    return (
      <div className="arena-team-with-patronage">
        <div className="arena-general-pet-section">
          {generalPet && (
            <div className="arena-general-pet-container">
              <img src={`/images/heroes/${generalPet}.png`} alt={generalPet} className="arena-general-pet-image"
                onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex'; }} />
              <div className="arena-general-pet-fallback" style={{ display: 'none' }}>{generalPet}</div>
            </div>
          )}
        </div>
        <div className="arena-heroes-section">
          <div className="arena-heroes-container">
            {heroes.map((hero, idx) => {
              const patron = patronages[idx] || '###';
              return (
                <div key={idx} className="arena-hero-patron-container">
                  <div className="arena-hero-with-patron">
                    <div className="arena-hero-container">
                      <img src={`/images/heroes/${hero}.png`} alt={hero} className="arena-hero-image"
                        onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex'; }} />
                      <div className="arena-hero-fallback" style={{ display: 'none' }}>{hero}</div>
                    </div>
                    <div className="arena-patronage-overlay">
                      <div className="arena-patronage-label">Патронаж:</div>
                      <img src={`/images/heroes/${patron}.png`} alt={patron} className="arena-patronage-image"
                        onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex'; }} />
                      <div className="arena-patron-fallback" style={{ display: 'none' }}>{patron === '###' ? 'нет' : patron}</div>
                    </div>
                  </div>
                  <div className="arena-hero-name">{hero}</div>
                  {patron !== '###' && <div className="arena-patron-name">+ {patron}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, []);

  const { pets, heroes } = useMemo(() => {
    const petList = [...PATRONAZHS].sort((a, b) => a.localeCompare(b));
    const heroList = availableCreatures.filter(c => !petList.includes(c)).sort((a, b) => a.localeCompare(b));
    return { pets: petList, heroes: heroList };
  }, [availableCreatures]);

  const handleCellClick = useCallback((index) => {
    if (isLoading) { alert('Данные загружаются...'); return; }
    const creatureType = index === 0 ? 'pet' : 'hero';
    let availableList = creatureType === 'pet' ? pets : heroes;
    availableList = availableList.filter(item => !selectedCreatures.includes(item));
    setSelectionList(availableList);
    setSelectionModal({ isOpen: true, cellIndex: index, creatureType });
  }, [isLoading, pets, heroes, selectedCreatures]);

  const handleCreatureSelect = useCallback((creatureName) => {
    const newSelected = [...selectedCreatures];
    newSelected[selectionModal.cellIndex] = creatureName;
    setSelectedCreatures(newSelected);
    setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' });
  }, [selectedCreatures, selectionModal.cellIndex]);

  const handleClearCell = useCallback((index) => {
    const newSelected = [...selectedCreatures];
    newSelected[index] = null;
    setSelectedCreatures(newSelected);
  }, [selectedCreatures]);

  const clearAllCells = useCallback(() => {
    setHasSearched(false);
    setSelectedCreatures(Array(6).fill(null));
    setSearchResults([]);
  }, []);

  const openFolderModal = (folder) => setSelectedFolder(folder);
  const closeFolderModal = () => {
    setSelectedFolder(null);
    setFullscreenImage(null);
  };
  const openFullscreen = (imgUrl, e) => {
    e.stopPropagation();
    setFullscreenImage(imgUrl);
    document.body.style.overflow = 'hidden';
  };
  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (isLoading) {
    return (
      <div className="arena-container">
        <div className="arena-loading-overlay">
          <div className="arena-spinner"></div>
          <div>Загрузка данных арены...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-container">
      <div className="arena-tabs">
        <button className={`arena-tab ${activeTab === 'arena' ? 'active' : ''}`} onClick={() => setActiveTab('arena')}>Арена</button>
        <button className={`arena-tab ${activeTab === 'grand' ? 'active' : ''}`} onClick={() => setActiveTab('grand')}>Гранд-арена</button>
      </div>

      {activeTab === 'arena' && (
        <>
          <div className="arena-upper-container">
            <h2 className="arena-title">Поиск по арене</h2>
            <div className="arena-data-info">
              <p>Загружено боёв: {battleData.length}</p>
              <p>Доступно героев: {heroes.length}</p>
            </div>

            <div className="arena-selected-creatures-container">
              <div className="arena-selected-creatures-grid">
                {selectedCreatures.map((creature, index) => (
                  <div key={index} className={`arena-creature-cell ${index === 0 ? 'arena-pet-cell' : 'arena-hero-cell'}`} onClick={() => handleCellClick(index)}>
                    {creature ? (
                      <>
                        <img src={`/images/heroes/${creature}.png`} alt={creature} className="arena-creature-image"
                          onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'block'; }} />
                        <div className="arena-creature-fallback" style={{ display: 'none' }}>{creature}</div>
                        <div className="arena-creature-name">{creature}</div>
                        <button className="arena-clear-cell-button" onClick={(e) => { e.stopPropagation(); handleClearCell(index); }}>×</button>
                      </>
                    ) : (
                      <div className="arena-empty-cell">{index === 0 ? 'Питомец' : `Герой ${index}`}</div>
                    )}
                    <div className="arena-cell-label">{index === 0 ? 'Общий питомец' : 'Герой'}</div>
                  </div>
                ))}
              </div>
              <div className="arena-controls-container">
                <button onClick={handleSearch} className="arena-search-button" disabled={isSearching || (selectedCreatures.slice(1).every(c => c === null) && !selectedCreatures[0])}>
                  {isSearching ? 'Поиск...' : 'Найти пачки'}
                </button>
                <button onClick={clearAllCells} className="arena-clear-all-button">Очистить все</button>
              </div>
            </div>
          </div>

          {selectionModal.isOpen && (
            <div className="arena-creature-selection-modal">
              <div className="arena-creature-selection-content">
                <div className="arena-selection-modal-header">
                  <h3>{selectionModal.cellIndex === 0 ? 'Выберите питомца' : `Выберите героя`}<br /><small>(Доступно: {selectionList.length})</small></h3>
                  <button className="arena-close-selection-modal" onClick={() => setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' })}>×</button>
                </div>
                <div className="arena-selection-list-container">
                  {selectionList.length === 0 ? (
                    <div className="arena-no-available-creatures">Нет доступных существ</div>
                  ) : (
                    <div className="arena-selection-grid">
                      {selectionList.map((creature, idx) => (
                        <div key={idx} className="arena-selection-item" onClick={() => handleCreatureSelect(creature)}>
                          <img src={`/images/heroes/${creature}.png`} alt={creature} className="arena-selection-image"
                            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'block'; }} />
                          <div className="arena-selection-fallback" style={{ display: 'none' }}>{creature}</div>
                          <div className="arena-selection-name">{creature}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="arena-selection-modal-footer">
                  <button className="arena-cancel-selection" onClick={() => setSelectionModal({ isOpen: false, cellIndex: null, creatureType: 'hero' })}>Отмена</button>
                </div>
              </div>
            </div>
          )}

          {hasSearched && !isSearching && searchResults.length === 0 && (
            <div className="arena-lower-container arena-no-results">
              <div className="arena-no-results-message">По вашему запросу ничего не найдено</div>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="arena-lower-container">
              <div className="arena-results-header"><h3 className="arena-results-title">Найдено {searchResults.length} </h3></div>
              <div className="arena-results-list">
                {searchResults.map((result, idx) => (
                  <div key={idx} className="arena-battle-result-item">
                    <div className="arena-battle-header">
                      <span className="arena-battle-info">{result.attacker.name} ({result.attacker.power}) vs {result.defender.name} ({result.defender.power})</span>
                      {result.replay && <a href={result.replay} target="_blank" rel="noopener noreferrer" className="arena-replay-link">Replay</a>}
                    </div>
                    <div className="arena-battle-teams-container">
                      <div className="arena-team-container arena-attacking-team">{renderTeamWithPatronage(result.attacker)}</div>
                      <div className="arena-teams-divider"><div className="arena-vs-text">VS</div></div>
                      <div className="arena-team-container arena-defending-team">{renderTeamWithPatronage(result.defender)}</div>
                    </div>
                    <div className="arena-battle-footer">
                      <div className="arena-selected-summary">
                        <strong>Совпадения в защите:</strong>
                 
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'grand' && (
        <div className="grand-arena-container">
          <h2 className="grand-title">Гранд-арена</h2>
          <div className="grand-items-grid">
            {grandFolders.map((folder, idx) => (
              <div key={idx} className="grand-item-card" onClick={() => openFolderModal(folder)}>
                <div className="grand-item-preview">{folder.name}</div>
              </div>
            ))}
          </div>
          {selectedFolder && (
            <div className="grand-modal-overlay" onClick={closeFolderModal}>
              <div className="grand-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="grand-modal-close" onClick={closeFolderModal}>×</button>
                <h3>{selectedFolder.name}</h3>
                <div className="grand-images-container">
                  {selectedFolder.images.map((imgUrl, idx) => (
                    <div key={idx} className="grand-image-wrapper">
                      <img src={imgUrl} alt={`${selectedFolder.name} ${idx + 1}`} className="grand-image" onClick={(e) => openFullscreen(imgUrl, e)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {fullscreenImage && (
            <div className="fullscreen-overlay" onClick={closeFullscreen}>
              <button className="fullscreen-close" onClick={closeFullscreen}>×</button>
              <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-image" onClick={(e) => e.stopPropagation()} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Arena;
