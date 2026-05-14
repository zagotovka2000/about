import React, { useState, useEffect } from 'react';
import './Unloading.css';

const Unloading = () => {
  const [files, setFiles] = useState([]);
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
        setFiles(fileList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить список файлов. Убедитесь, что файл manifest.json существует в папке /unloading');
        setLoading(false);
      });
  }, []);

  const handleDownload = (fileName) => {
    // Формируем URL к файлу в папке public/unloading
    const fileUrl = `/unloading/${fileName}`;
    // Создаём временную ссылку и имитируем клик для скачивания
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName; // атрибут download подсказывает браузеру скачать файл
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

  if (files.length === 0) {
    return <div className="unloading-empty">Нет доступных файлов для скачивания.</div>;
  }

  return (
    <div className="unloading-container">
      <h2 className="unloading-title">Выгрузка всякой хуйни с СМ</h2>
      <ul className="unloading-list">
        {files.map((fileName, index) => (
          <li key={index} className="unloading-item">
            <span className="file-name">{fileName}</span>
            <button
              className="download-button"
              onClick={() => handleDownload(fileName)}
            >
              Скачать
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Unloading;
