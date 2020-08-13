import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../Algos/Dijkstra";
import { aStar } from "../Algos/AStar";
import { BFS } from "../Algos/BreadthFirstSearch";
import { DFS } from "../Algos/DepthFirstSearch";
import { GBFS } from "../Algos/GreedyBestFirstSearch";

import "./Pathfinder.css";

let START_NODE_ROW = 10;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 45;

let mouseIsPressed = false;

// 0 = regular node, 1 = wall
let nodeBeforeEnter = -1;

let GRID_WIDTH = 20;
let GRID_LENGTH = 50;

export default class Pathfinder extends Component {
  // last algo: 0= A*, 1 = Greedy, 2= Dijkstra, 3=Breadth, 4 = Depth
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridClear: true,
      beingUsed: false,
      finishNodeMove: false,
      startNodeMove: false,
      finishNodeMove: false,
      lastAlgo: -1,
      algorithms: [
        "A* Algorithm",
        "Greedy Best-First Search",
        "Dijkstra's Algorithm",
        "Breadth First Search",
        "Depth First Search",
      ],
      currentAlgo: "A* Algorithm",
      speed: ["Slow", "Normal", "Fast"],
      currentSpeed: "Normal",
      speedValue: [40, 6, 4],
      speedIndex: 1,
    };
  }

  // set the grid and also set up a mouseUp listener
  componentDidMount() {
    let windowWidth = window.screen.width;
    let windowHeight = window.screen.height;
    GRID_LENGTH = Math.ceil((windowWidth - 50) / 25);
    GRID_WIDTH = Math.ceil((windowHeight - 300) / 25);
    START_NODE_ROW = Math.floor(GRID_WIDTH / 2);
    FINISH_NODE_ROW = Math.floor(GRID_WIDTH / 2);
    START_NODE_COL = Math.floor(GRID_LENGTH / 4);
    FINISH_NODE_COL = Math.floor(GRID_LENGTH * (4 / 5));
    const gridDrawn = this.formulateGrid();
    this.setState({
      grid: gridDrawn,
    });
    window.addEventListener("mouseup", this.onMouseUp);
  }

  // detach mouseUp listener
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onMouseUp);
  }

  // set mouseIsPressed to false
  onMouseUp = () => {
    mouseIsPressed = false;
  };

  // if mouse enters the boundary of any node
  handleMouseEnter = (row, col) => {
    // use this to take the state of the node back to what it was
    if (this.state.grid[row][col].isWall) {
      nodeBeforeEnter = 1;
    } else {
      nodeBeforeEnter = 0;
    }
    // if dragging to make walls
    if (
      !this.state.grid[row][col].isFinish &&
      !this.state.grid[row][col].isStart &&
      mouseIsPressed &&
      !this.state.startNodeMove &&
      !this.state.finishNodeMove
    ) {
      if (!this.state.grid[row][col].isWall) {
        // turn the nodes into wall nodes
        this.state.grid[row][col].isWall = true;
        this.state.grid[row][col].isVisited = false;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-wall";
      } else {
        // turn the wall nodes back into regular nodes
        this.state.grid[row][col].isWall = false;
        this.state.grid[row][col].isVisited = false;
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
    } else if (
      this.state.startNodeMove &&
      !this.state.grid[row][col].isFinish
    ) {
      // if the start node is being dragged, set the nodes in the array accordingly and then
      // set the row and column of where the start node is
      this.state.grid[row][col].isStart = true;
      this.state.grid[row][col].isWall = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-start";
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (
      this.state.finishNodeMove &&
      !this.state.grid[row][col].isStart
    ) {
      // if the finish node is moving, do the same thing as described above
      this.state.grid[row][col].isFinish = true;
      this.state.grid[row][col].isWall = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-finish";
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    }
  };

  // when the mouse leaves a certain node
  handleMouseOut = (row, col) => {
    // if the start node is moving
    if (this.state.startNodeMove && !this.state.grid[row][col].isFinish) {
      // set this node back into a regular node
      this.state.grid[row][col].isStart = false;
      this.state.grid[row][col].isFinish = false;
      this.state.grid[row][col].isWall = false;
      this.state.grid[row][col].isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    } else if (
      this.state.finishNodeMove &&
      !this.state.grid[row][col].isStart
    ) {
      // if finish node has moved out of this node, put node back into regular node
      this.state.grid[row][col].isStart = false;
      this.state.grid[row][col].isFinish = false;
      this.state.grid[row][col].isWall = false;
      this.state.grid[row][col].isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    }
    if (
      nodeBeforeEnter === 1 &&
      (this.state.startNodeMove || this.state.finishNodeMove)
    ) {
      // if the node was orinally a wall before the start/end node moved into it, set it
      // back to a wall
      this.state.grid[row][col].isWall = true;
      this.state.grid[row][col].isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
    }
  };

  handleMouseDown = (row, col) => {
    // set the state of a particular node based on its current status of
    // being a wall node or regular node
    if (
      !this.state.grid[row][col].isFinish &&
      !this.state.grid[row][col].isStart &&
      !this.state.grid[row][col].isWall
    ) {
      // turn the node into a wall node and indicate that the mouse is currently being pressed
      mouseIsPressed = true;
      this.state.grid[row][col].isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
      this.state.grid[row][col].isWall = true;
    } else if (
      !this.state.grid[row][col].isFinish &&
      !this.state.grid[row][col].isStart &&
      this.state.grid[row][col].isWall
    ) {
      // turn the node back into a regular node and indicate that the mouse is being pressed
      mouseIsPressed = true;
      this.state.grid[row][col].isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
      this.state.grid[row][col].isWall = false;
    } else if (this.state.grid[row][col].isStart) {
      // if the user is pressed on the start node, indicate that the start node is moving
      this.setState({
        startNodeMove: true,
      });
    } else if (this.state.grid[row][col].isFinish) {
      // if the user is pressed on the finish  node, indicate that the finish node is moving
      this.setState({
        finishNodeMove: true,
      });
    }
  };

  handleMouseUp = (row, col) => {
    // if the mouse is released

    // the start and finish node are not being moved
    this.setState({
      startNodeMove: false,
      finishNodeMove: false,
    });
    // if the end node is not the start or finish node
    if (
      !this.state.grid[row][col].isStart &&
      !this.state.grid[row][col].isFinish
    ) {
      if (this.state.startNodeMove) {
        // set the previous start node into a regular node
        this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = false;
        document.getElementById(
          `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node";

        // update start node
        this.state.grid[row][col].isStart = true;
        this.state.grid[row][col].isVisited = false;
        this.state.grid[row][col].isWall = false;
        // update the position of the start node
        START_NODE_ROW = row;
        START_NODE_COL = col;
      } else if (this.state.finishNodeMove) {
        // do the same thing as done for start node above
        this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
        document.getElementById(
          `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node";

        this.state.grid[row][col].isFinish = true;
        this.state.grid[row][col].isVisited = false;
        this.state.grid[row][col].isWall = false;

        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
      }
    }
    // if the start or end node is moving, update accoridingly
    if (this.state.startNodeMove) {
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (this.state.finishNodeMove) {
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    }

    // if the finish node is on top of the start node
    if (
      START_NODE_COL === FINISH_NODE_COL &&
      START_NODE_ROW === FINISH_NODE_ROW
    ) {
      // reset the nodes to their original positions
      this.state.grid[row][col].isFinish = false;
      this.state.grid[row][col].isVisited = false;
      this.state.grid[row][col].isStart = false;
      this.state.grid[row][col].isWall = false;
      document.getElementById(`node-${row}-${col}`).className = "node";

      START_NODE_ROW = 10;
      START_NODE_COL = 10;
      FINISH_NODE_ROW = 10;
      FINISH_NODE_COL = 45;

      this.state.grid[START_NODE_ROW][START_NODE_COL].isWall = false;
      this.state.grid[START_NODE_ROW][START_NODE_COL].isVisited = false;
      this.state.grid[START_NODE_ROW][START_NODE_COL].isFinish = false;
      this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = true;
      document.getElementById(
        `node-${START_NODE_ROW}-${START_NODE_COL}`
      ).className = "node node-start";

      this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isWall = false;
      this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isVisited = false;
      this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = true;
      this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isStart = false;
      document.getElementById(
        `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
      ).className = "node node-finish";
    }
    mouseIsPressed = false;
  };

  // visualize depth first search algo
  visualizeDepthFirstSearch = () => {
    // only execute if the stat and end node are not moving
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      // if the grid is not clear, clear the grid
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 4,
      });
      // disable all elements when visualizing
      this.disableElements();
      // get the start node
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      // get the path returned
      let path = DFS(this.state.grid, startNode, GRID_LENGTH, GRID_WIDTH);
      // visualize the path
      if (path.shortest === null) {
        this.displayAlgoNoPath(path.visited);
      } else {
        this.displayAlgo(path.visited, path.shortest);
      }
    }
  };

  // visualize the greedy best first search algo
  visualizeGreedyBestFirstSearch = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 1,
      });
      this.disableElements();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = GBFS(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_WIDTH,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    }
  };

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 3,
      });
      this.disableElements();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = BFS(this.state.grid, startNode, GRID_LENGTH, GRID_WIDTH);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    }
  };

  // visualize A* algo
  visualizeAStar = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 0,
      });
      this.disableElements();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = aStar(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_WIDTH,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    }
  };

  // visualize Dijkstra's algo
  visualizeDijkstra = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 2,
      });
      this.disableElements();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = dijkstra(this.state.grid, startNode, GRID_LENGTH, GRID_WIDTH);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    }
  };

  // if there is no path found, just display the path visited
  displayAlgoNoPath(nodes) {
    // grid is no longer clear
    this.setState({
      gridClear: false,
    });
    for (let i = 0; i <= nodes.length; i++) {
      if (i === nodes.length) {
        setTimeout(() => {
          // enable all the elements again
          this.enableElements();
        }, this.state.speedValue[this.state.speedIndex] * i);
      } else {
        setTimeout(() => {
          // update the grid
          const node = nodes[i];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited disabledNode";
          }
        }, this.state.speedValue[this.state.speedIndex] * i);
      }
    }
  }

  // visualize the path found
  displayAlgo(nodes, shortestPath) {
    for (let i = 0; i <= nodes.length; i++) {
      if (i === nodes.length) {
        // if the other elements are done updating, show the shortest path
        setTimeout(() => {
          this.visualizeShortestPath(shortestPath);
        }, this.state.speedValue[this.state.speedIndex] * i);
      } else {
        setTimeout(() => {
          const node = nodes[i];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited disabledNode";
          }
        }, this.state.speedValue[this.state.speedIndex] * i);
      }
    }
  }

  // show the shortest path
  visualizeShortestPath(shortestPath) {
    this.setState({
      gridClear: false,
    });
    for (let j = 0; j <= shortestPath.length; j++) {
      if (j === shortestPath.length) {
        setTimeout(() => {
          this.enableElements();
        }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
      } else {
        setTimeout(() => {
          const node = shortestPath[j];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-final-path disabledNode";
          }
        }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
      }
    }
  }

  // clear the grid of all path nodes
  clearPath = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      this.setState({
        gridClear: true,
        lastAlgo: -1,
      });
      nodeBeforeEnter = -1;
      for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_LENGTH; j++) {
          if (i === START_NODE_ROW && j === START_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-start";
            this.state.grid[i][j].distance = Infinity;
            this.state.grid[i][j].isVisited = false;
            this.state.grid[i][j].isWall = false;
            this.state.grid[i][j].previousNode = null;
          } else if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-finish";
            this.state.grid[i][j].distance = Infinity;
            this.state.grid[i][j].isVisited = false;
            this.state.grid[i][j].isWall = false;
            this.state.grid[i][j].previousNode = null;
          } else if (
            this.state.grid[i][j].isVisited &&
            !this.state.grid[i][j].isFinish
          ) {
            document.getElementById(`node-${i}-${j}`).className = "node";
            this.state.grid[i][j].distance = Infinity;
            this.state.grid[i][j].isVisited = false;
            this.state.grid[i][j].isWall = false;
            this.state.grid[i][j].previousNode = null;
          }
        }
      }
    }
  };

  updateCurrentAlgo = (event) => {
    this.setState({
      currentAlgo: event.target.value,
    });
  };

  // clear the grid of all wall and path nodes
  clearGrid = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      this.setState({
        gridClear: true,
        lastAlgo: -1,
      });
      nodeBeforeEnter = -1;
      for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_LENGTH; j++) {
          if (i === START_NODE_ROW && j === START_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-start";
          } else if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-finish";
          } else {
            document.getElementById(`node-${i}-${j}`).className = "node";
          }
          this.state.grid[i][j].distance = Infinity;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isWall = false;
          this.state.grid[i][j].previousNode = null;
        }
      }
    }
  };

  startAlgorithm = () => {
    let algo = this.state.currentAlgo;
    if (algo === "A* Algorithm") {
      this.visualizeAStar();
    } else if (algo === "Greedy Best-First Search") {
      this.visualizeGreedyBestFirstSearch();
    } else if (algo === "Dijkstra's Algorithm") {
      this.visualizeDijkstra();
    } else if (algo === "Breadth First Search") {
      this.visualizeBreadthFirstSearch();
    } else if (algo === "Depth First Search") {
      this.visualizeDepthFirstSearch();
    }
  };

  updateSpeed = (event) => {
    let speed = event.target.value;
    if (speed === "Slow") {
      this.setState({
        speedIndex: 0,
        currentSpeed: "Slow",
      });
    } else if (speed === "Normal") {
      this.setState({
        speedIndex: 1,
        currentSpeed: "Normal",
      });
    } else if (speed === "Fast") {
      this.setState({
        speedIndex: 2,
        currentSpeed: "Fast",
      });
    }
  };

  render() {
    return (
      <>
        <div className="button-container">
          <text className="header">Pathfinding Visualized</text>
          <div className="buttons">
            <select
              className="dropDown"
              value={this.state.currentAlgo}
              onChange={this.updateCurrentAlgo}
            >
              {this.state.algorithms.map((algorithms) => (
                <option key={algorithms} value={algorithms}>
                  {algorithms}
                </option>
              ))}
            </select>
            <select
              className="dropDown"
              value={this.state.currentSpeed}
              onChange={this.updateSpeed}
            >
              {this.state.speed.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}
                </option>
              ))}
            </select>
            <button
              className="button"
              id="start-algorithm"
              onClick={this.startAlgorithm}
            >
              Start Algorithm
            </button>
            <button
              id="ClearGrid"
              className="button button-clear buttonClear"
              onClick={this.clearGrid}
            >
              Clear Grid
            </button>
            <button
              id="ClearGrid"
              className="button button-reset"
              onClick={this.clearGrid}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="gridAndLegend">
          <div className="legend">
            <div className="fakeNode fakeNodeStart firstFakeNode"></div>
            <label className="fakeNodeLabel">Start Node</label>
            <div className="fakeNode fakeNodeEnd"></div>
            <label className="fakeNodeLabel">End Node</label>
            <div className="fakeNode fakeNodeBlock"></div>
            <label className="fakeNodeLabel">Wall Node</label>
            <div className="fakeNode"></div>
            <label className="fakeNodeLabel">Unvisted Node</label>
            <div className="fakeNode fakeNodeExploredFirst"></div>
            <div className="fakeNode fakeNodeExploredSecond"></div>
            <label className="fakeNodeLabel">Explored Node</label>
            <div className="fakeNode fakeNodeShortestPath"></div>
            <label className="fakeNodeLabel">Path Found Node</label>
          </div>

          <div id="gridNodes" className="grid">
            {this.state.grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                        onMouseOut={(row, col) => this.handleMouseOut(row, col)}
                        row={row}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
  // disable user interaction
  disableElements() {
    document
      .getElementById(`start-algorithm`)
      .setAttribute("disabled", "disabled");
    document.getElementById(`ClearGrid`).setAttribute("disabled", "disabled");
    for (let i = 0; i < GRID_WIDTH; i++) {
      for (let j = 0; j < GRID_LENGTH; j++) {
        document.getElementById(`node-${i}-${j}`).classList.add("disabledNode");
      }
    }
  }

  // enable user interaction
  enableElements() {
    document.getElementById(`start-algorithm`).removeAttribute("disabled");
    document.getElementById(`ClearGrid`).removeAttribute("disabled");
    for (let i = 0; i < GRID_WIDTH; i++) {
      for (let j = 0; j < GRID_LENGTH; j++) {
        document
          .getElementById(`node-${i}-${j}`)
          .classList.remove("disabledNode");
      }
    }
  }

  // generate the beginning grid
  formulateGrid = () => {
    // draw a grid onto the screen
    const nodes = [];
    for (let i = 0; i < GRID_WIDTH; i++) {
      const row = [];
      for (let j = 0; j < GRID_LENGTH; j++) {
        row.push(this.createNode(j, i));
      }
      nodes.push(row);
    }
    return nodes;
  };

  // create a node
  createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
}
