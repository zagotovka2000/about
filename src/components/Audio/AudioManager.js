import React, { useEffect, useRef } from 'react';

const AudioManager = () => {
  const clickRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const ambientRef = useRef(null);

  useEffect(() => {
    // Создаем аудио элементы
    clickRef.current = new Audio();
    openRef.current = new Audio();
    closeRef.current = new Audio();
    ambientRef.current = new Audio();

    // Настройка звуков (замените на реальные файлы)
    clickRef.current.src = '/sounds/click.mp3';
    openRef.current.src = '/sounds/open.mp3';
    closeRef.current.src = '/sounds/close.mp3';
    ambientRef.current.src = '/sounds/ambient.mp3';
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0.3;

    // Функции для управления звуками
    const playClick = () => {
      if (clickRef.current) {
        clickRef.current.currentTime = 0;
        clickRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const playOpen = () => {
      if (openRef.current) {
        openRef.current.currentTime = 0;
        openRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const playClose = () => {
      if (closeRef.current) {
        closeRef.current.currentTime = 0;
        closeRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    const startAmbient = () => {
      if (ambientRef.current) {
        ambientRef.current.play().catch(e => console.log("Ambient audio failed:", e));
      }
    };

    // Добавляем функции в глобальный объект
    window.audioManager = {
      playClick,
      playOpen,
      playClose,
      startAmbient
    };

    // Запускаем ambient звук при первом клике
    const handleFirstClick = () => {
      startAmbient();
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
      delete window.audioManager;
    };
  }, []);

  return null; // Этот компонент ничего не рендерит
};

export default AudioManager;
