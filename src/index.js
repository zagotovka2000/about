import React from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import App from './App';

// Заменяем createRoot на старый метод render
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
