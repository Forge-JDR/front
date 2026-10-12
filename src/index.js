import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource/dm-serif-display';

import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';
import './styles/design-system.css';
import {store} from './store/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();