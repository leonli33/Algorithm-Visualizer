import React, { Component } from "react";
import "./Node.css";
export default class Pathfinder extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseOut,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      nodeWidth,
    } = this.props;

    let extraClassName = "";
    if (isFinish) {
      extraClassName = "node-finish";
    } else if (isStart) {
      extraClassName = "node-start";
    } else if (isWall) {
      extraClassName = "node-wall";
    }
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseOut={() => onMouseOut(row, col)}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        style={{ width: nodeWidth }}
      />
    );
  }
}
