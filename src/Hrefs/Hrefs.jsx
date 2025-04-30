import React from "react";
import "./hrefs.css";

const Hrefs = () => {
  const leftColumnData = [
    { id: 1, word: "Ain Lerner"  },
    { id: 2, word: "Andrey"  },
    { id: 3, word: "Оди"  },
    { id: 4, word: "Пунь Пунь"  },
    { id: 5, word: "ВАНО"  },
    { id: 6, word: "Наташа"  },
    { id: 7, word: "Игрок 7"  },
    { id: 8, word: "Игрок 8"  }
  ];

  const rightColumnData = [
    { id: 9, word: "Игрок 9"  },
    { id: 10, word: "Игрок 10"  },
    { id: 11, word: "Игрок 11"  },
    { id: 12, word: "Игрок 12"  },
    { id: 13, word: "Игрок 13"  },
    { id: 14, word: "Игрок 14"  },
    { id: 15, word: "Игрок 15"  },
    { id: 16, word: "Игрок 16"  }
  ];

  return (
    <div className="animated-table-container">
      <span>Начну хоть делать пока турнирную таблицу</span>
      <div className="animated-table">
        {/* Первая колонка с 8 элементами */}
        <div className="table-column first-column">
          {leftColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>

        {/* 6 пустых колонок */}
        {[...Array(6)].map((_, colIndex) => (
          <div key={`empty-${colIndex}`} className="table-column empty-column">
            {[...Array(8)].map((_, rowIndex) => (
              <div key={`empty-${colIndex}-${rowIndex}`} className="table-cell empty-cell">
                {/* Пустая ячейка */}
              </div>
            ))}
          </div>
        ))}

        {/* Последняя колонка с 8 элементами */}
        <div className="table-column last-column">
          {rightColumnData.map((item) => (
            <div key={item.id} className="table-cell">
              <div className="cell-content">
                <div >
                  {item.word.split("").map((letter, index) => (
                    <span 
                      key={index} 
                      className="letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {/* <div className="cell-avatar">{item.avatar}</div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hrefs;
