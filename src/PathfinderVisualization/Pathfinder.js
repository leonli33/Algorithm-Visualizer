import React, { Component } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import BrickWall from "../assets/brick-wall.png";
import Node from "./Node/Node";
import { dijkstra } from "../Algos/Dijkstra";
import { AStar } from "../Algos/AStar";
import { DFS } from "../Algos/DepthFirstSearch";
import { GBFS } from "../Algos/GreedyBestFirstSearch";
import { PrimsAlgorithm } from "../Maze/PrimsAlgorithm";
import { RecursiveBacktracking } from "../Maze/RecursiveBacktracking";
import { KruskalsAlgorithm } from "../Maze/KruskalsAlgorithm";
import {
  WilsonsAlgorithm,
  WALL_TYPE,
  MAZE_TYPE,
  EXPLORE_TYPE,
} from "../Maze/WilsonsAlgorithm";
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

// 0 = regular node, 1 = wall, 2 = explored, 3 = shortest-path
let nodeBeforeEnter = -1;

let GRID_HEIGHT = 20;
let GRID_LENGTH = 50;
export default class Pathfinder extends Component {
  // last algo: 0 = A*, 1 = Greedy, 2= Dijkstra, 3= DFS
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridClear: true,
      isStartNodeMoving: false,
      isFinishNodeMoving: false,
      algorithms: [
        "A* Algorithm",
        "Greedy Best-First Search",
        "Dijkstra's Algorithm",
        "Depth First Search",
      ],
      currentAlgo: "Algorithms",
      speed: ["Slow", "Normal", "Fast"],
      currentSpeed: "Speed",
      speedValue: [100, 6, 4],
      speedIndex: 1,
      mazeAlgorithms: [
        "Prim's Algorithm",
        "Wilson's Algorithm",
        "Kruskal's Algorithm",
        "Recursive Backtracking",
      ],
      startButtonText: "Choose Algorithm",
      gridBeingUsed: false,
      nodeWidth: 25,
      isAlgorithmOpen: false,
      isMazeOpen: false,
      isSpeedOpen: false,
      isWallMode: true,
    };
  }

  componentDidMount() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.screen.height;
    GRID_HEIGHT = Math.ceil((windowHeight - 250) / 25);
    GRID_LENGTH = Math.ceil((windowWidth - 50) / 25);
    if (GRID_HEIGHT % 2 === 0) GRID_HEIGHT++;
    if (GRID_LENGTH % 2 === 0) GRID_LENGTH--;
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
    if (!this.state.isWallMode) return;
    const node = this.state.grid[row][col];
    // use this to take the state of the node back to what it was
    nodeBeforeEnter = -1;
    if (node.isWall) {
      nodeBeforeEnter = 1;
    } else if (node.isExploredNode) {
      nodeBeforeEnter = 2;
    } else if (node.isShortestPathNode) {
      nodeBeforeEnter = 3;
    }
    // if dragging to make walls
    const isNodeRegular = !node.isFinish && !node.isStart;
    const isStartOrEndNodeMoving =
      this.state.isStartNodeMoving || this.state.isFinishNodeMoving;
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
      node.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-start";
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (this.state.isFinishNodeMoving && !node.isStart) {
      // if the finish node is moving, do the same thing as described above
      node.isFinish = true;
      node.isWall = false;
      node.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-finish";
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
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
    } else if (this.state.isFinishNodeMoving && !currentNode.isStart) {
      // if finish node has moved out of this node, put node back into regular node
      currentNode.isStart = false;
      currentNode.isFinish = false;
      currentNode.isWall = false;
      currentNode.isVisited = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    }
    if (this.state.isStartNodeMoving || this.state.isFinishNodeMoving) {
      if (nodeBeforeEnter === 1) {
        // if the node was orinally a wall before the start/end node moved into it, set it
        // back to a wall
        currentNode.isWall = true;
        currentNode.isVisited = false;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-wall";
      } else if (nodeBeforeEnter === 2) {
        currentNode.isWall = false;
        currentNode.isVisited = true;
        currentNode.isExploredNode = true;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-visited";
      } else if (nodeBeforeEnter === 3) {
        currentNode.isWall = false;
        currentNode.isVisited = true;
        currentNode.isExploredNode = false;
        currentNode.isShortestPathNode = true;
        document.getElementById(`node-${row}-${col}`).className =
          "node node-final-path";
      }
    }
  };

  handleMouseDown = (row, col) => {
    if (this.state.gridBeingUsed || !this.state.isWallMode) return;
    let currentNode = this.state.grid[row][col];
    if (!currentNode.isFinish && !currentNode.isStart && !currentNode.isWall) {
      currentNode.isVisited = false;
      currentNode.isWall = true;
      document.getElementById(`node-${row}-${col}`).className =
        "node node-wall";
    } else if (
      !currentNode.isFinish &&
      !currentNode.isStart &&
      currentNode.isWall
    ) {
      // turn the node back into a regular node and indicate that the mouse is being pressed
      currentNode.isVisited = false;
      currentNode.isWall = false;
      document.getElementById(`node-${row}-${col}`).className = "node";
    } else if (currentNode.isStart) {
      // if the user is pressed on the start node, indicate that the start node is moving
      this.setState({
        isStartNodeMoving: true,
      });
    } else if (currentNode.isFinish) {
      // if the user is pressed on the finish  node, indicate that the finish node is moving
      this.setState({
        isFinishNodeMoving: true,
      });
    }
  };

  handleMouseUp = (row, col) => {
    // if the mouse is released
    let currentNode = this.state.grid[row][col];
    // the start and finish node are not being moved
    this.setState({
      isStartNodeMoving: false,
      isFinishNodeMoving: false,
    });

    // if the start or end node is moving, update accordingly
    if (this.state.isStartNodeMoving) {
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (this.state.isFinishNodeMoving) {
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
          if (!node.isStart && !node.isFinish) {
            this.state.grid[node.row][node.col].isExploredNode = true;
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited disabledNode";
          }
        }, this.state.speedValue[this.state.speedIndex] * i);
        const node = nodes[i];
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
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
      } else {
        setTimeout(() => {
          const node = shortestPath[j];
          if (!node.isStart && !node.isFinish) {
            this.state.grid[node.row][node.col].isExploredNode = false;
            this.state.grid[node.row][node.col].isShortestPathNode = true;
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-final-path disabledNode";
          }
        }, (this.state.speedValue[this.state.speedIndex] + 4) * j);
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
        this.state.grid[i][j].isExploredNode = false;
        this.state.grid[i][j].isShortestPathNode = false;
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
    if (!this.state.isStartNodeMoving && !this.state.isFinishNodeMoving) {
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

  startAlgorithm = () => {
    if (this.state.gridBeingUsed) return;
    this.handleDropdownOpenStateChange("");
    const fieldsAreSelected = !(
      this.state.currentSpeed === "Speed" &&
      this.state.currentAlgo !== "Algorithms"
    );
    const boardIsBeingUsed =
      this.state.currentAlgo !== "Algorithms" &&
      !this.state.isStartNodeMoving &&
      !this.state.isFinishNodeMoving;

    if (boardIsBeingUsed) {
      if (!fieldsAreSelected) {
        this.forceUpdateSpeed();
      }
      this.setState({
        gridBeingUsed: true,
      });
    }
    const { currentAlgo } = this.state;
    if (this.state.isStartNodeMoving || this.state.isFinishNodeMoving) return;
    if (!this.state.gridClear) {
      this.clearPath();
    }
    this.disableGrid();
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path;
    if (currentAlgo === "A* Algorithm") {
      path = AStar(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_HEIGHT,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    } else if (currentAlgo === "Greedy Best-First Search") {
      path = GBFS(
        this.state.grid,
        startNode,
        GRID_LENGTH,
        GRID_HEIGHT,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    } else if (currentAlgo === "Dijkstra's Algorithm") {
      path = dijkstra(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      let shortestPath = path.shortest.reverse();
      this.displayAlgo(path.visited, shortestPath);
    } else if (currentAlgo === "Depth First Search") {
      path = DFS(this.state.grid, startNode, GRID_LENGTH, GRID_HEIGHT);
      this.displayAlgo(
        path.visited,
        path.shortest === null ? [] : path.shortest
      );
    }
  };

  // generate a maze to be displayed
  generateMaze = (type) => {
    this.handleDropdownOpenStateChange("");
    if (!this.state.isStartNodeMoving && !this.state.isFinishNodeMoving) {
      this.clearGrid();
      this.disableGrid();
      this.setState({
        gridBeingUsed: true,
      });
      if (type === "Prim's Algorithm") {
        const pathAnimations = PrimsAlgorithm(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        this.createGridOfWalls(pathAnimations, this.displayPrimsPathAnimation);
      } else if (type === "Recursive Backtracking") {
        const pathAnimations = RecursiveBacktracking(
          this.state.grid,
          { row: START_NODE_ROW, col: START_NODE_COL },
          { row: FINISH_NODE_ROW, col: FINISH_NODE_COL }
        );
        this.createGridOfWalls(
          pathAnimations,
          this.displayRecursiveBacktrackingAnimation
        );
      } else if (type === "Kruskal's Algorithm") {
        const pathAnimations = KruskalsAlgorithm(this.state.grid);
        this.createGridOfWalls(pathAnimations, this.displayKruskalsAnimation);
      } else if (type === "Wilson's Algorithm") {
        const animations = WilsonsAlgorithm(this.state.grid);
        this.createGridOfWalls(animations, this.displayWilsonsAlgorithm);
      }
    }
  };

  createGridOfWalls = (pathAnimations, mazeAlgorithm) => {
    // create a grid of walls
    for (let i = 0; i < GRID_HEIGHT; i++) {
      for (let j = 0; j <= GRID_LENGTH; j++) {
        if (i === GRID_HEIGHT - 1 && j === GRID_LENGTH) {
          setTimeout(() => {
            mazeAlgorithm(pathAnimations);
          }, 500);
        } else {
          if (j === GRID_LENGTH) continue;
          if (this.isStartNodeOrEndNode(i, j)) continue;
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

  displayWilsonsAlgorithm = (animations) => {
    for (let i = 0; i <= animations.length; i++) {
      if (i === animations.length) {
        setTimeout(() => {
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, 5 * i);
      } else {
        setTimeout(() => {
          const currentAnimations = animations[i];
          const cellAnimations = currentAnimations.animations;
          const type = currentAnimations.animationType;
          for (const cell of cellAnimations) {
            const { row, col } = cell;
            if (this.isStartNodeOrEndNode(row, col)) continue;
            if (type === WALL_TYPE) {
              document.getElementById(
                `node-${row}-${col}`
              ).className = `node node-wall`;
              this.state.grid[row][col].isWall = true;
            } else if (type === EXPLORE_TYPE) {
              document.getElementById(
                `node-${row}-${col}`
              ).className = `node node-frontier`;
              this.state.grid[row][col].isWall = false;
            } else if (type === MAZE_TYPE) {
              document.getElementById(`node-${row}-${col}`).className = `node`;
              this.state.grid[row][col].isWall = false;
            } else {
              console.log("this should not happen");
            }
          }
        }, 5 * i);
      }
    }
  };

  displayKruskalsAnimation = (pathAnimations) => {
    for (let i = 0; i <= pathAnimations.length; i++) {
      if (i === pathAnimations.length) {
        setTimeout(() => {
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, 15 * i);
      } else {
        setTimeout(() => {
          const currentCell = pathAnimations[i];
          const { row, col } = currentCell;
          if (this.isStartNodeOrEndNode(row, col)) return;
          this.state.grid[row][col].isWall = false;
          document.getElementById(`node-${row}-${col}`).className = `node`;
        }, 15 * i);
      }
    }
  };

  displayRecursiveBacktrackingAnimation = (pathAnimations) => {
    for (let i = 0; i <= pathAnimations.length; i++) {
      if (i === pathAnimations.length) {
        setTimeout(() => {
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, 15 * i);
      } else {
        setTimeout(() => {
          const currentCell = pathAnimations[i];
          const { row, col, backtrack } = currentCell;
          if (this.isStartNodeOrEndNode(row, col)) return;
          this.state.grid[row][col].isWall = false;
          document.getElementById(`node-${row}-${col}`).className = `node ${
            backtrack ? "node-backtrack" : ""
          }`;
        }, 15 * i);
      }
    }
  };

  displayPrimsPathAnimation = (pathAnimations) => {
    for (let i = 0; i <= pathAnimations.length; i++) {
      if (i === pathAnimations.length) {
        setTimeout(() => {
          this.enableGrid();
          this.setState({
            gridBeingUsed: false,
          });
        }, 12 * i);
      } else {
        setTimeout(() => {
          const currentCell = pathAnimations[i];
          const { row, col, frontierCell } = currentCell;
          if (this.isStartNodeOrEndNode(row, col)) return;
          this.state.grid[row][col].isWall = false;
          document.getElementById(`node-${row}-${col}`).className = `node ${
            frontierCell && "node-frontier"
          }`;
        }, 12 * i);
      }
    }
  };

  isStartNodeOrEndNode = (row, col) => {
    return (
      (row === START_NODE_ROW && col === START_NODE_COL) ||
      (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
    );
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
    if (!this.state.isStartNodeMoving && !this.state.isFinishNodeMoving) {
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
        startButtonText: "Choose Algorithm",
        isWallMode: true,
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
        <div className="menu-container">
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
                handleDropdownOpenStateChange={
                  this.handleDropdownOpenStateChange
                }
                type="ALGORITHMS"
                isOpen={this.state.isAlgorithmOpen}
              />
              <Dropdown
                gridBeingUsed={this.state.gridBeingUsed}
                placeholder="Generate Maze"
                id="maze-algorithm-selection"
                onChange={this.generateMaze}
                value={"Generate Maze"}
                items={this.state.mazeAlgorithms}
                handleDropdownOpenStateChange={
                  this.handleDropdownOpenStateChange
                }
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
                handleDropdownOpenStateChange={
                  this.handleDropdownOpenStateChange
                }
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
                disabled={this.state.gridBeingUsed}
              >
                Reset
              </button>
            </div>
          </div>
          <button
            className={"inspection-button"}
            disabled={
              this.state.gridBeingUsed ||
              this.state.isStartNodeMoving ||
              this.state.isFinishNodeMoving
            }
            onClick={() => {
              this.setState((prevState) => {
                return {
                  ...prevState,
                  isWallMode: !prevState.isWallMode,
                };
              });
            }}
          >
            {this.state.isWallMode ? (
              <img style={{ width: "22px", height: "22px" }} src={BrickWall} />
            ) : (
              <BiSearchAlt2 style={{ width: "22px", height: "22px" }} />
            )}
          </button>
        </div>
        <div
          className="grid-and-legend"
          style={{ pointerEvents: this.state.gridBeingUsed ? "none" : "" }}
        >
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
            <div
              style={{
                textAlign: "center",
                marginLeft: "-10px",
                marginBottom: "10px",
              }}
            >
              {this.state.grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {
                        row,
                        col,
                        isFinish,
                        isStart,
                        isWall,
                        isWallAnimate,
                        isShortestPathNode,
                        isExploredNode,
                      } = node;
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
                          isWallAnimate={isWallAnimate}
                          isWallMode={this.state.isWallMode}
                          nodeIndex={rowIdx * GRID_LENGTH + nodeIdx}
                          gridBeingUsed={this.state.gridBeingUsed}
                          isShortestPathNode={isShortestPathNode}
                          isExploredNode={isExploredNode}
                          startNodeRow={START_NODE_ROW}
                          startNodeCol={START_NODE_COL}
                          finishNodeRow={FINISH_NODE_ROW}
                          finishNodeCol={FINISH_NODE_COL}
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
      isWallAnimate: false,
      previousNode: null,
      isShortestPathNode: false,
      isExploredNode: false,
    };
  };
}
