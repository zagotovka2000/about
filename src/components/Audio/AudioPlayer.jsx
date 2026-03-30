import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const updateState = () => {
      if (window.audioManager) {
        setIsPlaying(window.audioManager.isPlaying?.() || false);
       }
    };
    updateState();
    const interval = setInterval(updateState, 500);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    window.audioManager?.playMusic();
  };

  const handlePause = () => {
    window.audioManager?.pauseMusic();
  };

  const handleNext = () => {
    window.audioManager?.nextTrack();
  };

  const handlePrev = () => {
    window.audioManager?.prevTrack();
  };

  return (
    <div className={`audio-sheet ${isOpen ? 'open' : ''}`}>
      <div className="sheet-tab" onClick={() => setIsOpen(!isOpen)}>
        <div className="tab-icon">🎵</div>
        <div className="tab-text">Радиопиздец</div>
      </div>

      <div className="sheet-content">
        <div className="player-controls">
          <button className="control-btn" onClick={handlePrev} title="Предыдущий">
            ⏮
          </button>
          {!isPlaying ? (
            <button className="control-btn play" onClick={handlePlay} title="Play">
              ▶
            </button>
          ) : (
            <button className="control-btn pause" onClick={handlePause} title="Pause">
              ⏸
            </button>
          )}
          <button className="control-btn" onClick={handleNext} title="Следующий">
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
