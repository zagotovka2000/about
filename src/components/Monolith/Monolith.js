import React, { useEffect, useRef, useState } from 'react';
import './Monolith.css';

const Monolith = ({ sections, onSectionClick }) => {
  const containerRef = useRef(null);
  const crystalRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [crystalRotation, setCrystalRotation] = useState({ x: 0, y: 0 });
  const [letterAnimation, setLetterAnimation] = useState(0);

  // Параллакс
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!crystalRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5);
      const y = (clientY / innerHeight - 0.5);
      setCrystalRotation({
        x: y * 20,
        y: x * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Анимация букв
  useEffect(() => {
    let frame;
    let time = 0;
    const animate = () => {
      time += 0.02;
      setLetterAnimation(time);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const letters = ['М', 'О', 'Н', 'О', 'Л', 'И', 'Т'];

  const handleSectionClick = (section, index) => {
    setActiveSection(index);
    if (window.audioManager) window.audioManager.playClick?.();
    setTimeout(() => {
      onSectionClick(section);
      setActiveSection(null);
    }, 500);
  };

  return (
    <div className="monolith-container" ref={containerRef}>
      <div className="monolith-bg"></div>

      {/* SVG кривые линии (оставлены для красоты, но не влияют на позиции) */}
      <svg className="curves-svg" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        {sections.map((_, idx) => {
          const angle = (idx * Math.PI * 2) / sections.length - Math.PI / 2;
          const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
          const x = window.innerWidth / 2 + Math.cos(angle) * radius;
          const y = window.innerHeight / 2 + Math.sin(angle) * radius;
          return <line key={idx} x1={window.innerWidth/2} y1={window.innerHeight/2} x2={x} y2={y} stroke="rgba(255,100,0,0.4)" strokeWidth="2" strokeDasharray="4 4" />;
        })}
      </svg>

      {/* Центральный кристалл */}
      <div 
        ref={crystalRef}
        className="central-crystal"
        style={{
          transform: `translate(-50%, -50%) rotateX(${crystalRotation.x}deg) rotateY(${crystalRotation.y}deg)`
        }}
      >
        <div className="crystal-core">
          <div className="core-pulse"></div>
          <div className="core-light"></div>
          <div className="crystal-text-container">
            <div className="fire-glow" style={{ opacity: 0.3 + Math.sin(letterAnimation * 2) * 0.3 }}></div>
            <div className="crystal-text">
              {letters.map((letter, i) => (
                <span key={i} className="fire-letter" style={{ '--fire-intensity': 0.5 + Math.sin((letterAnimation + i * 0.1) * Math.PI * 2) * 0.5 }}>
                  {letter}
                </span>
              ))}
            </div>
            <div className="crystal-flag"><div className="flag-icon"></div></div>
          </div>
        </div>
        {[...Array(12)].map((_, i) => <div key={i} className="crystal-ray" style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * 0.1}s` }} />)}
        <div className="crystal-ring ring-1"></div><div className="crystal-ring ring-2"></div><div className="crystal-ring ring-3"></div>
        <div className="crystal-ring ring-4"></div><div className="crystal-ring ring-5"></div><div className="crystal-ring ring-6"></div>
        <div className="crystal-ring ring-7"></div><div className="crystal-ring ring-8"></div>
      </div>

      {/* Секции – исходная рабочая логика позиционирования */}
      <div className="sections-container">
        {sections.map((section, index) => {
          const isActive = activeSection === index;
          const angle = (index * Math.PI * 2) / sections.length - Math.PI / 2;
          const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
          const left = 50 + Math.cos(angle) * (radius / window.innerWidth * 100);
          const top = 50 + Math.sin(angle) * (radius / window.innerHeight * 100);
          
          return (
            <div
              key={section.id}
              className={`section-item ${isActive ? 'active' : ''}`}
              style={{
                '--section-color': `var(--color-${index % 6})`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              onClick={() => handleSectionClick(section, index)}
            >
              <div className="section-icon">
                <div className="icon-glow"></div>
                <div className="section-title-full">{section.title}</div>
              </div>
              {/* Рамка – абсолютно позиционирована, не влияет на положение */}
              <div className="frame-vertical left"></div>
              <div className="frame-vertical right"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Monolith;
