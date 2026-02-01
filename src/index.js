import React from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import App from './App';

// Заменяем createRoot на старый метод render
ReactDOM.render(
    <App />,
  document.getElementById('root')
);
