import React, { useState, useEffect, useCallback } from 'react';
import './StrongholdDefense.css';

// ---------- Константы ----------
const PATRON_LIST = ['Акс', 'Аль', 'Век', 'Каи', 'Мар', 'Мер', 'Оли', 'Хор', 'Фен', 'Бис'];

const ALL_HEROES = [
   'Авг', 'Авр', 'Айз', 'Айр', 'Альванор', 'Ами', 'Анд', 'Ара', 'Арт', 'Аст',
   'Баб', 'Без', 'Бир', 'Гал', 'Гел', 'Гус', 'Дан', 'Дже', 'Джи', 'Джу', 'Дор',
   'Зир', 'Исм', 'Йор', 'К\'А', 'Кай', 'Кас', 'Кей', 'Кир', 'Крв', 'Кри', 'Крн',
   'ЛаК', 'Лар', 'Лил', 'Лир', 'Лиэ', 'Лук', 'Лют', 'Май', 'Мод', 'Мор', 'Мрк', 'Муш',
   'Неб', 'Ори', 'Пеп', 'Пол', 'Руф', 'Сат', 'Себ', 'Сел', 'Сор', 'Суд', 'ТЗв', 'Тес',
   'Тея', 'Три', 'Фаф', 'Фла', 'Фоб', 'Фок', 'Фол', 'Хай', 'Цин', 'Чаб', 'Чер', 'Эйд',
   'Эле', 'Эль', 'Юли', 'Ясм'
];
const HEROES_LIST = ALL_HEROES.filter(hero => !PATRON_LIST.includes(hero));

const TITANS_LIST = [
  'Сол', 'Ияр', 'Риг', 'Амо', 'Тен', 'Бру', 'Мор', 'Кер', 'Сиг', 'Тид', 'Нов', 'Маи', 'Гип',
  'Ара', 'Мол', 'Аше', 'Игн', 'Вул', 'Эде', 'Анг', 'Ава', 'Сил', 'Вер'
];

const tseliteli = ['Баб','Гус','Дже','Дор','Мрк','Тея','Эйд'];
const magi = ['Авг','Айр','Без','Кай','Кас','Кри','Лар','Лил','Мод','Ори','Пеп','Сат','Сел','Суд','Фол','Хай','Гел'];
const boyci = ['Исм', 'К\'А','Кей','Лир','Три','Цин','Чер','Эль','Ясм'];
const strelki = ['Арт','Дан','Джи','Джу','Кир','ЛаК','Лук','Сор','Фок'];
const controls = ['Ара', 'Йор','Лиэ','Пол','ТЗв','Фоб'];
const tanki = ['Авр','Аст','Гал','Зир','Крв','Лют','Май','Муш','Руф','Тес','Чаб','Эле','Юли'];
const helpers = ['Айз','Альванор','Ами','Анд','Бир','Крн','Мор','Неб','Себ','Фаф','Фла'];

const lightTitans = ['Сол', 'Риг', 'Ияр', 'Амо'];
const darknessTitans = ['Тен', 'Бру', 'Кер', 'Мор'];
const fireTitans = ['Вул', 'Ара', 'Мол', 'Игн', 'Аше'];
const waterTitans = ['Тид', 'Сиг', 'Нов', 'Маи', 'Гип'];
const earthTitans = ['Эде', 'Анг', 'Ава', 'Сил', 'Вер'];

const FORTS = [
  { name: 'Мост', type: 'titans', bonus: 'без усилка', slots: 6 },
  { name: 'Врата Природы', type: 'titans', bonus: 'снижает урон на ', slots: 4 },
  { name: 'Бастион Льда', type: 'titans', bonus: 'накопление энергии быстрее на ', slots: 4 },
  { name: 'Бастион Огня', type: 'titans', bonus: 'увеличивает здоровье на ', slots: 4 },
  { name: 'Храм Солнца', type: 'titans', bonus: 'снижает урон по защите на ', slots: 4 },
  { name: 'Храм Луны', type: 'titans', bonus: 'увеличивает здоровье на ', slots: 4 },
  { name: 'Источник Стихий', type: 'titans', bonus: 'без усилка', slots: 4 },
  { name: 'Алтарь Жизни', type: 'titans', bonus: 'без усилка', slots: 5 },
  { name: 'Призма Эфира', type: 'titans', bonus: 'без усилка', slots: 5 },
  { name: 'Казармы', type: 'heroes', bonus: 'без усилка', slots: 3 },
  { name: 'Академия Магов', type: 'heroes', bonus: '', slots: 3 },
  { name: 'Маяк', type: 'heroes', bonus: 'увеличена скорость перезарядки умений на ', slots: 5 },
  { name: 'Литейная', type: 'heroes', bonus: 'увеличивает здоровье на ', slots: 5 },
  { name: 'Инженериум', type: 'heroes', bonus: 'накопление энергии быстрее на ', slots: 5 },
  { name: 'Стрельбище', type: 'heroes', bonus: 'снижает урон на ', slots: 5 },
  { name: 'Мост Героев', type: 'heroes', bonus: 'без усилка', slots: 6 },
  { name: 'Башня Алхимии', type: 'heroes', bonus: 'увеличивает броню на ', slots: 5 },
  { name: 'Бастион', type: 'heroes', bonus: 'увеличивает защиту от магии на ', slots: 5 },
  { name: 'Цитадель', type: 'heroes', bonus: 'без усилка', slots: 8 },
  { name: 'Ратуша', type: 'heroes', bonus: 'увеличивает лечение на ', slots: 5 }
];

