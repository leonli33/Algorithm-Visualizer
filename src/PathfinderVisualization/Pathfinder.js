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

const GRID_WIDTH = 20;
const GRID_LENGTH = 50;

export default class Pathfinder extends Component {
  constructor(props) {
      super(props);
      this.state = {
          grid:[],
          mousePressed: false
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
    console.log(event);
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

  visualizeDepthFirstSearch = () => {
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = DFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path,path);
  }

  visualizeGreedyBestFirstSearch = () => {
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = GBFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    this.displayAlgo(path.visited,path.shortest);
  }

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = () => {
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = BFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
  }

  visualizeAStar = () => {
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = aStar(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    this.displayAlgo(path.visited,path.shortest);
  }


  visualizeDijkstra = () => {
    let startNode = this.state.grid[START_NODE_ROW][START_NODE_COL];
    let path = dijkstra(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
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

  clearGrid = () => {
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
            <button className="button" onClick={this.visualizeGreedyBestFirstSearch}>
              Greedy Best-First Search
            </button>
            <button className="button" onClick={this.visualizeBreadthFirstSearch}>
              Swarm Algorithm
            </button>
            <button className="button" onClick={this.visualizeDijkstra}>
              Dijkstra's Algorithm
            </button>
            <button className="button button-run" onClick={this.visualizeAStar}>
              Visualize Algorithm!
            </button>
            <button className="button" onClick={this.visualizeAStar}>
              A* Algorithm
            </button>
            <button className="button" onClick={this.visualizeBreadthFirstSearch}>
              Breadth First Search
            </button>
            <button className="button" onClick={this.visualizeDepthFirstSearch}>
              Depth First Search
            </button>
            <button className="button button-clear" onClick={this.clearGrid}>
              Clear Grid
            </button>
          </div>

          <div className="legend">

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