import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../Algos/Dijkstra";
import { AStar } from "../Algos/AStar";
import { BFS } from "../Algos/BreadthFirstSearch";
import { DFS } from "../Algos/DepthFirstSearch";
import { GBFS } from "../Algos/GreedyBestFirstSearch";
import { RandomMaze } from "../Maze/RandomMaze";
import { VerticalWalls } from "../Maze/VerticalWalls";
import { HorizontalWalls } from "../Maze/HorizontalWalls";
import { PrimsAlgorithm } from "../Maze/PrimsAlgorithm";
import Legend from "./Components/Legend/Legend";
import Dropdown from "./Components/Dropdown/Dropdown";
import clsx from "clsx";
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

// 0 = regular node, 1 = wall
let nodeBeforeEnter = -1;

let GRID_HEIGHT = 20;
let GRID_LENGTH = 50;
export default class Pathfinder extends Component {
  // last algo: 0 = A*, 1 = Greedy, 2= Dijkstra, 3=Breadth, 4 = Depth
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridClear: true,
      isStartNodeMoving: false,
      finishNodeMove: false,
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
      mazeAlgorithms: [
        "Random Walls",
        "Vertical Walls",
        "Horizontal Walls",
        "Prim's Algorithm",
      ],
      mazeLabel: "Generate Maze",
      startButtonText: "Choose Algorithm",
      gridBeingUsed: false,
      nodeWidth: 25,
      isAlgorithmOpen: false,
      isMazeOpen: false,
      isSpeedOpen: false,
    };
  }

  // set the grid and also set up a mouseUp listener
  componentDidMount() {
    let windowWidth = window.innerWidth;
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
      nodeWidth: 25,
    });
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("resize", this.updateDimensions);
  }

  // detach mouseUp listener
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    const GRID_WIDTH_PX = window.innerWidth - 50;
    const nodeWidth = GRID_WIDTH_PX / GRID_LENGTH;
    this.setState({
      nodeWidth: Math.floor(nodeWidth),
    });
  };

  // if mouse enters the boundary of any node
  handleMouseEnter = (row, col, isLeftMouseDown, isShiftKeyDown) => {
    if (this.state.gridBeingUsed) return;
    const node = this.state.grid[row][col];
    // use this to take the state of the node back to what it was
    nodeBeforeEnter = node.isWall ? 1 : 0;
    // if dragging to make walls
    const isNodeRegular = !node.isFinish && !node.isStart;
    const isStartOrEndNodeMoving =
      this.state.isStartNodeMoving || this.state.finishNodeMove;
    if (isNodeRegular && !isStartOrEndNodeMoving && isLeftMouseDown) {
      node.isWall = true;
      node.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
    } else if (isNodeRegular && !isStartOrEndNodeMoving && isShiftKeyDown) {
      node.isWall = false;
      node.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    } else if (this.state.isStartNodeMoving && !node.isFinish) {
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
    if (this.state.isStartNodeMoving && !currentNode.isFinish) {
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
      (this.state.isStartNodeMoving || this.state.finishNodeMove)
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
    if (this.state.gridBeingUsed) return;
    let currentNode = this.state.grid[row][col];

    if (!currentNode.isFinish && !currentNode.isStart && !currentNode.isWall) {
      // turn the node into a wall node and indicate that the mouse is currently being pressed
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
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
      currentNode.isWall = false;
    } else if (currentNode.isStart) {
      // if the user is pressed on the start node, indicate that the start node is moving
      this.setState({
        isStartNodeMoving: true,
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
      isStartNodeMoving: false,
      finishNodeMove: false,
    });

    // if the start or end node is moving, update accoridingly
    if (this.state.isStartNodeMoving) {
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
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      // if the grid is not clear, clear the grid
      if (!this.state.gridClear) {
        this.clearPath();
      }
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
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
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
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = BFS(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath, animate);
    }
  };

  // visualize A* algo
  visualizeAStar = (animate) => {
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      if (!this.state.gridClear) {
        this.clearPath();
      }
      this.disableGrid();
      let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
      let path = AStar(
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
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      this.clearPath();
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

  updateCurrentAlgo = (newAlgorithm) => {
    this.handleDropdownOpenStateChange("");
    this.setState({
      currentAlgo: newAlgorithm,
      startButtonText: "Visualize",
    });
  };

  // clear the grid of all wall and path nodes
  clearGrid = () => {
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
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

  startAlgorithm = (shouldAnimate) => {
    this.handleDropdownOpenStateChange("");
    const fieldsAreSelected = !(
      this.state.currentSpeed === "Speed" &&
      this.state.currentAlgo !== "Algorithms"
    );
    const boardIsBeingUsed =
      this.state.currentAlgo !== "Algorithms" &&
      shouldAnimate &&
      !this.state.isStartNodeMoving &&
      !this.state.finishNodeMove;

    if (boardIsBeingUsed) {
      if (!fieldsAreSelected) {
        this.forceUpdateSpeed();
      }
      this.setState({
        gridBeingUsed: true,
      });
    }
    const { currentAlgo } = this.state;
    if (currentAlgo === "A* Algorithm") {
      this.visualizeAStar(shouldAnimate);
    } else if (currentAlgo === "Greedy Best-First Search") {
      this.visualizeGreedyBestFirstSearch(shouldAnimate);
    } else if (currentAlgo === "Dijkstra's Algorithm") {
      this.visualizeDijkstra(shouldAnimate);
    } else if (currentAlgo === "Breadth First Search") {
      this.visualizeBreadthFirstSearch(shouldAnimate);
    } else if (currentAlgo === "Depth First Search") {
      this.visualizeDepthFirstSearch(shouldAnimate);
    }
  };

  // generate a maze to be displayed
  generateMaze = (type) => {
    this.handleDropdownOpenStateChange("");
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
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
      } else if (type === "Prim's Algorithm") {
        this.createGridOfWalls();
        const pathAnimations = PrimsAlgorithm(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        setTimeout(() => {
          this.displayPrimsAlgorithm(pathAnimations);
        }, 1500);
      }
    }
  };

  displayPrimsAlgorithm = (pathAnimations) => {
    for (let i = 0; i <= pathAnimations.length; i++) {
      if (i === pathAnimations.length) {
        this.setState({
          gridBeingUsed: false,
        });
      } else {
        setTimeout(() => {
          const { row, col } = pathAnimations[i];
          if (row === START_NODE_ROW && col === START_NODE_COL) return;
          if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) return;
          this.state.grid[row][col].isWall = false;
          this.state.grid[row][col].isVisited = false;
          this.state.grid[row][col].isStart = false;
          this.state.grid[row][col].isFinish = false;
          document.getElementById(`node-${row}-${col}`).className = "node";
        }, this.state.speedValue[this.state.speedIndex] * i);
      }
    }
  };

  createGridOfWalls = () => {
    for (let i = 0; i < GRID_HEIGHT; i++) {
      for (let j = 0; j < GRID_LENGTH; j++) {
        if (
          (i !== FINISH_NODE_ROW || j !== FINISH_NODE_COL) &&
          (i !== START_NODE_ROW || j !== START_NODE_COL)
        ) {
          this.state.grid[i][j].isWall = true;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isStart = false;
          this.state.grid[i][j].isFinish = false;
          document.getElementById(`node-${i}-${j}`).className =
            "node node-wall";
        }
      }
    }
  };

  displayMaze = (nodes) => {
    for (let i = 0; i <= nodes.length; i++) {
      if (i === nodes.length) {
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

  updateSpeed = (speed) => {
    this.handleDropdownOpenStateChange("");
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
    if (!this.state.isStartNodeMoving && !this.state.finishNodeMove) {
      this.handleDropdownOpenStateChange("");
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
        startButtonText: "Choose Algorithm",
      });
    }
  };

  handleDropdownOpenStateChange = (type) => {
    if (type === "ALGORITHMS") {
      this.setState({
        isMazeOpen: false,
        isSpeedOpen: false,
        isAlgorithmOpen: !this.state.isAlgorithmOpen,
      });
    } else if (type === "GENERATE_WALLS") {
      this.setState({
        isAlgorithmOpen: false,
        isSpeedOpen: false,
        isMazeOpen: !this.state.isMazeOpen,
      });
    } else if (type === "SPEED") {
      this.setState({
        isAlgorithmOpen: false,
        isMazeOpen: false,
        isSpeedOpen: !this.state.isSpeedOpen,
      });
    } else {
      this.setState({
        isAlgorithmOpen: false,
        isMazeOpen: false,
        isSpeedOpen: false,
      });
    }
  };

  render() {
    return (
      <div className="overall-container">
        <div className="button-container">
          <div
            className={clsx(
              "header",
              this.state.gridBeingUsed && "header-disabled"
            )}
            onClick={this.state.gridBeingUsed ? null : this.resetGrid}
          >
            Pathfinding Visualized
          </div>
          <div className="buttons">
            <Dropdown
              gridBeingUsed={this.state.gridBeingUsed}
              placeholder="Algorithms"
              id="pathfinding-algorithm-selection"
              onChange={this.updateCurrentAlgo}
              value={this.state.currentAlgo}
              items={this.state.algorithms}
              handleDropdownOpenStateChange={this.handleDropdownOpenStateChange}
              type="ALGORITHMS"
              isOpen={this.state.isAlgorithmOpen}
            />
            <Dropdown
              gridBeingUsed={this.state.gridBeingUsed}
              placeholder="Generate Walls"
              id="maze-algorithm-selection"
              onChange={this.generateMaze}
              value={"Generate Walls"}
              items={this.state.mazeAlgorithms}
              handleDropdownOpenStateChange={this.handleDropdownOpenStateChange}
              type="GENERATE_WALLS"
              isOpen={this.state.isMazeOpen}
            />
            <Dropdown
              gridBeingUsed={this.state.gridBeingUsed}
              placeholder="Speed"
              id="speed-selection"
              onChange={this.updateSpeed}
              value={this.state.currentSpeed}
              items={this.state.speed}
              handleDropdownOpenStateChange={this.handleDropdownOpenStateChange}
              type="SPEED"
              isOpen={this.state.isSpeedOpen}
            />
            <button
              className={clsx(
                "button",
                "button-start",
                this.state.gridBeingUsed && "button-start-disabled"
              )}
              id="start-algorithm"
              onClick={() => this.startAlgorithm(true)}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              {this.state.startButtonText}
            </button>
            <button
              id="clear-grid"
              className={clsx(
                "button",
                this.state.gridBeingUsed && "button-clear-disabled",
                !this.state.gridBeingUsed && "button-clear"
              )}
              onClick={this.clearGrid}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              Clear Grid
            </button>
            <button
              id="reset-button"
              className={clsx(
                "button",
                this.state.gridBeingUsed && "button-clear-disabled",
                !this.state.gridBeingUsed && "button-clear"
              )}
              onClick={this.resetGrid}
              disabled={this.state.gridBeingUsed ? true : false}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="grid-and-legend">
          <div
            className="legend-container"
            onClick={() => this.handleDropdownOpenStateChange("")}
          >
            <Legend />
          </div>
          <div
            id="gridNodes"
            className="grid"
            onClick={() => this.handleDropdownOpenStateChange("")}
          >
            <div>
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
                          onMouseDown={(row, col) =>
                            this.handleMouseDown(row, col)
                          }
                          onMouseEnter={(
                            row,
                            col,
                            isLeftMouseDown,
                            isShiftKeyDown
                          ) =>
                            this.handleMouseEnter(
                              row,
                              col,
                              isLeftMouseDown,
                              isShiftKeyDown
                            )
                          }
                          onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                          onMouseOut={(row, col) =>
                            this.handleMouseOut(row, col)
                          }
                          row={row}
                          nodeWidth={this.state.nodeWidth}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
