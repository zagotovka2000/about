import { useEffect, useRef, useCallback, useState } from 'react';

const SONG_LIST = [
  '/sounds/song1.mp3',
  '/sounds/song2.mp3',
  '/sounds/song3.mp3',
  '/sounds/song4.mp3',
  '/sounds/song5.mp3',
  '/sounds/song6.mp3',
  '/sounds/song7.mp3',
  '/sounds/song8.mp3',
  '/sounds/song9.mp3',
  '/sounds/song10.mp3',
  '/sounds/song11.mp3',
  '/sounds/song12.mp3',
  '/sounds/song13.mp3',
  '/sounds/song14.mp3',
  '/sounds/song15.mp3',
  '/sounds/song16.mp3',
  '/sounds/song17.mp3',
  '/sounds/song18.mp3',
  '/sounds/song19.mp3',
  '/sounds/song20.mp3',
  '/sounds/song21.mp3',
  '/sounds/song22.mp3',
];

// Функция для получения случайного индекса (не равного current, если нужно)
const getRandomIndex = (currentIndex = -1) => {
  if (SONG_LIST.length === 1) return 0;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * SONG_LIST.length);
  } while (newIndex === currentIndex);
  return newIndex;
};

const AudioManager = () => {
  const clickRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const ambientRef = useRef(null);
  const playerRef = useRef(null);

  // Инициализируем случайный индекс при первом рендере
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => getRandomIndex());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Инициализация аудио элементов (один раз)
  useEffect(() => {
    clickRef.current = new Audio('/sounds/click.mp3');
    openRef.current = new Audio('/sounds/open.mp3');
    closeRef.current = new Audio('/sounds/close.mp3');
    ambientRef.current = new Audio('/sounds/ambient.mp3');
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0.3;

    playerRef.current = new Audio();
    playerRef.current.volume = 0.5;
  }, []);

  // Эффект для обновления src плеера при смене трека
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const newSrc = SONG_LIST[currentTrackIndex];
      if (player.src !== newSrc) {
        const wasPlaying = !player.paused;
        player.src = newSrc;
        if (wasPlaying) {
          player.play().catch(e => console.log("Resume after track change failed:", e));
        }
      }
    }
  }, [currentTrackIndex]);

  // Следующий трек – случайный (отличный от текущего)
  const playNext = useCallback(() => {
    setCurrentTrackIndex(prev => getRandomIndex(prev));
  }, []);

  // Предыдущий трек – тоже случайный
  const playPrev = useCallback(() => {
    setCurrentTrackIndex(prev => getRandomIndex(prev));
  }, []);

  const handleTrackEnd = useCallback(() => {
    playNext(); // при окончании автоматически запускается случайный трек
  }, [playNext]);

  // Добавляем обработчик окончания трека
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.addEventListener('ended', handleTrackEnd);
      return () => {
        player.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [handleTrackEnd]);

  const playCurrent = useCallback(() => {
    const player = playerRef.current;
    if (player && isAudioEnabled && player.paused) {
      player.play().catch(e => console.log("Play failed:", e));
    }
  }, [isAudioEnabled]);

  const pauseCurrent = useCallback(() => {
    const player = playerRef.current;
    if (player && !player.paused) {
      player.pause();
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        pauseCurrent();
        ambientRef.current?.pause();
      } else {
        if (playerRef.current && !playerRef.current.paused) {
          playCurrent();
        }
        ambientRef.current?.play().catch(e => console.log("Ambient play failed:", e));
      }
      return newState;
    });
  }, [playCurrent, pauseCurrent]);

  // Экспорт глобального объекта
  useEffect(() => {
    window.audioManager = {
      playClick: () => {
        if (clickRef.current && isAudioEnabled) {
          clickRef.current.currentTime = 0;
          clickRef.current.play().catch(e => console.log("Click failed:", e));
        }
      },
      playOpen: () => {
        if (openRef.current && isAudioEnabled) {
          openRef.current.currentTime = 0;
          openRef.current.play().catch(e => console.log("Open failed:", e));
        }
      },
      playClose: () => {
        if (closeRef.current && isAudioEnabled) {
          closeRef.current.currentTime = 0;
          closeRef.current.play().catch(e => console.log("Close failed:", e));
        }
      },
      startAmbient: () => {
        if (ambientRef.current && isAudioEnabled) {
          ambientRef.current.play().catch(e => console.log("Ambient failed:", e));
        }
      },
      stopAmbient: () => {
        if (ambientRef.current) {
          ambientRef.current.pause();
          ambientRef.current.currentTime = 0;
        }
      },
      toggleAudio,
      playMusic: playCurrent,
      pauseMusic: pauseCurrent,
      nextTrack: playNext,
      prevTrack: playPrev,
      isAudioEnabled: () => isAudioEnabled,
      isPlaying: () => playerRef.current && !playerRef.current.paused,
      getCurrentTrack: () => SONG_LIST[currentTrackIndex],
    };

    return () => {
      delete window.audioManager;
    };
  }, [isAudioEnabled, playCurrent, pauseCurrent, playNext, playPrev, toggleAudio, currentTrackIndex]);

  // Первый клик – запуск ambient
  useEffect(() => {
    const handleFirstClick = () => {
      if (isAudioEnabled) {
        window.audioManager?.startAmbient();
      }
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [isAudioEnabled]);

  return null;
};

export default AudioManager;