const emptySlot = (fortType) => ({
  playerName: '',

  type: fortType,
  status: null,
  lineup: fortType === 'heroes'
    ? { pet: null, heroes: [null, null, null, null, null], titans: [] }
    : { pet: null, heroes: [], titans: [null, null, null, null, null] }
});

// ---------- Нормализация данных с защитой от null ----------
const normalizeFortsData = (rawData) => {
  if (!Array.isArray(rawData)) rawData = [];
  return FORTS.map((fort, idx) => {
    const serverSlots = rawData[idx] || [];
    const requiredCount = fort.slots;
    const normalized = [];
    for (let i = 0; i < requiredCount; i++) {
      if (i < serverSlots.length && serverSlots[i] && serverSlots[i].playerName) {
        const slot = serverSlots[i];
        const isHeroes = fort.type === 'heroes';
        normalized.push({
          playerName: slot.playerName || '',
          type: fort.type,
          status: slot.status || null,
          lineup: isHeroes
            ? {
                pet: slot.lineup?.pet || null,
                heroes: slot.lineup?.heroes?.length === 5 ? [...slot.lineup.heroes] : [null, null, null, null, null],
                titans: []
              }
            : {
                pet: null,
                heroes: [],
                titans: slot.lineup?.titans?.length === 5 ? [...slot.lineup.titans] : [null, null, null, null, null]
              }
        });
      } else {
        normalized.push(emptySlot(fort.type));
      }
    }
    return normalized;
  });
};

// ---------- API: JsonBox (облачное хранилище) ----------
const JSONBOX_API_KEY = 'ca1e94f1275abe2cb4c6f605b2079e86';
const JSONBOX_API_URL = 'https://jsonbox.ru/api.php';

// Загрузка данных
const fetchGlobalDefenses = async () => {
  try {
    const url = `${JSONBOX_API_URL}?action=get&api_key=${JSONBOX_API_KEY}`;
    const response = await fetch(url);
    if (response.status === 404) return []; // данных ещё нет
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    // Если сервер вернул объект с полем data
    if (result && typeof result === 'object' && !Array.isArray(result) && result.data !== undefined) {
      return result.data;
    }
    // Если вернулся массив
    if (Array.isArray(result)) return result;
    return [];
  } catch (err) {
    console.error('Ошибка загрузки из JsonBox:', err);
    return [];
  }
};

// Сохранение данных (без предварительного удаления)
const saveGlobalDefenses = async (fortsData) => {
  try {
    const url = `${JSONBOX_API_URL}?action=store`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: JSONBOX_API_KEY,
        data: fortsData
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Ошибка сохранения в JsonBox:', err);
    throw err;
  }
};

// Извлечение тренировочных пачек с защитой
const extractTrainingPacks = (rawData) => {
  const packs = {};
  if (!Array.isArray(rawData)) return packs;
  for (let fIdx = 0; fIdx < FORTS.length; fIdx++) {
    const slots = rawData[fIdx];
    if (!slots) continue;
    for (const slot of slots) {
      if (slot && slot.playerName && slot.trainingHeroesPack && Array.isArray(slot.trainingHeroesPack)) {
        if (!packs[slot.playerName]) {
          packs[slot.playerName] = {
            heroesPack: [...slot.trainingHeroesPack],
            titansPack: slot.trainingTitansPack ? [...slot.trainingTitansPack] : [null, null, null, null, null]
          };
        } else {
          for (let i = 0; i < 5; i++) {
            if (slot.trainingHeroesPack[i] && !packs[slot.playerName].heroesPack[i]) {
              packs[slot.playerName].heroesPack[i] = slot.trainingHeroesPack[i];
            }
            if (slot.trainingTitansPack && slot.trainingTitansPack[i] && !packs[slot.playerName].titansPack[i]) {
              packs[slot.playerName].titansPack[i] = slot.trainingTitansPack[i];
            }
          }
        }
      }
    }
  }
  return packs;
};

// ---------- Функции расчёта усилений ----------
const computeFortBonus = (fort, slots) => {
  if (fort.type === 'heroes') {
    let categoryList = null;
    let percentPerHero = 0;
    switch (fort.name) {
      case 'Ратуша': categoryList = tseliteli; percentPerHero = 7; break;
      case 'Башня Алхимии': categoryList = magi; percentPerHero = 4; break;
      case 'Бастион': categoryList = boyci; percentPerHero = 3; break;
      case 'Стрельбище': categoryList = strelki; percentPerHero = 3; break;
      case 'Инженериум': categoryList = controls; percentPerHero = 4; break;
      case 'Литейная': categoryList = tanki; percentPerHero = 8; break;
      case 'Маяк': categoryList = helpers; percentPerHero = 1; break;
      default: return fort.bonus;
    }
    let count = 0;
    for (const slot of slots) {
      if (slot?.lineup?.heroes) {
        for (const hero of slot.lineup.heroes) {
          if (hero && categoryList.includes(hero)) count++;
        }
      }
    }
    return `${fort.bonus}${count * percentPerHero}%`;
  }
  if (fort.type === 'titans') {
    let categoryList = null;
    let percentPerTitan = 0;
    switch (fort.name) {
      case 'Храм Солнца': categoryList = lightTitans; percentPerTitan = 2; break;
      case 'Храм Луны': categoryList = darknessTitans; percentPerTitan = 7; break;
      case 'Бастион Огня': categoryList = fireTitans; percentPerTitan = 8; break;
      case 'Бастион Льда': categoryList = waterTitans; percentPerTitan = 3; break;
      case 'Врата Природы': categoryList = earthTitans; percentPerTitan = 2; break;
      default: return fort.bonus;
    }
    let count = 0;
    for (const slot of slots) {
      if (slot?.lineup?.titans) {
        for (const titan of slot.lineup.titans) {
          if (titan && categoryList.includes(titan)) count++;
        }
      }
    }
    return `${fort.bonus}${count * percentPerTitan}%`;
  }
  return fort.bonus;
};

