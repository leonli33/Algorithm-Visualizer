import React, {Component} from 'react'
import Node from './Node/Node'
import {dijkstra} from '../Algos/Dijkstra';
import {aStar} from '../Algos/AStar';
import {BFS} from '../Algos/BreadthFirstSearch';
import {DFS} from '../Algos/DepthFirstSearch';
import {GBFS} from '../Algos/GreedyBestFirstSearch';

import './Pathfinder.css';

let START_NODE_ROW = 10;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 45;

let mouseIsPressed = false;

const GRID_WIDTH = 20;
const GRID_LENGTH = 50;

export default class Pathfinder extends Component {
  constructor(props) {
      super(props);
      this.state = {
          grid:[],
          mousePressed: false,
          gridClear: true,
          beingUsed: false,
          finishNodeMove: false,
          startNodeMove: false
      };
  }


  componentDidMount() {
      const gridDrawn = this.formulateGrid();
      this.setState({
        grid: gridDrawn
      });
  }

  handleMouseEnter = (row,col,event) => {
    event.persist();
    event.preventDefault();
    if(!this.state.grid[row][col].isFinish && !this.state.grid[row][col].isStart && mouseIsPressed
        && !this.state.startNodeMove) {
        if(!this.state.grid[row][col].isWall) {
          this.state.grid[row][col].isWall = true;
          document.getElementById(`node-${row}-${col}`).className = "node node-wall";
        } else {
          this.state.grid[row][col].isWall = false;
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
    }
  }

  handleMouseDown = (row,col,event) => {
    event.persist();
    event.preventDefault();
    mouseIsPressed = true;
    // set the state of a particular node based on its current status of 
    // being a wall node or regular node
    if(!this.state.grid[row][col].isFinish && !this.state.grid[row][col].isStart && 
      !this.state.grid[row][col].isWall) {
      document.getElementById(`node-${row}-${col}`).className = "node node-wall";
      this.state.grid[row][col].isWall = true;
    } else if(!this.state.grid[row][col].isFinish && !this.state.grid[row][col].isStart && 
      this.state.grid[row][col].isWall) {
      document.getElementById(`node-${row}-${col}`).className = "node";
      this.state.grid[row][col].isWall = false;
    }else if (this.state.grid[row][col].isStart) {
      this.setState({
        startNodeMove: true
      });
    }
  }

  handleMouseUp = (row,col,event) => {
    event.persist();
    event.preventDefault();
    console.log("mouse is up" + row + "," + col);
    if(this.state.startNodeMove) {
      this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = false;
      document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
          'node';

      this.state.grid[row][col].isStart = true;
      this.state.grid[row][col].isVisited = false;
      this.state.grid[row][col].isWall = false;

      document.getElementById(`node-${row}-${col}`).className =
          'node node-start';
      START_NODE_ROW = row;
      START_NODE_COL = col;
      console.log("new start node " + START_NODE_ROW+ "," + START_NODE_COL)
    }

    mouseIsPressed = false;
    this.setState({
      startNodeMove:false
    });
  }

  handleMouseMove = (event) => {
  }

  generateWalls = () => {
    this.getGrid(this.state.grid,0,0,GRID_LENGTH,GRID_WIDTH,this.getOrientation(GRID_WIDTH,GRID_LENGTH))
  }


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  // width = hor
  // height = vert
                   //50  20
  getGrid(grid,x,y,hor,vert,orientation) {
    if(vert < 2 || hor < 2) return;

    let horizontal = orientation === "Horizontal";

    // where will wall start?
    let wallX = x + (horizontal ? this.getRandomInt(0,vert - 1) : 0);
    let wallY = y + (horizontal ? 0 : this.getRandomInt(0,hor - 1));

    // determine where passage in the wall will be 
    let passageX = wallX + (horizontal ? 0 : this.getRandomInt(0,vert - 1));
    let passageY = wallY + (horizontal ? this.getRandomInt(0,hor - 1) : 0);

    // direction of wall:
    let directionY = horizontal ? 1 : 0;
    let directionX = horizontal ? 0 : 1;

    // determine the length of the wall
    let length = horizontal ? hor : vert;

    // what direction is perp to the wall
   // let dir = horizontal ? SOUTH : EAST;

    // draw the grid
    for(let i = 0; i < length;i++) {
        console.log("walls : " + wallX+","+wallY)
        if(wallX !== passageX || wallY !== passageY) {
          document.getElementById(`node-${wallX}-${wallY}`).className =
          'node node-wall';
          grid[wallX][wallY].isWall = true;
        }
        wallX += directionX;
        wallY += directionY;
    }

    let nx = x;
    let ny = y;
    let newHor = horizontal ? hor : wallY - y + 1;
    let newVert = horizontal ? wallX-x + 1: vert;
    this.getGrid(grid, nx, ny, newHor, newVert, this.getOrientation(newVert, newHor));

    nx = horizontal ? x : wallY + 1;
    ny = horizontal ? wallX +1 : y;
    newHor = horizontal ? hor : y + hor - wallY -1;
    newVert = horizontal ? x + vert - wallX -1: vert;
    this.getGrid(grid, nx, ny, newHor, newVert, this.getOrientation(newVert, newHor));
    
  }

  getOrientation(vert,hor) {
    if(vert < hor) {
        return "Verticle";
    } else {
        return "Horizontal";
    }
  } 

  visualizeDepthFirstSearch = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    this.disableElements();
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = DFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    if(path.shortest === null) {
      this.displayAlgoNoPath(path.visited);
    } else {
      this.displayAlgo(path.visited,path.shortest);
    }
  }

