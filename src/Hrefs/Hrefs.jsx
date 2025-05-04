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
    { id: 7, word: "Тема"  },
    { id: 8, word: "Сибиряк"  }
  ];

  const rightColumnData = [
    { id: 9, word: "Похерист"  },
    { id: 10, word: "Похераст"  },
    { id: 11, word: "Похерон"  },
    { id: 12, word: "Похерун"  },
    { id: 13, word: "Похесрун"  },
    { id: 14, word: "Похерок"  },
    { id: 15, word: "Похерец"  },
    { id: 16, word: "ЛЮБИМЫЙ"  }
  ];
  
  const middle18ColumnData = [
    { id: 17, word: "1/8"  },
    { id: 18, word: "1/8"  },
    { id: 19, word: "1/8"  },
    { id: 20, word: "1/8"  },
  ];
  const middle14ColumnData = [
    { id: 21, word: "1/4"  },
    { id: 22, word: "1/4"  },
  ];
  const middle12ColumnData = [
    { id: 23, word: "1/2"  },
  ];
  const winnerData = [
    { id: 24, word: "200  сфер"  },
  ];
  
  return (
    <div className="animated-table-container">
      <span>Правила проведения внутригильдейского турнира: ...  </span>
      <span>Тут же будет ссылька на видео жеребьевки участников ...  </span>
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

                   {/*   1/8 */}
        <div className="table-column first-column">
          {middle18ColumnData.map((item) => (
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
 {/*   1/4 */}
        <div className="table-column first-column">
          {middle14ColumnData.map((item) => (
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
 {/*   1/2 */}
 <div className="table-column first-column">
          {middle12ColumnData.map((item) => (
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


        <div className="table-column first-column">
          {winnerData.map((item) => (
             <div key={item.id} className="table-cell final">
                <img className="img4emp" src='4emp.png' style={{width:130}}/>
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


 {/*   1/2 */}
 <div className="table-column first-column">
          {middle12ColumnData.map((item) => (
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

         {/*   1/4 */}
         <div className="table-column first-column">
          {middle14ColumnData.map((item) => (
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


                  {/*   1/8 */}
                  <div className="table-column first-column">
          {middle18ColumnData.map((item) => (
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
