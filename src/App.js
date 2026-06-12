// App.js
import React, { useState } from 'react';
import Monolith from './components/Monolith/Monolith';
import Modal from './components/Modal/Modal';
import AudioManager from './components/Audio/AudioManager';
import Particles from './components/Effects/Particles';
import './App.css';

// Импорт компонентов контента (убедитесь, что пути правильные)
import War from './War/War';
import Sm from './Sm/Sm';
import Asgard from './Asgard/Asgard';
import Soveti from './Soveti/Soveti';
import Territory from './Territory/Territory';
import Activ from './Activ/Activ';
import Nakazanie from './Nakazanie/Nakazanie';
import AudioPlayer from './components/Audio/AudioPlayer';
import Arena from './components/Arena/Arena';
import Unloading from './Unloading/Unloading';
import Table from './Table/Table';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // 8 секций – порядок влияет на расположение по кругу (первая сверху)
  const sections = [
    { id: 'territory', title: 'ГЕРОИ', component: <Territory /> },
    { id: 'war', title: 'ТИТАНЫ', component: <War /> },
    { id: 'sm', title: 'СТОЛКНОВЕНИЕ', component: <Sm /> },
    { id: 'asgard', title: 'АСГАРД', component: <Asgard /> },
    { id: 'asgard', title: 'СОВЕТЫ ОТ ДИАБЛО', component: <Soveti /> },
    { id: 'activ', title: 'АКТИВНОСТЬ', component: <Activ /> },
    { id: 'nakazanie', title: 'НАКАЗАНИЯ', component: <Nakazanie /> },
    { id: 'tournament', title: 'Выгрузки реплеев', component: <Unloading /> },
    { id: 'table', title: 'АРЕНА', component: <Table /> },
  ];

  const handleSectionClick = (section) => {
    setModalTitle(section.title);
    setModalContent(section.component);
    setModalOpen(true);
  };

  const handleArenaClick = () => {
    setModalTitle('Арена');
    setModalContent(<Arena />);
    setModalOpen(true);
  };

  return (
    <div className="App">
      <AudioManager />
      <Particles />
      <Monolith sections={sections} onSectionClick={handleSectionClick} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>
      <AudioPlayer />
      {/* Невидимая кнопка арены */}
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
