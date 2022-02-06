import React from 'react';
import './App.css';
import WordleGame from './Components/WordleGame';

function App() {
  return (
    <div style={{display:'flex', justifyContent:'center' }}>
      <WordleGame />
    </div>
  );
}

export default App;