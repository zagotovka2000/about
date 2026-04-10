import React, { useState } from 'react';
import Monolith from './components/Monolith/Monolith';
import Modal from './components/Modal/Modal';
import AudioManager from './components/Audio/AudioManager';
import Particles from './components/Effects/Particles';
import './App.css';

// Импортируем компоненты контента
import War from './War/War';
import Sm from './Sm/Sm';
import Asgard from './Asgard/Asgard';
import Territory from './Territory/Territory';
import Activ from './Activ/Activ';
import Nakazanie from './Nakazanie/Nakazanie';
import AudioPlayer from './components/Audio/AudioPlayer';
import Arena from './components/Arena/Arena';  // ← импорт Arena

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const sections = [
    { id: 'territory', title: 'ГЕРОИ', component: <Territory />, position: 'window-left' },
    { id: 'war', title: 'ТИТАНЫ', component: <War />, position: 'gate' },
    { id: 'sm', title: 'СТОЛКНОВЕНИЕ', component: <Sm />, position: 'tower-left' },
    { id: 'asgard', title: 'АСГАРД', component: <Asgard />, position: 'tower-right' },
    { id: 'activ', title: 'АКТИВНОСТЬ', component: <Activ />, position: 'window-center' },
    { id: 'nakazanie', title: 'НАКАЗАНИЯ', component: <Nakazanie />, position: 'window-right' },
  ];

  const handleSectionClick = (section) => {
    setModalTitle(section.title);
    setModalContent(section.component);
    setModalOpen(true);
  };

  // Обработчик открытия арены по невидимой кнопке
  const handleArenaClick = () => {
    setModalTitle('Арена');
    setModalContent(<Arena />);
    setModalOpen(true);
  };

  return (
    <div className="App">
      <AudioManager />
      <Particles />

      <Monolith
        sections={sections}
        onSectionClick={handleSectionClick}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>

      <AudioPlayer />

      {/* НЕВИДИМАЯ КНОПКА */}
      <button
        onClick={handleArenaClick}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '50px',
          height: '50px',
          opacity: 0,
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          zIndex: 9999,
        }}
        aria-label="Скрытая кнопка арены"
      />
    </div>
  );
}

export default App;