const getBonusHeroesForFort = (fort) => {
  if (fort.type !== 'heroes') return [];
  switch (fort.name) {
    case 'Ратуша': return tseliteli;
    case 'Башня Алхимии': return magi;
    case 'Бастион': return boyci;
    case 'Стрельбище': return strelki;
    case 'Инженериум': return controls;
    case 'Литейная': return tanki;
    case 'Маяк': return helpers;
    default: return [];
  }
};

const getBonusTitansForFort = (fort) => {
  if (fort.type !== 'titans') return [];
  switch (fort.name) {
    case 'Храм Солнца': return lightTitans;
    case 'Храм Луны': return darknessTitans;
    case 'Бастион Огня': return fireTitans;
    case 'Бастион Льда': return waterTitans;
    case 'Врата Природы': return earthTitans;
    default: return [];
  }
};

// ---------- Компонент ----------
const StrongholdDefense = () => {
  const [fortsData, setFortsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fullscreenAvatar, setFullscreenAvatar] = useState(null);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, message: '' });
  const [globalTrainingPacks, setGlobalTrainingPacks] = useState({});
  const [viewFortModal, setViewFortModal] = useState({ isOpen: false, fortIndex: null });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    fortIndex: null,
    slotIndex: null,
    tempData: null
  });
  const [selectionModal, setSelectionModal] = useState({
    isOpen: false,
    type: null,
    currentList: [],
    bonusList: [],
    onSelect: null,
    isTrainingPack: false,
    trainingPackType: null
  });

  useEffect(() => {
    fetch('/config/playerNames.json')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Ошибка загрузки игроков:', err));
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await fetchGlobalDefenses();
      const normalized = normalizeFortsData(rawData);
      const packs = extractTrainingPacks(rawData);
      setGlobalTrainingPacks(packs);
      setFortsData(normalized);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err.message);
      const emptyData = FORTS.map((fort) => Array(fort.slots).fill(emptySlot(fort.type)));
      setFortsData(emptyData);
      setGlobalTrainingPacks({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = async () => {
    try {
      const rawData = await fetchGlobalDefenses();
      const normalized = normalizeFortsData(rawData);
      const packs = extractTrainingPacks(rawData);
      setGlobalTrainingPacks(packs);
      setFortsData(normalized);
    } catch (err) {
      console.error('Ошибка обновления данных:', err);
      setError('Не удалось обновить данные после сохранения');
    }
  };

  const openFullscreen = (avatarUrl) => {
    if (!avatarUrl) return;
    setFullscreenAvatar(avatarUrl);
    document.body.style.overflow = 'hidden';
  };
  const closeFullscreen = () => {
    setFullscreenAvatar(null);
    document.body.style.overflow = 'auto';
  };
  const openAvatarInNewTab = (avatarUrl) => {
    if (avatarUrl) window.open(avatarUrl, '_blank');
  };

  const handleSlotClick = (fortIndex, slotIndex, e) => {
    e.stopPropagation();
    const slotData = fortsData[fortIndex][slotIndex];
    setEditModal({
      isOpen: true,
      fortIndex,
      slotIndex,
      tempData: JSON.parse(JSON.stringify(slotData))
    });
  };
  const handleFortClick = (fortIndex) => setViewFortModal({ isOpen: true, fortIndex });
  const closeViewFortModal = () => setViewFortModal({ isOpen: false, fortIndex: null });

  const saveAllData = async () => {
    if (!fortsData) return;
    const newData = fortsData.map(fortSlots =>
      fortSlots.map(slot => {
        const playerPacks = globalTrainingPacks[slot.playerName];
        if (slot.playerName && playerPacks) {
          return {
            ...slot,
            trainingHeroesPack: [...playerPacks.heroesPack],
            trainingTitansPack: [...playerPacks.titansPack]
          };
        }
        return { ...slot, trainingHeroesPack: null, trainingTitansPack: null };
      })
    );
    try {
      setSaving(true);
      setSuccessMsg(null);
      await saveGlobalDefenses(newData);
      setSuccessMsg('Данные успешно сохранены');
      await refreshData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError(`Ошибка сохранения: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveSlot = async () => {
    const { fortIndex, slotIndex, tempData } = editModal;
    if (!fortsData) return;
    const fortType = FORTS[fortIndex].type;
    const correctedData = {
      ...tempData,
      type: fortType,
      lineup: fortType === 'heroes'
        ? { pet: tempData.lineup.pet, heroes: [...tempData.lineup.heroes], titans: [] }
        : { pet: null, heroes: [], titans: [...tempData.lineup.titans] }
    };
    const newData = [...fortsData];
    newData[fortIndex][slotIndex] = correctedData;
    setFortsData(newData);
    closeEditModal();
    await saveAllData();
  };

  const clearSlot = async () => {
    const { fortIndex, slotIndex } = editModal;
    if (!fortsData) return;
    const fortType = FORTS[fortIndex].type;
    const newData = [...fortsData];
    newData[fortIndex][slotIndex] = emptySlot(fortType);
    setFortsData(newData);
    closeEditModal();
    await saveAllData();
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, fortIndex: null, slotIndex: null, tempData: null });
  };

  const updatePlayerName = (name) => {
    setEditModal(prev => ({
      ...prev,
      tempData: { ...prev.tempData, playerName: name }
    }));
  };

  const updateStatus = (status) => {
    setEditModal(prev => ({
      ...prev,
      tempData: { ...prev.tempData, status }
    }));
  };

  const updateGlobalTrainingPack = (playerName, packType, newPack) => {
    setGlobalTrainingPacks(prev => {
      const current = prev[playerName] || { heroesPack: [null, null, null, null, null], titansPack: [null, null, null, null, null] };
      return {
        ...prev,
        [playerName]: {
          ...current,
          [packType === 'heroes' ? 'heroesPack' : 'titansPack']: [...newPack]
        }
      };
    });
    if (editModal.tempData && editModal.tempData.playerName === playerName) {
      setEditModal(prev => ({
        ...prev,
        tempData: {
          ...prev.tempData,
          trainingHeroesPack: packType === 'heroes' ? newPack : (prev.tempData.trainingHeroesPack || [null, null, null, null, null]),
          trainingTitansPack: packType === 'titans' ? newPack : (prev.tempData.trainingTitansPack || [null, null, null, null, null])
        }
      }));
    }
  };

  const isHeroUsedBySamePlayer = (heroName, currentPlayerName, currentFortIndex, currentSlotIndex) => {
    if (!fortsData || !currentPlayerName) return null;
    for (let fIdx = 0; fIdx < FORTS.length; fIdx++) {
      const fort = FORTS[fIdx];
      if (fort.type !== 'heroes') continue;
      const slots = fortsData[fIdx];
      for (let sIdx = 0; sIdx < slots.length; sIdx++) {
        if (fIdx === currentFortIndex && sIdx === currentSlotIndex) continue;
        const slot = slots[sIdx];
        if (slot.playerName === currentPlayerName && slot?.lineup?.heroes) {
          if (slot.lineup.heroes.includes(heroName)) {
            return { fortName: FORTS[fIdx].name, slotIndex: sIdx };
          }
        }
      }
    }
    return null;
  };

  const isTitanUsedBySamePlayer = (titanName, currentPlayerName, currentFortIndex, currentSlotIndex) => {
    if (!fortsData || !currentPlayerName) return null;
    for (let fIdx = 0; fIdx < FORTS.length; fIdx++) {
      const fort = FORTS[fIdx];
      if (fort.type !== 'titans') continue;
      const slots = fortsData[fIdx];
      for (let sIdx = 0; sIdx < slots.length; sIdx++) {
        if (fIdx === currentFortIndex && sIdx === currentSlotIndex) continue;
        const slot = slots[sIdx];
        if (slot.playerName === currentPlayerName && slot?.lineup?.titans) {
          if (slot.lineup.titans.includes(titanName)) {
            return { fortName: FORTS[fIdx].name, slotIndex: sIdx };
          }
        }
      }
    }
    return null;
  };

  const handleHeroSelect = (heroName, heroIndex) => {
    const { fortIndex, slotIndex, tempData } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока,коллега.' });
      return;
    }
    const usage = isHeroUsedBySamePlayer(heroName, tempData.playerName, fortIndex, slotIndex);
    if (usage) {
      setConflictModal({
        isOpen: true,
        message: `Герой ${heroName} уже используется игроком ${tempData.playerName} в укреплении "${usage.fortName}", слот ${usage.slotIndex + 1}.`
      });
      return;
    }
    const newHeroes = [...tempData.lineup.heroes];
    newHeroes[heroIndex] = heroName;
    setEditModal(prev => ({
      ...prev,
      tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, heroes: newHeroes } }
    }));
  };

  const handleTitanSelect = (titanName, titanIndex) => {
    const { fortIndex, slotIndex, tempData } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока,коллега.' });
      return;
    }
    const usage = isTitanUsedBySamePlayer(titanName, tempData.playerName, fortIndex, slotIndex);
    if (usage) {
      setConflictModal({
        isOpen: true,
        message: `Титан ${titanName} уже используется игроком ${tempData.playerName} в укреплении "${usage.fortName}", слот ${usage.slotIndex + 1}.`
      });
      return;
    }
    const newTitans = [...tempData.lineup.titans];
    newTitans[titanIndex] = titanName;
    setEditModal(prev => ({
      ...prev,
      tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, titans: newTitans } }
    }));
  };

  const openPetSelection = () => {
    const { tempData } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока' });
      return;
    }
    const selectedPet = tempData.lineup.pet;
    const available = PATRON_LIST.filter(p => p !== selectedPet);
    setSelectionModal({
      isOpen: true,
      type: 'pet',
      currentList: available,
      bonusList: [],
      onSelect: (value) => {
        setEditModal(prev => ({
          ...prev,
          tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, pet: value } }
        }));
      },
      isTrainingPack: false,
      trainingPackType: null
    });
  };

  const openHeroSelection = (idx) => {
    const { tempData, fortIndex } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока.' });
      return;
    }
    const selectedHeroes = tempData.lineup.heroes.filter(h => h !== null);
    const selectedPet = tempData.lineup.pet;
    const available = HEROES_LIST.filter(h => h !== selectedPet && !selectedHeroes.includes(h));
    const currentFort = FORTS[fortIndex];
    const bonusHeroes = getBonusHeroesForFort(currentFort);
    setSelectionModal({
      isOpen: true,
      type: 'hero',
      currentList: available,
      bonusList: bonusHeroes,
      onSelect: (value) => handleHeroSelect(value, idx),
      isTrainingPack: false,
      trainingPackType: null
    });
  };

  const openTitanSelection = (idx) => {
    const { tempData, fortIndex } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока' });
      return;
    }
    const selectedTitans = tempData.lineup.titans.filter(t => t !== null);
    const available = TITANS_LIST.filter(t => !selectedTitans.includes(t));
    const currentFort = FORTS[fortIndex];
    const bonusTitans = getBonusTitansForFort(currentFort);
    setSelectionModal({
      isOpen: true,
      type: 'titan',
      currentList: available,
      bonusList: bonusTitans,
      onSelect: (value) => handleTitanSelect(value, idx),
      isTrainingPack: false,
      trainingPackType: null
    });
  };

  const openTrainingPackSelection = (packType, idx) => {
    const { tempData } = editModal;
    if (!tempData.playerName) {
      setConflictModal({ isOpen: true, message: 'Сначала выбери игрока.' });
      return;
    }
    const currentPacks = globalTrainingPacks[tempData.playerName] || { heroesPack: [null, null, null, null, null], titansPack: [null, null, null, null, null] };
    const currentPack = packType === 'heroes' ? currentPacks.heroesPack : currentPacks.titansPack;
    const selectedItems = currentPack.filter(item => item !== null);
    const available = packType === 'heroes'
      ? HEROES_LIST.filter(h => !selectedItems.includes(h))
      : TITANS_LIST.filter(t => !selectedItems.includes(t));
    
    setSelectionModal({
      isOpen: true,
      type: packType === 'heroes' ? 'hero' : 'titan',
      currentList: available,
      bonusList: [],
      onSelect: (value) => {
        const newPack = [...currentPack];
        newPack[idx] = value;
        updateGlobalTrainingPack(tempData.playerName, packType, newPack);
        setEditModal(prev => ({
          ...prev,
          tempData: {
            ...prev.tempData,
            trainingHeroesPack: packType === 'heroes' ? newPack : (prev.tempData.trainingHeroesPack || [null, null, null, null, null]),
            trainingTitansPack: packType === 'titans' ? newPack : (prev.tempData.trainingTitansPack || [null, null, null, null, null])
          }
        }));
      },
      isTrainingPack: true,
      trainingPackType: packType
    });
  };

  const clearTrainingPackSlot = (packType, idx) => {
    const { tempData } = editModal;
    if (!tempData.playerName) return;
    const currentPacks = globalTrainingPacks[tempData.playerName] || { heroesPack: [null, null, null, null, null], titansPack: [null, null, null, null, null] };
    const currentPack = packType === 'heroes' ? currentPacks.heroesPack : currentPacks.titansPack;
    const newPack = [...currentPack];
    newPack[idx] = null;
    updateGlobalTrainingPack(tempData.playerName, packType, newPack);
    setEditModal(prev => ({
      ...prev,
      tempData: {
        ...prev.tempData,
        trainingHeroesPack: packType === 'heroes' ? newPack : (prev.tempData.trainingHeroesPack || [null, null, null, null, null]),
        trainingTitansPack: packType === 'titans' ? newPack : (prev.tempData.trainingTitansPack || [null, null, null, null, null])
      }
    }));
  };

  const clearSlotInModal = (type, idx) => {
    if (type === 'pet') {
      setEditModal(prev => ({
        ...prev,
        tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, pet: null } }
      }));
    } else if (type === 'hero') {
      const newHeroes = [...editModal.tempData.lineup.heroes];
      newHeroes[idx] = null;
      setEditModal(prev => ({
        ...prev,
        tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, heroes: newHeroes } }
      }));
    } else if (type === 'titan') {
      const newTitans = [...editModal.tempData.lineup.titans];
      newTitans[idx] = null;
      setEditModal(prev => ({
        ...prev,
        tempData: { ...prev.tempData, lineup: { ...prev.tempData.lineup, titans: newTitans } }
      }));
    }
  };

  const closeSelectionModal = () => {
    setSelectionModal({ isOpen: false, type: null, currentList: [], bonusList: [], onSelect: null, isTrainingPack: false, trainingPackType: null });
  };

  // Рендер-функции
  const renderSlotPreview = (slot, fortType) => {
    if (!slot || !slot.playerName) return <div className="slot-empty">Нет данных</div>;
    const selectedPlayer = players.find(p => p.name === slot.playerName);
    const avatarUrl = selectedPlayer?.avatarUrl;
    const isHeroes = fortType === 'heroes';
    const lineup = slot.lineup;
    const items = isHeroes ? [lineup.pet, ...lineup.heroes].filter(x => x) : lineup.titans.filter(x => x);
    const playerPacks = globalTrainingPacks[slot.playerName];
    const trainingHeroes = playerPacks?.heroesPack?.filter(x => x) || [];
    const trainingTitans = playerPacks?.titansPack?.filter(x => x) || [];
    const hasTraining = trainingHeroes.length > 0 || trainingTitans.length > 0;
    if (items.length === 0 && !hasTraining) return <div className="slot-empty">Нет состава</div>;

    let statusClass = '';
    if (slot.status === 'green') statusClass = 'slot-status-green';
    else if (slot.status === 'red') statusClass = 'slot-status-red';
    else if (slot.status === 'yellow') statusClass = 'slot-status-yellow';

    return (
      <div className={`slot-preview ${statusClass}`}>
        <div className="slot-player">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={slot.playerName}
              className="slot-avatar-mini"
              onClick={(e) => { e.stopPropagation(); openFullscreen(avatarUrl); }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          {slot.playerName}
        </div>
        {items.length > 0 && (
          <div className="slot-icons">
            {items.map((name, i) => (
              <img
                key={i}
                src={`/images/${isHeroes ? 'heroes' : 'titans'}/${name}.png`}
                alt={name}
                className="slot-icon"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFullSlotView = (slot, slotIndex, fortType) => {
    const isHeroes = fortType === 'heroes';
    const lineup = slot.lineup;
    const selectedPlayer = players.find(p => p.name === slot.playerName);
    const avatarUrl = selectedPlayer?.avatarUrl;
    let statusText = '';
    if (slot.status === 'green') statusText = 'Прокаченная пачка';
    else if (slot.status === 'yellow') statusText = 'Недокаченная, но что-то может';
    else if (slot.status === 'red') statusText = 'В процессе прокачки, пока сдувает ветром';
    const playerPacks = globalTrainingPacks[slot.playerName];
    const trainingHeroes = playerPacks?.heroesPack?.filter(x => x) || [];
    const trainingTitans = playerPacks?.titansPack?.filter(x => x) || [];
    return (
      <div className="view-fort-slot" key={slotIndex}>
        <div className="view-fort-slot-header">
          <span className="view-slot-number">Слот {slotIndex + 1}</span>
          {slot.playerName && (
            <div className="view-slot-player">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={slot.playerName}
                  className="view-slot-avatar"
                  onClick={() => openFullscreen(avatarUrl)}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              {slot.playerName}
            </div>
          )}
        </div>
        {!slot.playerName ? (
          <div className="view-empty-slot">Нет данных</div>
        ) : (
          <div className="view-slot-content">
            {statusText && <div className="slot-status-text">{statusText}</div>}
            {isHeroes ? (
              <>
                <div className="view-slot-pet">
                  Выпердыш: {lineup.pet ? (
                    <div className="view-item">
                      <img src={`/images/heroes/${lineup.pet}.png`} alt={lineup.pet} />
                      <span>{lineup.pet}</span>
                    </div>
                  ) : 'не выбран'}
                </div>
                <div className="view-slot-heroes">
                  Герои:
                  <div className="view-grid">
                    {lineup.heroes.map((hero, idx) => (
                      <div key={idx} className="view-item">
                        {hero ? (
                          <>
                            <img src={`/images/heroes/${hero}.png`} alt={hero} />
                            <span>{hero}</span>
                          </>
                        ) : (
                          <span className="view-empty">пусто</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="view-slot-titans">
                Титаны:
                <div className="view-grid">
                  {lineup.titans.map((titan, idx) => (
                    <div key={idx} className="view-item">
                      {titan ? (
                        <>
                          <img src={`/images/titans/${titan}.png`} alt={titan} />
                          <span>{titan}</span>
                        </>
                      ) : (
                        <span className="view-empty">пусто</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(trainingHeroes.length > 0 || trainingTitans.length > 0) && (
              <div className="view-training-pack">
                <strong>📚 В прокачке:</strong>
                <div className="view-grid">
                  {trainingHeroes.map((item, idx) => (
                    <div key={`h-${idx}`} className="view-item">
                      <img src={`/images/heroes/${item}.png`} alt={item} />
                      <span>{item}</span>
                    </div>
                  ))}
                  {trainingTitans.map((item, idx) => (
                    <div key={`t-${idx}`} className="view-item">
                      <img src={`/images/titans/${item}.png`} alt={item} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLineupEditor = () => {
    const { tempData, fortIndex } = editModal;
    if (!tempData) return null;
    const fortType = FORTS[fortIndex].type;
    const isHeroes = fortType === 'heroes';
    if (isHeroes) {
      const { pet, heroes } = tempData.lineup;
      return (
        <div className="lineup-editor">
          <div className="slot-row">
            <label>Выпердыш:</label>
            <div className="slot-cell" onClick={openPetSelection}>
              {pet ? (
                <>
                  <img src={`/images/heroes/${pet}.png`} alt={pet} />
                  <span>{pet}</span>
                  <button className="clear-slot" onClick={(e) => { e.stopPropagation(); clearSlotInModal('pet'); }}>×</button>
                </>
              ) : (
                <span className="empty-slot">Выбрать пета</span>
              )}
            </div>
          </div>
          <div className="slot-row">
            <label>Герои (5):</label>
            <div className="heroes-grid">
              {heroes.map((hero, idx) => (
                <div key={idx} className="slot-cell small" onClick={() => openHeroSelection(idx)}>
                  {hero ? (
                    <>
                      <img src={`/images/heroes/${hero}.png`} alt={hero} />
                      <span>{hero}</span>
                      <button className="clear-slot" onClick={(e) => { e.stopPropagation(); clearSlotInModal('hero', idx); }}>×</button>
                    </>
                  ) : (
                    <span className="empty-slot">Убогий {idx+1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      const { titans } = tempData.lineup;
      return (
        <div className="lineup-editor">
          <div className="slot-row">
            <label>Абрэки (5):</label>
            <div className="titans-grid">
              {titans.map((titan, idx) => (
                <div key={idx} className="slot-cell small" onClick={() => openTitanSelection(idx)}>
                  {titan ? (
                    <>
                      <img src={`/images/titans/${titan}.png`} alt={titan} />
                      <span>{titan}</span>
                      <button className="clear-slot" onClick={(e) => { e.stopPropagation(); clearSlotInModal('titan', idx); }}>×</button>
                    </>
                  ) : (
                    <span className="empty-slot">Калека {idx+1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderTrainingPackEditor = () => {
    const { tempData } = editModal;
    if (!tempData || !tempData.playerName) return null;
    const playerPacks = globalTrainingPacks[tempData.playerName] || { heroesPack: [null, null, null, null, null], titansPack: [null, null, null, null, null] };
    const heroesPack = playerPacks.heroesPack;
    const titansPack = playerPacks.titansPack;
    return (
      <div className="training-pack-editor">
        <label>📚 Качаются сейчас для будущей защиты</label>
        <div className="training-pack-subsection">
          <div className="training-pack-label">Сострадальцы:</div>
          <div className="training-pack-grid">
            {heroesPack.map((item, idx) => (
              <div key={`hero-${idx}`} className="training-slot-cell" onClick={() => openTrainingPackSelection('heroes', idx)}>
                {item ? (
                  <>
                    <img src={`/images/heroes/${item}.png`} alt={item} />
                    <span>{item}</span>
                    <button className="clear-slot training-clear" onClick={(e) => { e.stopPropagation(); clearTrainingPackSlot('heroes', idx); }}>×</button>
                  </>
                ) : (
                  <span className="empty-slot">Доходяга {idx+1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="training-pack-subsection">
          <div className="training-pack-label">Крестьяне:</div>
          <div className="training-pack-grid">
            {titansPack.map((item, idx) => (
              <div key={`titan-${idx}`} className="training-slot-cell" onClick={() => openTrainingPackSelection('titans', idx)}>
                {item ? (
                  <>
                    <img src={`/images/titans/${item}.png`} alt={item} />
                    <span>{item}</span>
                    <button className="clear-slot training-clear" onClick={(e) => { e.stopPropagation(); clearTrainingPackSlot('titans', idx); }}>×</button>
                  </>
                ) : (
                  <span className="empty-slot">Бедолага {idx+1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Загрузка всякой хуйни...</div>;
  if (!fortsData) return <div className="loading">Нет данных</div>;

  return (
    <div className="stronghold-defense">
      {saving && <div className="saving-overlay">Сохранение...</div>}
      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}
      <h2 className="sd-title">В виде карты защиту СМ изменим в процессе...</h2>
      <div className="forts-wrapper">
        {/* Титанские укрепления */}
        <div className="forts-section">
          <div className="forts-section-header">⚔️ Титаны ⚔️</div>
          <div className="forts-grid">
            {FORTS.filter(f => f.type === 'titans').map((fort, idx) => {
              const fortIdx = FORTS.findIndex(f => f.name === fort.name);
              const slots = fortsData[fortIdx];
              const dynamicBonus = computeFortBonus(fort, slots);
              return (
                <div key={fortIdx} className="fort-card" onClick={() => handleFortClick(fortIdx)}>
                  <div className="fort-name">{fort.name}</div>
                  <div className="fort-bonus">{dynamicBonus}</div>
                  <div className="fort-section">
                    <div className="slots-container">
                      {slots.map((slot, slotIdx) => (
                        <div key={`titan-${slotIdx}`} className="slot-card" onClick={(e) => handleSlotClick(fortIdx, slotIdx, e)}>
                          {renderSlotPreview(slot, 'titans')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="section-divider"></div>
        {/* Геройские укрепления */}
        <div className="forts-section">
          <div className="forts-section-header">🛡️ Герои 🛡️</div>
          <div className="forts-grid">
            {FORTS.filter(f => f.type === 'heroes').map((fort, idx) => {
              const fortIdx = FORTS.findIndex(f => f.name === fort.name);
              const slots = fortsData[fortIdx];
              const dynamicBonus = computeFortBonus(fort, slots);
              return (
                <div key={fortIdx} className="fort-card" onClick={() => handleFortClick(fortIdx)}>
                  <div className="fort-name">{fort.name}</div>
                  <div className="fort-bonus">{dynamicBonus}</div>
                  <div className="fort-section">
                    <div className="slots-container">
                      {slots.map((slot, slotIdx) => (
                        <div key={`hero-${slotIdx}`} className="slot-card" onClick={(e) => handleSlotClick(fortIdx, slotIdx, e)}>
                          {renderSlotPreview(slot, 'heroes')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Модалка просмотра укрепления */}
      {viewFortModal.isOpen && fortsData && fortsData[viewFortModal.fortIndex] && (
        <div className="modal-overlay" onClick={closeViewFortModal}>
          <div className="modal-content view-fort-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{FORTS[viewFortModal.fortIndex].name}</h3>
            <div className="fort-bonus" style={{ textAlign: 'center', marginBottom: '10px' }}>
              {computeFortBonus(FORTS[viewFortModal.fortIndex], fortsData[viewFortModal.fortIndex])}
            </div>
            <div className="view-fort-slots">
              {fortsData[viewFortModal.fortIndex].map((slot, idx) => renderFullSlotView(slot, idx, FORTS[viewFortModal.fortIndex].type))}
            </div>
            <div className="modal-buttons">
              <button onClick={closeViewFortModal} className="cancel-btn">Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка редактирования слота */}
      {editModal.isOpen && editModal.tempData && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content edit-fort-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeEditModal}>✕</button>
            <h3>{FORTS[editModal.fortIndex].name} - Слот {editModal.slotIndex + 1}</h3>
            <div className="edit-form">
              <div className="top-combined-block">
                <div className="status-section">
                  <label>Статус пачки</label>
                  <div className="status-chips-vertical">
                    <div className={`status-chip ${editModal.tempData.status === 'green' ? 'active-green' : ''}`} onClick={() => updateStatus('green')}>
                      <span className="chip-square green"></span>
                      <span className="chip-label">Прокаченная пачка</span>
                    </div>
                    <div className={`status-chip ${editModal.tempData.status === 'red' ? 'active-red' : ''}`} onClick={() => updateStatus('red')}>
                      <span className="chip-square red"></span>
                      <span className="chip-label">Недокаченная, но что-то может</span>
                    </div>
                    <div className={`status-chip ${editModal.tempData.status === 'yellow' ? 'active-yellow' : ''}`} onClick={() => updateStatus('yellow')}>
                      <span className="chip-square yellow"></span>
                      <span className="chip-label">В процессе прокачки, пока сдувает ветром</span>
                    </div>
                  </div>
                </div>
                <div className="training-section">
                  {renderTrainingPackEditor()}
                </div>
              </div>
              <div className="player-selection-area">
                <div className="player-select-wrapper">
                  <label>Игрок:</label>
                  <div className="custom-select">
                    <select value={editModal.tempData.playerName} onChange={(e) => updatePlayerName(e.target.value)}>
                      <option value="">-- Выберите ковбоя --</option>
                      {players.map(player => (
                        <option key={player.name} value={player.name}>{player.name}</option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                {editModal.tempData.playerName && (
                  <div className="player-avatar-large">
                    {(() => {
                      const selected = players.find(p => p.name === editModal.tempData.playerName);
                      const avatarUrl = selected?.avatarUrl;
                      if (!avatarUrl) return <div className="no-avatar-placeholder">Нет аналитики какого то хуя</div>;
                      return (
                        <img
                          src={avatarUrl}
                          alt={editModal.tempData.playerName}
                          className="large-avatar"
                          onClick={() => openAvatarInNewTab(avatarUrl)}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      );
                    })()}
                    <div className="avatar-fallback" style={{ display: 'none' }}>Ошибка загрузки</div>
                  </div>
                )}
              </div>
              {renderLineupEditor()}
              <div className="modal-buttons">
                <button onClick={saveSlot} className="save-btn">Сохранить ебалу</button>
                <button onClick={clearSlot} className="clear-btn">Удалить уебка</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка выбора существа */}
      {selectionModal.isOpen && (
        <div className="modal-overlay" onClick={closeSelectionModal}>
          <div className="modal-content selection-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {selectionModal.type === 'pet' && 'Выберите питомца'}
              {selectionModal.type === 'hero' && (selectionModal.isTrainingPack ? 'Выберите героя для прокачки' : 'Выберите героя')}
              {selectionModal.type === 'titan' && (selectionModal.isTrainingPack ? 'Выберите титана для прокачки' : 'Выберите титана')}
            </h3>
            <div className="selection-grid">
              {selectionModal.currentList.map(item => {
                const isBonus = !selectionModal.isTrainingPack && selectionModal.bonusList.includes(item);
                return (
                  <div
                    key={item}
                    className={`selection-item ${isBonus ? 'bonus-item' : ''}`}
                    onClick={() => {
                      selectionModal.onSelect(item);
                      closeSelectionModal();
                    }}
                  >
                    <img
                      src={`/images/${selectionModal.type === 'titan' ? 'titans' : 'heroes'}/${item}.png`}
                      alt={item}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span>{item}</span>
                  </div>
                );
              })}
              {selectionModal.currentList.length === 0 && <div className="no-items">Нет доступных</div>}
            </div>
            <button className="selection-close-btn" onClick={closeSelectionModal}>Закрыть</button>
          </div>
        </div>
      )}

      {/* Модалка конфликта */}
      {conflictModal.isOpen && (
        <div className="modal-overlay" onClick={() => setConflictModal({ isOpen: false, message: '' })}>
          <div className="modal-content conflict-modal" onClick={(e) => e.stopPropagation()}>
            <div className="conflict-icon">⚠️</div>
            <h3>Невозможно выбрать</h3>
            <p>{conflictModal.message}</p>
            <div className="modal-buttons">
              <button onClick={() => setConflictModal({ isOpen: false, message: '' })} className="confirm-btn">Мне похуй</button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen аватара */}
      {fullscreenAvatar && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <button className="fullscreen-close" onClick={closeFullscreen}>×</button>
          <img src={fullscreenAvatar} alt="Fullscreen" className="fullscreen-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default StrongholdDefense;
