import React, { useEffect } from 'react'; // Добавьте useEffect

const AudioControls = () => {
  const toggleAudio = () => {
    if (window.audioManager && window.audioManager.toggleAudio) {
      window.audioManager.toggleAudio();
    }
  };

  // Используйте useEffect для вызова playAutoSound при монтировании компонента
  useEffect(() => {
    const playAutoSound = () => {
      if (window.audioManager && window.audioManager.playAutoSound) {
        window.audioManager.playAutoSound();
      }
    };
    playAutoSound();
  }, []); // Пустой массив зависимостей = выполнить только при монтировании

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
      <button 
        onClick={toggleAudio}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        {window.audioManager && window.audioManager.isAudioEnabled 
          ? window.audioManager.isAudioEnabled() ? 'Выключить звук' : 'Включить звук'
          : 'Включить звук'}
      </button>
    </div>
  );
};

export default AudioControls;
