import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './themes/themes.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';
import './utils/global.css';
import {store} from './store/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();