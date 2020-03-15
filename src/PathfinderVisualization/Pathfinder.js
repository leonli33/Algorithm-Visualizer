import React, {Component} from 'react'
import Node from './Node/Node'
import {dijkstra} from '../Algos/Dijkstra';
import {aStar} from '../Algos/AStar';
import {BFS} from '../Algos/BreadthFirstSearch';
import {DFS} from '../Algos/DepthFirstSearch';
import {GBFS} from '../Algos/GreedyBestFirstSearch';

import './Pathfinder.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

const GRID_WIDTH = 20;
const GRID_LENGTH = 50;

export default class Pathfinder extends Component {
  constructor(props) {
      super(props);
      this.state = {
          grid:[],
          mousePressed: false,
          gridClear: true
      };
  }

  componentDidMount() {
      const gridDrawn = this.formulateGrid();
      this.setState({
        grid: gridDrawn
      });
  }

  handleMouseEnter = (row,col) => {
    if(!this.state.grid[row][col].isFinish && !this.state.grid[row][col].isStart && this.state.mouseIsPressed) {
      let newGrid = this.toggleGridWalls(this.state.grid,row,col);
      this.setState({
        grid: newGrid,
      })
    }
  }

  handleMouseDown = (row,col) => {
    if(!this.state.grid[row][col].isFinish && !this.state.grid[row][col].isStart) {
      let newGrid = this.toggleGridWalls(this.state.grid,row,col);
      this.setState({
        grid: newGrid,
        mouseIsPressed: true
      })
    }
  }

  handleMouseUp = () => {
    console.log("mouse is up");
    this.setState({
      mouseIsPressed: false
    });
  }

  handleMouseMove = (event) => {
    //console.log(event);
  }

  toggleGridWalls(grid,row,col) {
      let changedGrid = grid.slice();
      let nodeToToggle = grid[row][col];
      let node = {
        ...nodeToToggle,
        isWall: !nodeToToggle.isWall,
      };
      changedGrid[row][col] = node;
      return changedGrid;
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
    if(vert < 3 || hor < 3) return;

    let horizontal = orientation === "Horizontal";

    // where will wall start?
    let wallX = x + (horizontal ? this.getRandomInt(0,vert - 2) : 0);
    let wallY = y + (horizontal ? 0 : this.getRandomInt(0,hor - 2));

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
        }
        wallX += directionX;
        wallY += directionY;
    }

    let nx = x;
    let ny = y;
    let newHor = horizontal ? hor : wallY - y + 1;
    let newVert = horizontal ? wallX-x + 1: vert;
    this.getGrid(grid, nx, ny, newHor, newVert, this.getOrientation(newVert, newHor));

    /*
    let nx = x;
    let ny = y;
    let newHor = horizontal ? hor : wallY - y + 1;
    let newVert = horizontal ? wallX-x+1 : vert;
    this.getGrid(grid, nx, ny, newHor, newVert, this.getOrientation(newVert, newHor));

    
   
    nx = horizontal ? x : wallY + 1;
    ny = horizontal ? wallX +1 : y;

    
    newHor = horizontal ? hor : y + hor - wallY -1;
    newVert = horizontal ? x + vert - wallX -1: vert;
    this.getGrid(grid, nx, ny, newHor, newVert, this.getOrientation(newVert, newHor));
    */
    
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
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = GBFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    this.displayAlgo(path.visited,path.shortest);
  }

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = BFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
  }

  visualizeAStar = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = aStar(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    this.displayAlgo(path.visited,path.shortest);
  }
 

  visualizeDijkstra = () => {
    if(!this.state.gridClear) {
      this.clearPath();
    }
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = dijkstra(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
  }

  displayAlgoNoPath(nodes) {
    this.setState({
      gridClear: false
    });
    for(let i = 0; i < nodes.length;i++) {
      setTimeout(() => {
        const node = nodes[i];
        if(!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }}, 6 * i);
    }
  }

  displayAlgo(nodes, shortestPath) {
    this.setState({
      gridClear: false
    });
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
          'node node-visited';
        }}, 6 * i);
      }
      }
  }

  visualizeShortestPath(shortestPath) {
    for(let j = 0; j < shortestPath.length;j++)  {
      setTimeout(() => {
        const node = shortestPath[j];
        if(!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-final-path';
        }
      }, 10 * j);
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
      const {grid, mouseIsPressed} = this.state;
      return (
        <>
          <div className="buttons">
            <button className="button buttonAlgo" onClick={this.visualizeAStar}>
              A* Algorithm
            </button>
            <button className="button buttonAlgo" onClick={this.visualizeGreedyBestFirstSearch}>
              Greedy Best-First Search
            </button>
            <button className="button buttonAlgo" onClick={this.visualizeDijkstra}>
              Dijkstra's Algorithm
            </button>
            <button className="button buttonAlgo" onClick={this.visualizeBreadthFirstSearch}>
              Breadth First Search
            </button>
            <button className="button buttonAlgo" onClick={this.visualizeDepthFirstSearch}>
              Depth First Search
            </button>
            <button className="button button-walls buttonWalls" onClick={this.generateWalls}>
              Generate Walls
            </button>
            <button className="button button-clear buttonClear" onClick={this.clearGrid}>
              Clear Grid
            </button>
            <button className="button button-clear buttonClear" onClick={this.clearPath}>
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

          <div className="grid" onMouseMove={(event) => this.handleMouseMove(event)}>
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
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>this.handleMouseEnter(row, col)}
                        onMouseUp={() => this.handleMouseUp()}
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