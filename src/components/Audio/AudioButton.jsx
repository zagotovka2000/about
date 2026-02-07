// components/Audio/AudioButton.jsx
import React, { useState, useEffect } from 'react';

const AudioButton = ({ 
  position = 'fixed',
  top = '20px',
  right = '20px',
  left = 'auto',
  bottom = 'auto',
  showWelcomeButton = true 
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const toggleAudio = () => {
    setIsAudioEnabled(prev => {
      const newState = !prev;
      if (window.audioManager) {
        window.audioManager.toggleAudio();
      }
      return newState;
    });
  };

  // Если нужно воспроизвести звук при загрузке, используйте useEffect
  useEffect(() => {
    // Если функция playAutoSound нужна при монтировании компонента
    // if (window.audioManager && window.audioManager.playAutoSound) {
    //   window.audioManager.playAutoSound();
    // }
    
    // Инициализация состояния из аудио менеджера, если он существует
    if (window.audioManager && window.audioManager.isAudioEnabled) {
      const enabled = window.audioManager.isAudioEnabled();
      setIsAudioEnabled(enabled);
    }
  }, []);

  return (
    <div style={{ 
      position, 
      top, 
      right, 
      left, 
      bottom, 
      zIndex: 1000,
      display: 'flex',
      gap: '10px'
    }}>
      <button 
        onClick={toggleAudio}
        style={{
          padding: '10px 15px',
          backgroundColor: isAudioEnabled ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isAudioEnabled ? '🔊' : '🔇'}
        <span>{isAudioEnabled ? 'ВКЛ' : 'ВЫКЛ'}</span>
      </button>
    </div>
  );
};

export default AudioButton;
