import { useEffect, useRef, useState } from 'react';

const AudioManager = () => {
  const clickRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const ambientRef = useRef(null);
  const autoSoundRef = useRef(null); // Новый звук для автовоспроизведения
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    // Создаем аудио элементы
    clickRef.current = new Audio();
    openRef.current = new Audio();
    closeRef.current = new Audio();
    ambientRef.current = new Audio();
    autoSoundRef.current = new Audio(); // Создаем аудио для автовоспроизведения

    // Настройка звуков
    clickRef.current.src = '/sounds/click.mp3';
    openRef.current.src = '/sounds/open.mp3';
    closeRef.current.src = '/sounds/close.mp3';
    ambientRef.current.src = '/sounds/ambient.mp3';
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0.3;
    
    // Настройка звука для автовоспроизведения
    autoSoundRef.current.src = '/sounds/nefretle-ache-slow.mp3'; // или любой другой звук
    autoSoundRef.current.volume = 0.5;

    // Функции для управления звуками
    const playClick = () => {
      if (clickRef.current && isAudioEnabled) {
        clickRef.current.currentTime = 0;
        clickRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const playOpen = () => {
      if (openRef.current && isAudioEnabled) {
        openRef.current.currentTime = 0;
        openRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const playClose = () => {
      if (closeRef.current && isAudioEnabled) {
        closeRef.current.currentTime = 0;
        closeRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const startAmbient = () => {
      if (ambientRef.current && isAudioEnabled) {
        ambientRef.current.play().catch(e => console.log("Ambient audio failed:", e));
      }
    };

    const stopAmbient = () => {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.currentTime = 0;
      }
    };

    // Функция для воспроизведения автоматического звука
    const playAutoSound = () => {
      if (autoSoundRef.current && isAudioEnabled) {
        autoSoundRef.current.currentTime = 0;
        autoSoundRef.current.play().catch(e => {
          console.log("Auto sound failed to play automatically:", e);
          // Если автовоспроизведение заблокировано, попробуем при первом клике
          if (e.name === 'NotAllowedError') {
            const handleFirstClickForAutoSound = () => {
              autoSoundRef.current.play().catch(e => console.log("Auto sound play failed:", e));
              document.removeEventListener('click', handleFirstClickForAutoSound);
            };
            document.addEventListener('click', handleFirstClickForAutoSound);
          }
        });
      }
    };

    // Функция для отключения/включения всех звуков
    const toggleAudio = () => {
      setIsAudioEnabled(prev => {
        const newState = !prev;
        if (!newState) {
          // Если звук отключается - останавливаем все звуки
          stopAmbient();
          if (autoSoundRef.current) {
            autoSoundRef.current.pause();
          }
        }
        return newState;
      });
    };

    // Добавляем функции в глобальный объект
    window.audioManager = {
      playClick,
      playOpen,
      playClose,
      startAmbient,
      stopAmbient,
      playAutoSound,
      toggleAudio,
      isAudioEnabled: () => isAudioEnabled
    };

    // Пытаемся воспроизвести автоматический звук при загрузке
    playAutoSound();

    // Запускаем ambient звук при первом клике
    const handleFirstClick = () => {
      if (isAudioEnabled) {
        startAmbient();
      }
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
      delete window.audioManager;
    };
  }, [isAudioEnabled]);

  return null;
};

export default AudioManager;
