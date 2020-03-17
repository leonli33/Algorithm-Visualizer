import React from 'react';
import './App.css';
import Pathfinder from './PathfinderVisualization/Pathfinder';

/*
  Big thanks to Clement Mihailescu, who inspired me to do this project!

  His youtube channel can be found here: https://www.youtube.com/channel/UCaO6VoaYJv4kS-TQO_M-N_g
*/

function App() {
  return (
    <div className="App Background" >
        <h1 className="Header">Pathfinding Visualized</h1>
        <div className="Grid">
          <Pathfinder></Pathfinder>
        </div>
    </div>
  );
}

export default App;
