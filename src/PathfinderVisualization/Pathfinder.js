import React, {Component} from 'react'
import Node from './Node/Node'
import './Pathfinder.css';

const START_NODE_ROW = 12;
const START_NODE_COL = 12;
const FINISH_NODE_ROW = 35;
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

  visualizeDijkstra = () => {
    let data = this.state.grid;
    let nodesToVisit = [];
    let visitedNodes = [];
    let shortestPath = [];
    let startNode = this.state.grid[START_NODE_COL][START_NODE_ROW];

    startNode.distance = 0;
    startNode.isVisited = true;
    nodesToVisit.push(startNode);

    while(nodesToVisit.length !== 0) {
      nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
      let currentNode = nodesToVisit.shift();
      if(currentNode.isFinish) {
        shortestPath.push(currentNode);
        let current = currentNode.previousNode;
        while(current !== null) {
          shortestPath.push(current);
          current = current.previousNode;
        }
        break;
      }
      if(currentNode.isWall) continue;
      let surroundingNodes = this.getNeighbors(currentNode,data);
      for(let i = 0; i < surroundingNodes.length; i++) {
        if(!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
          let neighbor = surroundingNodes[i];
          if(!neighbor.isVisited) {
            neighbor.previousNode = currentNode;
            neighbor.distance = currentNode.distance + 1;
            neighbor.isVisited = true;
            nodesToVisit.push(neighbor);
          }
        }
      }
      visitedNodes.push(currentNode);
    }

    this.displayDijkstra(visitedNodes,shortestPath);
  }

  displayDijkstra(nodes, shortestPath) {
    for(let i = 0; i <= nodes.length;i++) {
      if(i === nodes.length) {
          setTimeout(() => {
            this.visualizeShortestPath(shortestPath);
          }, 7 * i);
      } else {
        setTimeout(() => {
        const node = nodes[i];
        if(!node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }}, 7 * i);
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
          <button className="button" onClick={this.visualizeDijkstra}>
            Visualize Dijkstra's Algorithm
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