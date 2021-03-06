import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../Algos/Dijkstra";
import { aStar } from "../Algos/AStar";
import { BFS } from "../Algos/BreadthFirstSearch";
import { DFS } from "../Algos/DepthFirstSearch";
import { GBFS } from "../Algos/GreedyBestFirstSearch";
import { RandomMaze } from "../Maze/RandomMaze";
import { VerticalWalls } from "../Maze/VerticalWalls";
import { HorizontalWalls } from "../Maze/HorizontalWalls";
import "./Pathfinder.css";

/*
  DISCLAIMER: 
    In the following application, I had to modify the state without using setState at times. This is because when the user is
    dragging to make walls or running an algorithm, the component (the grid) would need to be rerendered so many times that it caused the application
    to lag. The only way to avoid this lag was to change the state without causing the whole component to rerender. I know this is not the best practice
    but I tried to use state correctly wherever I could.
*/

let START_NODE_ROW = 10;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 45;

let mouseIsPressed = false;

// 0 = regular node, 1 = wall
let nodeBeforeEnter = -1;

let GRID_HEIGHT = 20;
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
      currentAlgo: "Algorithms",
      speed: ["Slow", "Normal", "Fast"],
      currentSpeed: "Speed",
      speedValue: [100, 6, 4],
      speedIndex: 1,
      mazeAlgorithms: ["Random Walls", "Vertical Walls", "Horizontal Walls"],
      mazeLabel: "Generate Maze",
      startButtonPhrase: "Choose Algorithm",
      gridBeingUsed: false,
    };
  }

  // set the grid and also set up a mouseUp listener
  componentDidMount() {
    let windowWidth = window.screen.width;
    let windowHeight = window.screen.height;
    GRID_HEIGHT = Math.ceil((windowHeight - 250) / 25);
    GRID_LENGTH = Math.ceil((windowWidth - 50) / 25);
    START_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
    FINISH_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
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

  // set mouseIsPressed to false, needed to on mouse up listeners because
  // there was a bug with the one put on the node
  onMouseUp = () => {
    mouseIsPressed = false;
  };

  // if mouse enters the boundary of any node
  handleMouseEnter = (row, col) => {
    let node = this.state.grid[row][col];
    // use this to take the state of the node back to what it was
    if (node.isWall) {
      nodeBeforeEnter = 1;
    } else {
      nodeBeforeEnter = 0;
    }
    // if dragging to make walls
    if (
      !node.isFinish &&
      !node.isStart &&
      mouseIsPressed &&
      !this.state.startNodeMove &&
      !this.state.finishNodeMove
    ) {
      if (!node.isWall) {
        // turn the nodes into wall nodes
        node.isWall = true;
        node.isVisited = false;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-wall";
      } else {
        // turn the wall nodes back into regular node
        node.isWall = false;
        node.isVisited = false;
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
    } else if (this.state.startNodeMove && !node.isFinish) {
      // if the start node is being dragged, set the nodes in the array accordingly and then
      // set the row and column of where the start node is
      node.isStart = true;
      node.isWall = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-start";
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (this.state.finishNodeMove && !node.isStart) {
      // if the finish node is moving, do the same thing as described above
      node.isFinish = true;
      node.isWall = false;
      node.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-finish";
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      this.startAlgorithm(false);
    }
  };

  // when the mouse leaves a certain node
  handleMouseOut = (row, col) => {
    let currentNode = this.state.grid[row][col];
    // if the start node is moving
    if (this.state.startNodeMove && !currentNode.isFinish) {
      // set this node back into a regular node
      currentNode.isStart = false;
      currentNode.isFinish = false;
      currentNode.isWall = false;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    } else if (this.state.finishNodeMove && !currentNode.isStart) {
      // if finish node has moved out of this node, put node back into regular node
      currentNode.isStart = false;
      currentNode.isFinish = false;
      currentNode.isWall = false;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    }
    if (
      nodeBeforeEnter === 1 &&
      (this.state.startNodeMove || this.state.finishNodeMove)
    ) {
      // if the node was orinally a wall before the start/end node moved into it, set it
      // back to a wall
      currentNode.isWall = true;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
    }
  };

  handleMouseDown = (row, col) => {
    // set the state of a particular node based on its current status of
    // being a wall node or regular node
    let currentNode = this.state.grid[row][col];

    if (!currentNode.isFinish && !currentNode.isStart && !currentNode.isWall) {
      // turn the node into a wall node and indicate that the mouse is currently being pressed
      mouseIsPressed = true;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
      currentNode.isWall = true;
    } else if (
      !currentNode.isFinish &&
      !currentNode.isStart &&
      currentNode.isWall
    ) {
      // turn the node back into a regular node and indicate that the mouse is being pressed
      mouseIsPressed = true;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
      currentNode.isWall = false;
    } else if (currentNode.isStart) {
      // if the user is pressed on the start node, indicate that the start node is moving
      this.setState({
        startNodeMove: true,
      });
    } else if (currentNode.isFinish) {
      // if the user is pressed on the finish  node, indicate that the finish node is moving
      this.setState({
        finishNodeMove: true,
      });
    }
  };

  handleMouseUp = (row, col) => {
    // if the mouse is released
    let currentNode = this.state.grid[row][col];
    // the start and finish node are not being moved
    this.setState({
      startNodeMove: false,
      finishNodeMove: false,
    });
    mouseIsPressed = false;

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
      currentNode.isFinish = false;
      currentNode.isVisited = false;
      currentNode.isStart = false;
      currentNode.isWall = false;
      document.getElementById(`node-${row}-${col}`).className = "node";

      START_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
      FINISH_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
      START_NODE_COL = Math.floor(GRID_LENGTH / 4);
      FINISH_NODE_COL = Math.floor(GRID_LENGTH * (4 / 5));

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
  };

  // visualize depth first search algo
  visualizeDepthFirstSearch = (animate) => {
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
      this.disableGrid();
      // get the start node
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      // get the path returned
      let path = DFS(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      // visualize the path
      if (path.shortest === null) {
        this.displayAlgoNoPath(path.visited);
      } else {
        this.displayAlgo(path.visited, path.shortest, animate);
      }
    }
  };

  // visualize the greedy best first search algo
  visualizeGreedyBestFirstSearch = (animate) => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 1,
      });
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = GBFS(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_HEIGHT,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath, animate);
    }
  };

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = (animate) => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 3,
      });
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = BFS(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath, animate);
    }
  };

  // visualize A* algo
  visualizeAStar = (animate) => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.setState({
        lastAlgo: 0,
      });
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = aStar(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_HEIGHT,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath, animate);
    }
  };

  // visualize Dijkstra's algo
  visualizeDijkstra = (animate) => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      this.clearPath();
      this.setState({
        lastAlgo: 2,
      });
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = dijkstra(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath, animate);
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
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, this.state.speedValue[this.state.speedIndex + 5] * i);
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
  displayAlgo(nodes, shortestPath, animate) {
    for (let i = 0; i <= nodes.length; i++) {
      if (i === nodes.length) {
        // if the other elements are done updating, show the shortest path
        if (animate) {
          setTimeout(() => {
            this.visualizeShortestPath(shortestPath, animate);
          }, this.state.speedValue[this.state.speedIndex] * i);
        } else {
          this.visualizeShortestPath(shortestPath, animate);
        }
      } else {
        if (animate) {
          setTimeout(() => {
            if (!node.isStart && !node.isFinish) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited disabledNode";
            }
          }, this.state.speedValue[this.state.speedIndex] * i);
          const node = nodes[i];
        } else {
          const node = nodes[i];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited-no-animation";
          }
        }
      }
    }
  }

  // show the shortest path
  visualizeShortestPath(shortestPath, animate) {
    this.setState({
      gridClear: false,
    });

    for (let j = 0; j <= shortestPath.length; j++) {
      if (j === shortestPath.length) {
        if (animate) {
          setTimeout(() => {
            this.enableGrid();
            this.setState({
              gridBeingUsed: false,
            });
          }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
        } else {
          this.enableGrid();
        }
      } else {
        if (animate) {
          setTimeout(() => {
            const node = shortestPath[j];
            if (!node.isStart && !node.isFinish) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-final-path disabledNode";
            }
          }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
        } else {
          const node = shortestPath[j];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-final-path-no-animation";
          }
        }
      }
    }
  }

  // clear the grid of all path nodes
  clearPath = () => {
    this.setState({
      gridClear: true,
      lastAlgo: -1,
    });
    nodeBeforeEnter = -1;
    for (let i = 0; i < GRID_HEIGHT; i++) {
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
  };

  updateCurrentAlgo = (event) => {
    this.setState({
      currentAlgo: event.target.value,
      startButtonPhrase: "Visualize",
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
      for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_LENGTH; j++) {
          if (i === START_NODE_ROW && j === START_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-start";
            this.state.grid[i][j].isStart = true;
          } else if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node-finish";
            this.state.grid[i][j].isFinish = true;
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

  startAlgorithm = (animate) => {
    if (
      this.state.currentSpeed == "Speed" &&
      this.state.currentAlgo !== "Algorithms"
    ) {
      this.forceUpdateSpeed();
    }
    if (
      this.state.currentAlgo !== "Algorithms" &&
      animate &&
      !this.state.startNodeMove &&
      !this.state.finishNodeMove
    ) {
      this.setState({
        gridBeingUsed: true,
      });
    }
    let algo = this.state.currentAlgo;
    if (algo === "A* Algorithm") {
      this.visualizeAStar(animate);
    } else if (algo === "Greedy Best-First Search") {
      this.visualizeGreedyBestFirstSearch(animate);
    } else if (algo === "Dijkstra's Algorithm") {
      this.visualizeDijkstra(animate);
    } else if (algo === "Breadth First Search") {
      this.visualizeBreadthFirstSearch(animate);
    } else if (algo === "Depth First Search") {
      this.visualizeDepthFirstSearch(animate);
    }
  };

  // generate a maze to be displayed
  generateMaze = async (event) => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      let type = event.target.value;
      this.clearGrid();
      this.disableGrid();
      this.setState({
        gridBeingUsed: true,
      });
      if (type === "Random Walls") {
        let walls = RandomMaze(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        this.displayMaze(walls);
      } else if (type === "Vertical Walls") {
        let walls = VerticalWalls(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        this.displayMaze(walls);
      } else if (type === "Horizontal Walls") {
        let walls = HorizontalWalls(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        this.displayMaze(walls);
      }
    }
  };

  displayMaze = (nodes) => {
    for (let i = 0; i <= nodes.length; i++) {
      if (i == nodes.length) {
        setTimeout(() => {
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, 7 * i);
      } else {
        setTimeout(() => {
          let node = nodes[i];
          if (
            (node.row !== FINISH_NODE_ROW || node.col !== FINISH_NODE_COL) &&
            (node.row !== START_NODE_ROW || node.col !== START_NODE_COL)
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-wall";
            this.state.grid[node.row][node.col].isVisited = false;
            this.state.grid[node.row][node.col].isWall = true;
          }
        }, 7 * i);
      }
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

  // If the user does not choose a speed, choose normal for them
  forceUpdateSpeed = () => {
    this.setState({
      speedIndex: 1,
      currentSpeed: "Normal",
    });
  };

  // Set the grid to how it was when game first started
  resetGrid = () => {
    if (!this.state.startNodeMove && !this.state.finishNodeMove) {
      this.clearGrid();
      START_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
      FINISH_NODE_ROW = Math.floor(GRID_HEIGHT / 2);
      START_NODE_COL = Math.floor(GRID_LENGTH / 4);
      FINISH_NODE_COL = Math.floor(GRID_LENGTH * (4 / 5));
      const gridDrawn = this.formulateGrid();
      this.setState({
        grid: gridDrawn,
        speedIndex: 1,
        currentAlgo: "Algorithms",
        currentSpeed: "Speed",
        mazeLabel: "Generate Maze",
        startButtonPhrase: "Choose Algorithm",
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
              className={`${
                this.state.gridBeingUsed ? "dropDownDisabled" : "dropDown"
              }`}
              id="pathfinding-algorithm-selection"
              value={this.state.currentAlgo}
              onChange={this.updateCurrentAlgo}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              <option selected disabled hidden>
                Algorithms
              </option>
              {this.state.algorithms.map((algorithms) => (
                <option key={algorithms} value={algorithms}>
                  {algorithms}
                </option>
              ))}
            </select>
            <select
              className={`${
                this.state.gridBeingUsed ? "dropDownDisabled" : "dropDown"
              }`}
              id="maze-algorithm-selection"
              value={"Generate Walls"}
              onChange={this.generateMaze}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              <option selected disabled hidden>
                Generate Walls
              </option>
              {this.state.mazeAlgorithms.map((maze) => (
                <option key={maze} value={maze}>
                  {maze}
                </option>
              ))}
            </select>
            <select
              value={this.state.currentSpeed}
              className={`${
                this.state.gridBeingUsed ? "dropDownDisabled" : "dropDown"
              }`}
              id="speed-selection"
              onChange={this.updateSpeed}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              <option selected disabled hidden>
                Speed
              </option>
              {this.state.speed.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}
                </option>
              ))}
            </select>
            <button
              className={`button button-start ${
                this.state.gridBeingUsed ? "button-start-disabled" : ""
              }`}
              id="start-algorithm"
              onClick={() => this.startAlgorithm(true)}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              {this.state.startButtonPhrase}
            </button>
            <button
              id="clear-grid"
              className={`button ${
                this.state.gridBeingUsed
                  ? "button-clear-disabled"
                  : "button-clear"
              }`}
              onClick={this.clearGrid}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              Clear Grid
            </button>
            <button
              id="reset-button"
              className={`button ${
                this.state.gridBeingUsed
                  ? "button-clear-disabled"
                  : "button-clear"
              }`}
              onClick={this.resetGrid}
              disabled={this.state.gridBeingUsed ? true : false}
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
                      />
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

  disableGrid() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
      for (let j = 0; j < GRID_LENGTH; j++) {
        document.getElementById(`node-${i}-${j}`).classList.add("disabledNode");
      }
    }
  }

  enableGrid() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
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
    for (let i = 0; i < GRID_HEIGHT; i++) {
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
