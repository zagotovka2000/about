// App.js
import React, { useState, useRef, useEffect } from 'react';
import Monolith from './components/Monolith/Monolith';
import Modal from './components/Modal/Modal';
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
import Unloading from './Unloading/Unloading';
import Table from './Table/Table';
import SmPlan from './SmPlan/SmPlan';
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // Ссылки на аудиоэлементы
  const openSoundRef = useRef(null);
  const closeSoundRef = useRef(null);

  // Инициализация аудио при монтировании компонента
  useEffect(() => {
    // Создаем аудио объекты
    openSoundRef.current = new Audio('/sounds/open-modal.mp3'); // Путь к звуку открытия
    closeSoundRef.current = new Audio('/sounds/close-modal.mp3'); // Путь к звуку закрытия
    
    // Настройка громкости (опционально)
    if (openSoundRef.current) {
      openSoundRef.current.volume = 0.5;
    }
    if (closeSoundRef.current) {
      closeSoundRef.current.volume = 0.5;
    }

    // Очистка при размонтировании
    return () => {
      if (openSoundRef.current) {
        openSoundRef.current.pause();
        openSoundRef.current = null;
      }
      if (closeSoundRef.current) {
        closeSoundRef.current.pause();
        closeSoundRef.current = null;
      }
    };
  }, []);

  // Функция воспроизведения звука с обработкой ошибок
  const playSound = (audioRef) => {
    try {
      if (audioRef.current) {
        // Перематываем на начало для возможности быстрого повторного воспроизведения
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.warn('Ошибка воспроизведения звука:', error);
        });
      }
    } catch (error) {
      console.warn('Ошибка воспроизведения звука:', error);
    }
  };

  // 8 секций – порядок влияет на расположение по кругу (первая сверху)
  const sections = [
    { id: 'territory', title: 'ГЕРОИ', component: <Territory /> },
    { id: 'war', title: 'ТИТАНЫ', component: <War /> },
    { id: 'sm', title: 'СТОЛКНОВЕНИЕ', component: <Sm /> },
    { id: 'soveti', title: 'АСГАРД', component: <Asgard /> },
    { id: 'asgard', title: 'СОВЕТЫ ОТ ДИАБЛО', component: <Soveti /> },
    { id: 'activ', title: 'АКТИВНОСТЬ', component: <Activ /> },
    { id: 'smplan', title: 'ПЛАНИРОВЩИК', component: <SmPlan /> },
    { id: 'nakazanie', title: 'НАКАЗАНИЯ', component: <Nakazanie /> },
    { id: 'tournament', title: 'Выгрузки реплеев', component: <Unloading /> },
    { id: 'table', title: 'АРЕНА', component: <Table /> },
  ];

  const handleSectionClick = (section) => {
    setModalTitle(section.title);
    setModalContent(section.component);
    setModalOpen(true);
    // Воспроизводим звук открытия
    playSound(openSoundRef);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Воспроизводим звук закрытия
    playSound(closeSoundRef);
  };

  return (
    <div className="App">
      <Particles />
      <Monolith sections={sections} onSectionClick={handleSectionClick} />
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}

export default App;
