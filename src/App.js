import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pathfinder from './PathfinderVisualization/Pathfinder';

function App() {
  return (
    <div className="App Background" >
        <h1 className="Header">Pathfinding Visualized</h1>
        <Pathfinder></Pathfinder>
    </div>
  );
}

export default App;
