import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './custom.scss';
/* 
Including the report Web Vitals can provide information about performance of
the application.
import reportWebVitals from './reportWebVitals';
*/
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

/*
Including the report Web Vitals can provide information about performance of
the application.

reportWebVitals();
*/
