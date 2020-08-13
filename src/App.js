import React from "react";
import "./App.css";
import Pathfinder from "./PathfinderVisualization/Pathfinder";

/*
  Big thanks to Clement Mihailescu, who inspired me to do this project!

  His youtube channel can be found here: https://www.youtube.com/channel/UCaO6VoaYJv4kS-TQO_M-N_g
*/

//        <h1 className="Header">Pathfinding Visualized</h1>

function App() {
  return (
    <div className="app">
      <Pathfinder />
    </div>
  );
}

export default App;
