import React, {Component} from 'react'
import Node from './Node/Node'
import {dijkstra} from '../Algos/Dijkstra';
import {aStar} from '../Algos/AStar';
import {BFS} from '../Algos/BreadthFirstSearch';
import {DFS} from '../Algos/DepthFirstSearch';

import './Pathfinder.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 45;
const FINISH_NODE_COL = 10;

const GRID_WIDTH = 50;
const GRID_LENGTH = 50;

const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

export default class Pathfinder extends Component {
  constructor(props) {
      super(props);
      this.state = {
          grid:[]
      };
  }

  componentDidMount() {
      const gridDrawn = this.formulateGrid();
      this.setState({
        grid: gridDrawn
      });
  }

  handleMouseEnter = () => {
    
  }

  handleMouseDown = (row,col) => {
    if(!this.state.grid[col][row].isFinish && !this.state.grid[col][row].isStart) {
      this.state.grid[col][row].isWall = true;
      document.getElementById(`node-${row}-${col}`).className =
            'node node-wall';
    }
  }

  handleMouseUp = () => {

    
  }

  visualizeDepthFirstSearch = () => {
    let startNode = this.state.grid[START_NODE_COL][START_NODE_ROW];
    let path = DFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    console.log(path);
    this.displayAlgo(path,path);
  }

  // this is pretty much the same thing as dijkstra's except we are not sorting
  visualizeBreadthFirstSearch = () => {
    let startNode = this.state.grid[START_NODE_COL][START_NODE_ROW];
    let path = BFS(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
  }


  visualizeAStar = () => {
    let startNode = this.state.grid[START_NODE_COL][START_NODE_ROW];
    let path = aStar(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL);
    this.displayAlgo(path.visited,path.shortest);
  }


  visualizeDijkstra = () => {
    let startNode = this.state.grid[START_NODE_COL][START_NODE_ROW];
    let path = dijkstra(this.state.grid,startNode,GRID_LENGTH,GRID_WIDTH);
    this.displayAlgo(path.visited,path.shortest);
  }

  displayAlgo(nodes, shortestPath) {
    for(let i = 0; i <= nodes.length;i++) {
      if(i === nodes.length) {
          setTimeout(() => {
            this.visualizeShortestPath(shortestPath);
          }, 5 * i);
      } else {
        setTimeout(() => {
        const node = nodes[i];
        if(!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }}, 5 * i);
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

  getNeighbors(currentNode, grid) {
    let neighbors = [];
    let x = currentNode.row;
    let y = currentNode.col;

    if(x > 0 && y > 0 && y < GRID_LENGTH - 1 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[y + NORTH][x]);
      neighbors.push(grid[y ][x + EAST]);
      neighbors.push(grid[y+ SOUTH][x ])
      neighbors.push(grid[y][x + WEST])
    } else if(x === 0 && y === 0) {
      neighbors.push(grid[y][x+ EAST]);
      neighbors.push(grid[y+ SOUTH][x ])
    } else if(x===0 && y === GRID_LENGTH) {
      neighbors.push(grid[y + NORTH][x]);
      neighbors.push(grid[y][x+ EAST]);
    } else if(x === GRID_WIDTH - 1 && y === 0) {
      neighbors.push(grid[y + SOUTH][x])
      neighbors.push(grid[y ][x+ WEST])
    } else if(x === GRID_WIDTH - 1 && y === GRID_LENGTH - 1) {
      neighbors.push(grid[y+ NORTH][x ]);
      neighbors.push(grid[y][x + WEST])
    } else if(y === 0 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[y][x+ EAST]);
      neighbors.push(grid[y + SOUTH][x])
      neighbors.push(grid[y][x + WEST])
    } else if (x === 0 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[y + NORTH][x]);
      neighbors.push(grid[y ][x+ EAST]);
      neighbors.push(grid[y + SOUTH][x])
    } else if (y === GRID_LENGTH - 1 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[y + NORTH][x]);
      neighbors.push(grid[y][x + EAST]);
      neighbors.push(grid[y][x + WEST]);
    } else if(x === GRID_WIDTH - 1 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[y + NORTH][x]);
      neighbors.push(grid[y + SOUTH][x])
      neighbors.push(grid[y][x + WEST])
    }
    return (
      neighbors
    );
  }

  render() {
      const {grid, mouseIsPressed} = this.state;
      return (
        <>
        <button className="button" onClick={this.visualizeAStar}>
            Greedy Best-First Search
          </button>
          <button className="button" onClick={this.visualizeAStar}>
            A* Algorithm
          </button>
          <button className="button" onClick={this.visualizeDijkstra}>
            Dijkstra's Algorithm
          </button>
          <button className="button button-run" onClick={this.visualizeAStar}>
            Visualize Algorithm!
          </button>
          <button className="button" onClick={this.visualizeBreadthFirstSearch}>
            Breadth First Search
          </button>
          <button className="button" onClick={this.visualizeDepthFirstSearch}>
            Depth First Search
          </button>
          <button className="button button-clear" onClick={this.visualizeDijkstra}>
            Clear Grid
          </button>
          <div className="grid">
            {this.state.grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
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
                row.push(this.createNode(i,j));
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
          previousNode: null,
        };
      };
}