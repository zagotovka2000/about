import React from 'react';

const AudioControls = () => {
  const toggleAudio = () => {
    if (window.audioManager && window.audioManager.toggleAudio) {
      window.audioManager.toggleAudio();
    }
  };

  const playAutoSound = () => {
    if (window.audioManager && window.audioManager.playAutoSound) {
      window.audioManager.playAutoSound();
    }
  };

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
