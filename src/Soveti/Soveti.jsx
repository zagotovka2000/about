import React, { useState } from 'react';
import './Soveti.css';

const Soveti = () => {
  const [expandedRows, setExpandedRows] = useState({});

  // Данные строк таблицы
  const tableData = [
    {
      id: 1,
      team: 'Аль ЛаК Ясм Три Лир Гал',
      patronage: 'Век Аль Фен Бис Оли',
      bossLevel: '150',
      bossType: 'Ош',
      equipment: '17 000 000 - 47 000 000',
      videoUrl: 'https://drive.google.com/file/d/1FRislg3jtU0XF3emNBmy5InnFEGUG2mA/view?usp=sharing',
      description: 'Пет для каждого героя не обязательно как тут'
    },
    {
      id: 2,
      team: 'Аль Баб Крн Себ Неб Айз',
      patronage: '### Акс Аль Каи Оли',
      bossLevel: '160',
      bossType: 'Ош',
      equipment: '9 000 000 - 1 235 000 000',
      videoUrl: 'https://drive.google.com/file/d/195Z4w1NBWC1PXfMzlb-DgT9Bgq_Smkd4/view?usp=sharing',
      description: 'Нэт описания по классике',
      asgradImages: [
        'ayz_art.jpg',
        'ayz_obliki.jpg',
        'krn_art.jpg',
      ]
    },
  ];

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Функция для рендера команды с картинками
  const renderTeamWithPatronage = (teamString, patronageString) => {
    const heroes = teamString.split(' ');
    const patrons = patronageString.split(' ');
    
    // Создаем массив пар [герой, патронаж] для 6 позиций
    const patronMapping = [];
    for (let i = 0; i < heroes.length; i++) {
      if (i === 0) {
        patronMapping.push({ hero: heroes[i], patron: null, isMainPet: true });
      } else {
        const patronIndex = i - 1;
        if (patronIndex < patrons.length) {
          const patron = patrons[patronIndex];
          patronMapping.push({ 
            hero: heroes[i], 
            patron: patron === '###' ? null : patron, 
            isEmpty: patron === '###' 
          });
        } else {
          patronMapping.push({ hero: heroes[i], patron: null, isEmpty: false });
        }
      }
    }
  
    return (
      <div className="soveti-team-with-patronage">
        {patronMapping.map((item, idx) => (
          <div key={idx} className={`soveti-hero-container ${item.isMainPet ? 'main-pet' : ''}`}>
            <img 
              src={`/images/heroes/${item.hero}.png`}
              alt={item.hero}
              className="soveti-hero-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {item.patron ? (
              <div className="soveti-patronage-wrapper">
                <img 
                  src={`/images/heroes/${item.patron}.png`}
                  alt={item.patron}
                  className="soveti-patronage-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : item.isEmpty ? (
              <div className="soveti-empty-patron"></div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  // Функция для рендера галереи картинок Asgrad
  const renderAsgradGallery = (images) => {
    if (!images || images.length === 0) return null;
    
    return (
      <div className="soveti-asgrad-gallery">
        <div className="soveti-gallery-grid">
          {images.map((image, index) => (
            <div key={index} className="soveti-gallery-item">
              <img 
                src={`/asgrad/${image}`}
                alt={`Асгард ${index + 1}`}
                className="soveti-gallery-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="soveti-image-error">❌</div>';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="soveti-container">
      <div className="soveti-header">
        <p className="soveti-abzac">
          Слизываем советы по прокачке конкретных персов под асгард и пачки, добытые многотысячными тестами. Не забываем также сами искать новые варианты с нестандартными комбинациями. Кто найдет, тому ничего за это не будет.
        </p>
      </div>

      <div className="soveti-table" role="table">
        {/* Заголовок таблицы - теперь 5 колонок + иконка */}
        <div className="soveti-table-header" role="rowgroup">
          <div className="soveti-header-cell team-cell" role="columnheader">Калеки</div>
          <div className="soveti-header-cell boss-cell" role="columnheader">Ур. босса</div>
          <div className="soveti-header-cell boss-cell" role="columnheader">Вид босса</div>
          <div className="soveti-header-cell equip-cell" role="columnheader">Урон на авто</div>
          <div className="soveti-header-cell video-cell" role="columnheader">Видос</div>
          <div className="soveti-header-cell expand-cell" role="columnheader"></div>
        </div>

        {/* Строки таблицы */}
        {tableData.map((row) => (
          <React.Fragment key={row.id}>
            <div 
              className={`soveti-table-row ${expandedRows[row.id] ? 'expanded' : ''}`}
              onClick={() => toggleRow(row.id)}
              role="row"
            >
              <div className="soveti-table-cell team-cell" role="cell">
                {renderTeamWithPatronage(row.team, row.patronage)}
              </div>
              <div className="soveti-table-cell boss-cell" role="cell">
                {row.bossLevel}
              </div>
              <div className="soveti-table-cell boss-cell" role="cell">
                {row.bossType}
              </div>
              <div className="soveti-table-cell equip-cell" role="cell">
                {row.equipment}
              </div>
              <div className="soveti-table-cell video-cell" role="cell">
                {row.videoUrl && (
                  <a 
                    href={row.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="soveti-video-link"
                  >
                    Смотреть
                  </a>
                )}
              </div>
              <div className="soveti-expand-icon">
                {expandedRows[row.id] ? '▲' : '▼'}
              </div>
            </div>

            {/* Раскрывающаяся панель с описанием и галереей */}
            {expandedRows[row.id] && (
              <div className="soveti-expanded-content" onClick={(e) => e.stopPropagation()}>
                <div className="soveti-description">
                  <h4>Нюансы:</h4>
                  <p>{row.description}</p>
                </div>
                
                {/* Галерея картинок для строки с id 2 */}
                {row.asgradImages && renderAsgradGallery(row.asgradImages)}
                
                {row.videoUrl && (
                  <div className="soveti-video-preview">
                    <h4>Видео боя:</h4>
                    <a 
                      href={row.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="soveti-video-button"
                    >
                      ▶ Открыть
                    </a>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Soveti;
