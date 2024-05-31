import './App.css';

import React from 'react';
import { Router } from './routes/router.jsx';

function App() {
  return (
      <div className="App">
        <Router id="root"></Router> 
      </div>
  );
}

export default App;