  visualizeGreedyBestFirstSearch = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    this.disableElements();
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = GBFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    let shortestPath = path.shortest.reverse();
    this.displayAlgo(path.visited,shortestPath);
  }

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    this.disableElements();
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = BFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    let shortestPath = path.shortest.reverse();
    this.displayAlgo(path.visited,shortestPath);
  }

  visualizeAStar = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    this.disableElements();
    console.log(START_NODE_ROW + "," + START_NODE_COL)
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = aStar(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    let shortestPath = path.shortest.reverse();
    this.displayAlgo(path.visited,shortestPath);
  }
 

  visualizeDijkstra = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    this.disableElements();
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = dijkstra(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    let shortestPath = path.shortest.reverse();
    this.displayAlgo(path.visited,shortestPath);
  }

  displayAlgoNoPath(nodes) {
    this.setState({
      gridClear: false
    });
    for(let i = 0; i <= nodes.length;i++) {
      if(i === nodes.length) {
        setTimeout(() => {
          this.enableElements();
        }, 6 * i);
      }
      else {
         setTimeout(() => {
        const node = nodes[i];
        if(!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited disabledNode';
        }}, 6 * i);
      }
    }
  }

  displayAlgo(nodes, shortestPath) {
    for(let i = 0; i <= nodes.length;i++) {
      if(i === nodes.length) {
          setTimeout(() => {
            this.visualizeShortestPath(shortestPath);
          }, 6 * i);
      } else {
        setTimeout(() => {
        const node = nodes[i];
        if(!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited disabledNode';
        }}, 6 * i);
      }
    }
  }

  visualizeShortestPath(shortestPath) {
    this.setState({
      gridClear: false
    });
    for(let j = 0; j <= shortestPath.length;j++)  {
      if(j === shortestPath.length) {
        setTimeout(() => {
          this.enableElements();
        }, 10 * j);
      } else {
        setTimeout(() => {
          const node = shortestPath[j];
          if(!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-final-path disabledNode';
          }        
        }, 10 * j);
      }
    }
  };

  clearPath = () => {
    this.setState({
      gridClear: true
    })
    for(let i = 0; i < GRID_WIDTH; i++) {
      for(let j = 0; j < GRID_LENGTH;j++) {
        if(i === START_NODE_ROW && j === START_NODE_COL) {
          document.getElementById(`node-${i}-${j}`).className = 'node node-start';
          this.state.grid[i][j].distance = Infinity;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isWall = false;
          this.state.grid[i][j].previousNode = null;
        } else if(i === FINISH_NODE_ROW && j === FINISH_NODE_COL ) {
          document.getElementById(`node-${i}-${j}`).className = 'node node-finish';
          this.state.grid[i][j].distance = Infinity;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isWall = false;
          this.state.grid[i][j].previousNode = null;
        }
        else if(this.state.grid[i][j].isVisited && !this.state.grid[i][j].isFinish) {
          document.getElementById(`node-${i}-${j}`).className = 'node';
          this.state.grid[i][j].distance = Infinity;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isWall = false;
          this.state.grid[i][j].previousNode = null;
        }
      }
    }
  }

  clearGrid = () => {
    this.setState({
      gridClear: true
    })
    for(let i = 0; i < GRID_WIDTH; i++) {
      for(let j = 0; j < GRID_LENGTH;j++) {
          if(i === START_NODE_ROW && j === START_NODE_COL) {
            document.getElementById(`node-${i}-${j}`).className = 'node node-start';
          } else if(i === FINISH_NODE_ROW && j === FINISH_NODE_COL ) {
            document.getElementById(`node-${i}-${j}`).className = 'node node-finish';
          } else {
            document.getElementById(`node-${i}-${j}`).className = 'node';
          }
          this.state.grid[i][j].distance = Infinity;
          this.state.grid[i][j].isVisited = false;
          this.state.grid[i][j].isWall = false;
          this.state.grid[i][j].previousNode = null;
      }
    }
  }

  render() {
      const {grid, mousePressed} = this.state;
      return (
        <>
          <div className="buttons">
            <button id="AStar_Visualizer" className="button buttonAlgo" onClick={this.visualizeAStar}>
              A* Algorithm
            </button>
            <button id="GBFS_Visualizer" className="button buttonAlgo" onClick={this.visualizeGreedyBestFirstSearch}>
              Greedy Best-First Search
            </button>
            <button id="Dijkstra_Visualizer" className="button buttonAlgo" onClick={this.visualizeDijkstra}>
              Dijkstra's Algorithm
            </button>
            <button id="BFS_Visualizer" className="button buttonAlgo" onClick={this.visualizeBreadthFirstSearch}>
              Breadth First Search
            </button>
            <button id="DFS_Visualizer" className="button buttonAlgo" onClick={this.visualizeDepthFirstSearch}>
              Depth First Search
            </button>
            <button id="GenerateWalls" className="button button-walls buttonWalls" onClick={this.generateWalls}>
              Generate Walls
            </button>
            <button id="ClearGrid" className="button button-clear buttonClear" onClick={this.clearGrid}>
              Clear Grid
            </button>
            <button id="ClearPath" className="button button-clear buttonClear" onClick={this.clearPath}>
              Clear Path
            </button>
          </div>

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

          <div id="gridNodes" className="grid" onMouseMove={(event) => this.handleMouseMove(event)}>
            {this.state.grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      row, 
                      col, 
                      isFinish, 
                      isStart, 
                      isWall
                    } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row,col,event) =>this.handleMouseDown(row, col,event)}
                        onMouseEnter={(row, col,event) =>this.handleMouseEnter(row, col,event)}
                        onMouseUp={(row, col,event) =>this.handleMouseUp(row, col,event)}
                        row={row}></Node>
                    );
                  })}
                </div>  
              );
            })}
          </div>
        </>
      );
    }
    
    disableElements() {
      document.getElementById(`AStar_Visualizer`).setAttribute("disabled","disabled");
      document.getElementById(`GBFS_Visualizer`).setAttribute("disabled","disabled");
      document.getElementById(`Dijkstra_Visualizer`).setAttribute("disabled","disabled");
      document.getElementById(`BFS_Visualizer`).setAttribute("disabled","disabled");
      document.getElementById(`DFS_Visualizer`).setAttribute("disabled","disabled");
      document.getElementById(`GenerateWalls`).setAttribute("disabled","disabled");
      document.getElementById(`ClearGrid`).setAttribute("disabled","disabled");
      document.getElementById(`ClearPath`).setAttribute("disabled","disabled");
      for(let i = 0; i < GRID_WIDTH; i++) {
        for(let j = 0; j < GRID_LENGTH;j++) {
          document.getElementById(`node-${i}-${j}`).classList.add("disabledNode");
        }
      }
      
    }

    enableElements() {
      document.getElementById(`AStar_Visualizer`).removeAttribute("disabled");
      document.getElementById(`GBFS_Visualizer`).removeAttribute("disabled");
      document.getElementById(`Dijkstra_Visualizer`).removeAttribute("disabled");
      document.getElementById(`BFS_Visualizer`).removeAttribute("disabled");
      document.getElementById(`DFS_Visualizer`).removeAttribute("disabled");
      document.getElementById(`GenerateWalls`).removeAttribute("disabled");
      document.getElementById(`ClearGrid`).removeAttribute("disabled");
      document.getElementById(`ClearPath`).removeAttribute("disabled");
      for(let i = 0; i < GRID_WIDTH; i++) {
        for(let j = 0; j < GRID_LENGTH;j++) {
          document.getElementById(`node-${i}-${j}`).classList.remove("disabledNode");
        }
      }
    }

    formulateGrid = () => {
        // draw a grid onto the screen
        const nodes = [];
        for(let i = 0; i < GRID_WIDTH; i++) {
            const row = [];
            for(let j = 0; j < GRID_LENGTH;j++) {
                row.push(this.createNode(j,i));
            }
            nodes.push(row);
        }
        return nodes;
    }

    createNode = (col, row) => {
        return {
          col,
          row,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null
        };
    };
}