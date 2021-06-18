import React from "react";
import "./Legend.css";

const Legend = () => {
  return (
    <div className="container">
      <div className="container-and-label">
        <div className="fake-node fake-node-start-color"></div>
        <div>Start Node</div>
      </div>
      <div className="container-and-label">
        <div className="fake-node fake-node-end-color"></div>
        <div>End Node</div>
      </div>
      <div className="container-and-label">
        <div className="fake-node fake-node-wall-color"></div>
        <div>Wall Node</div>
      </div>
      <div className="container-and-label">
        <div className="fake-node"></div>
        <div>Unvisted Node</div>
      </div>
      <div className="container-and-label">
        <div className="fake-node fake-node-explored-first-color"></div>
        <div>Explored Node</div>
      </div>
      <div className="container-and-label">
        <div className="fake-node fake-node-neighbor"></div>
        <div>Neighbor Node</div>
      </div>
      <div className="container-and-label last-container">
        <div className="fake-node fake-node-shortest-path-color"></div>
        <div>Path Found Node</div>
      </div>
    </div>
  );
};

export default Legend;
