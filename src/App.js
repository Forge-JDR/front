import './App.css';
import React from 'react';
import { Router } from './routes/router.jsx';
import refreshTokenInterceptor from "./config/refreshTokenInterceptor.js";
import { store } from "./store/store.js";

refreshTokenInterceptor(store);

function App() {
  return <Router></Router>;
}

export default App;
