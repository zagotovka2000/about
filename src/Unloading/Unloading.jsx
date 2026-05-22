import React, { useState, useEffect } from 'react';
import './Unloading.css';

const Unloading = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загружаем манифест (список файлов) из папки public/unloading
    fetch('/unloading/manifest.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка загрузки манифеста: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Ожидаем, что data — это массив строк { "files": ["file1.txt", "file2.txt"] }
        const fileList = Array.isArray(data) ? data : data.files || [];
        
        // Группируем файлы по названию гильдии (часть до первого пробела)
        const groupMap = new Map();
        
        fileList.forEach(fileName => {
          // Извлекаем название гильдии (всё до первого пробела)
          const firstSpaceIndex = fileName.indexOf(' ');
          if (firstSpaceIndex === -1) return; // Пропускаем файлы с неправильным форматом
          
          const guildName = fileName.substring(0, firstSpaceIndex);
          
          // Определяем тип файла по подстроке
          let fileType = null;
          if (fileName.includes('все_бои')) {
            fileType = 'all';
          } else if (fileName.includes('победные_бои_герои')) {
            fileType = 'heroes';
          } else if (fileName.includes('победные_бои_титаны')) {
            fileType = 'titans';
          }
          
          if (!fileType) return; // Пропускаем неподходящие файлы
          
          // Добавляем или обновляем запись в Map
          if (!groupMap.has(guildName)) {
            groupMap.set(guildName, {
              guildName,
              all: null,
              heroes: null,
              titans: null,
              order: Infinity // Порядок по умолчанию
            });
          }
          
          const group = groupMap.get(guildName);
          group[fileType] = fileName;
          
          // Обновляем порядок, если текущий порядок меньше (раньше в манифесте)
          const currentOrder = fileList.indexOf(fileName);
          if (currentOrder < group.order) {
            group.order = currentOrder;
          }
        });
        
        // Преобразуем Map в массив и сортируем по порядку появления в манифесте
        const groupedArray = Array.from(groupMap.values())
          .sort((a, b) => a.order - b.order);
        
        setGroupedData(groupedArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить список файлов. Убедитесь, что файл manifest.json существует в папке /unloading');
        setLoading(false);
      });
  }, []);

  const handleDownload = (fileName) => {
    if (!fileName) return;
    // Формируем URL к файлу в папке public/unloading
    const fileUrl = `/unloading/${fileName}`;
    // Создаём временную ссылку и имитируем клик для скачивания
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="unloading-loading">Загрузка списка файлов...</div>;
  }

  if (error) {
    return <div className="unloading-error">{error}</div>;
  }

  if (groupedData.length === 0) {
    return <div className="unloading-empty">Нет доступных файлов для скачивания.</div>;
  }

  return (
    <div className="unloading-container">
      <h2 className="unloading-title">Выгрузка всякой хуйни с СМ</h2>
      
      <div className="unloading-table">
        {/* Шапка таблицы */}
        <div className="table-header">
          <div className="col-guild">Тип ебантропов</div>
          <div className="col-all">Все бои</div>
          <div className="col-heroes">Победные бои герои</div>
          <div className="col-titans">Победные бои титаны</div>
        </div>
        
        {/* Строки таблицы */}
        <div className="table-body">
          {groupedData.map((row, index) => (
            <div key={index} className="table-row">
              <div className="col-guild">
                <span className="guild-name">{row.guildName}</span>
              </div>
              <div className="col-all">
                {row.all ? (
                  <button
                    className="download-button"
                    onClick={() => handleDownload(row.all)}
                  >
                    Скачать
                  </button>
                ) : (
                  <span className="no-file">—</span>
                )}
              </div>
              <div className="col-heroes">
                {row.heroes ? (
                  <button
                    className="download-button"
                    onClick={() => handleDownload(row.heroes)}
                  >
                    Скачать
                  </button>
                ) : (
                  <span className="no-file">—</span>
                )}
              </div>
              <div className="col-titans">
                {row.titans ? (
                  <button
                    className="download-button"
                    onClick={() => handleDownload(row.titans)}
                  >
                    Скачать
                  </button>
                ) : (
                  <span className="no-file">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unloading;
