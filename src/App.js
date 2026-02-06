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
import AudioButton from './components/Audio/AudioButton';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

    


  const sections = [
    { id: 'war', title: 'ВОЙНА', component: <War />, position: 'gate' },
    { id: 'sm', title: 'СТОЛКНОВЕНИЕ', component: <Sm />, position: 'tower-left' },
    { id: 'asgard', title: 'АСГАРД', component: <Asgard />, position: 'tower-right' },
    { id: 'territory', title: 'ПОДБОР', component: <Territory />, position: 'window-left' },
    { id: 'activ', title: 'АКТИВНОСТЬ', component: <Activ />, position: 'window-center' },
    { id: 'nakazanie', title: 'НАКАЗАНИЯ', component: <Nakazanie />, position: 'window-right' },
  ];

  const handleSectionClick = (section) => {
    setModalTitle(section.title);
    setModalContent(section.component);
    setModalOpen(true);
  };

  return (
    <div className="App">
      <AudioManager />
    <Particles /> 

    <AudioButton 
  position="fixed" 
  top="20px" 
  right="20px" 
  showWelcomeButton={true} 
/>

  <Monolith           // ← НОВАЯ СТРОКА
    sections={sections}
    onSectionClick={handleSectionClick}
  />

      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>

    </div>
  );
}

export default App;
