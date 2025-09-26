import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; 
//aqui digo para o react renderizar a aplicacao dentro do elemento root do index.html

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);