import React, { useEffect, useRef, useState } from 'react';
import './Monolith.css';
import flagImage from '../../flag.png';

const Monolith = ({ sections, onSectionClick }) => {
  const containerRef = useRef(null);
  const crystalRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [crystalRotation, setCrystalRotation] = useState({ x: 0, y: 0 });
  const [letterAnimation, setLetterAnimation] = useState(0);

  // Параллакс эффект - исправленный (без смещения позиции)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!crystalRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Нормализуем координаты мыши от -0.5 до 0.5
      const x = (clientX / innerWidth - 0.5);
      const y = (clientY / innerHeight - 0.5);
      
      // Устанавливаем вращение без изменения позиции
      setCrystalRotation({
        x: y * 20, // -10 до 10 градусов по X
        y: x * 20  // -10 до 10 градусов по Y
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Анимация букв "МОНОЛИТ" с огнем
  useEffect(() => {
    let animationFrameId;
    let time = 0;
    
    const animate = () => {
      time += 0.02;
      setLetterAnimation(time);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Цвета для секций
  const colors = [
    '#FF3366', // Красный
    '#00E0FF', // Бирюзовый
    '#FFD700', // Жёлтый
    '#00FF88', // Зелёный
    '#7B68EE', // Синий
    '#FF6BCB', // Розовый
  ];

  // Буквы для текста "МОНОЛИТ" с огненным эффектом
  const letters = ['М', 'О', 'Н', 'О', 'Л', 'И', 'Т'];
  
  // Огненные цвета для градиента
  const fireColors = [
    '#FF0000', '#FF3300', '#FF6600', 
    '#FF9900', '#FFCC00', '#FFFF00'
  ];

  // Получаем первую букву названия секции
  const getFirstLetter = (title) => {
    // Для кириллических букв
    const russianLetters = {
      'В': 'В', 'С': 'С', 'А': 'А', 'Т': 'Т', 'Н': 'Н'
    };
    return title.charAt(0);
  };

  // Анимация клика секции
  const handleSectionClick = (section, index) => {
    setActiveSection(index);
    
    if (window.audioManager) {
      window.audioManager.playClick?.();
    }
    
    setTimeout(() => {
      onSectionClick(section);
      setActiveSection(null);
    }, 500);
  };

  return (
    <div className="monolith-container" ref={containerRef}>
      {/* Фон с градиентом */}
      <div className="monolith-bg"></div>

      {/* Центральный кристалл - исправлен параллакс */}
      <div 
        ref={crystalRef}
        className="central-crystal"
        style={{
          transform: `translate(-50%, -50%) rotateX(${crystalRotation.x}deg) rotateY(${crystalRotation.y}deg)`
        }}
      >
        {/* Внутреннее ядро */}
        <div className="crystal-core">
          <div className="core-pulse"></div>
          <div className="core-light"></div>
          
          {/* Текст "МОНОЛИТ" с огненным эффектом */}
          <div className="crystal-text-container">
            {/* Внешнее огненное свечение */}
            <div className="fire-glow" style={{
              opacity: 0.3 + Math.sin(letterAnimation * 2) * 0.3,
            }}></div>
            
            {/* Сам текст с переливающимися цветами огня */}
            <div className="crystal-text">
              {letters.map((letter, index) => {
                const offset = index * 0.1;
                const animTime = (letterAnimation + offset) % 1;
                const fireIntensity = 0.5 + Math.sin(animTime * Math.PI * 2) * 0.5;
                
                return (
                  <span 
                    key={index}
                    className="fire-letter"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      '--fire-intensity': fireIntensity
                    }}
                  >
                    {letter}
                    {/* Эффект пламени над буквой */}
                    <div className="letter-flame"></div>
                  </span>
                );
              })}
            </div>
            
            {/* Флаг под текстом */}
            <div className="crystal-flag">
  <div 
    className="flag-icon"

  ></div>
</div>
          </div>
        </div>

        {/* Лучи от центра */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="crystal-ray"
            style={{ 
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}

        {/* Вращающиеся кольца */}
        <div className="crystal-ring ring-1"></div>
        <div className="crystal-ring ring-2"></div>
        <div className="crystal-ring ring-3"></div>
        <div className="crystal-ring ring-4"></div>
        <div className="crystal-ring ring-5"></div>
        <div className="crystal-ring ring-6"></div>
      </div>

      {/* Секции вокруг монолита */}
      <div className="sections-container">
        {sections.map((section, index) => {
          const isActive = activeSection === index;
          const color = colors[index];
          
          // Позиционируем секции по кругу
          const angle = (index * Math.PI * 2) / 6 - Math.PI / 2;
          const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
          
          const left = 50 + Math.cos(angle) * (radius / window.innerWidth * 100);
          const top = 50 + Math.sin(angle) * (radius / window.innerHeight * 100);
          
          return (
            <div
              key={section.id}
              className={`section-item ${isActive ? 'active' : ''}`}
              style={{
                '--section-color': color,
                left: `${left}%`,
                top: `${top}%`,
              }}
              onClick={() => handleSectionClick(section, index)}
            >
              {/* Иконка секции с первой буквой названия */}
              <div className="section-icon">
                <div className="icon-glow"></div>
                <div className="icon-symbol">{getFirstLetter(section.title)}</div>
              </div>
              
              {/* Текст секции с рамкой */}
              <div className="section-text">
                <span className="section-title">{section.title}</span>
                
                {/* Анимированные линии рамки */}
                <div className="frame-line top"></div>
                <div className="frame-line bottom"></div>
                <div className="frame-line left"></div>
                <div className="frame-line right"></div>
              </div>
              
              {/* Соединительная линия к центру */}
              <div className="section-connection"></div>
            </div>
          );
        })}
      </div>

      {/* Плавающие огненные частицы */}
      <div className="fire-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="fire-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Monolith;
