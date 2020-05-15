const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

export function dijkstra(grid, startN, GRID_LENGTH, GRID_WIDTH) {
    let nodesToVisit = [];
    let visitedNodes = [];
    let shortestPath = [];
    
    // set the start node in the grid
    let startNode = grid[startN.row][startN.col];

    // push the first node into the array of nodes to explore
    startNode.distance = 0;
    startNode.isVisited = true;
    nodesToVisit.push(startNode);

    // while there are more nodes to explore
    while(nodesToVisit.length !== 0) {
      // sort
      nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
      // take the first node out
      let currentNode = nodesToVisit.shift();
      // if its the finish node, return
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
      let surroundingNodes = getNeighbors(currentNode,grid,GRID_LENGTH,GRID_WIDTH);

      for(let i = 0; i < surroundingNodes.length; i++) {

        if(!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
          let neighbor = surroundingNodes[i];
          if(!neighbor.isVisited) {
            // set previous node accordingly and push all of neighbors into the array to be visited
            neighbor.previousNode = currentNode;
            neighbor.distance = currentNode.distance + 1;
            neighbor.isVisited = true;
            nodesToVisit.push(neighbor);
          }
        }
      }
      visitedNodes.push(currentNode);
    }
    // return the path and shortest path calculated
    let path = {
        visited : visitedNodes,
        shortest: shortestPath
    }
    return path;
}

function getNeighbors(currentNode, grid,GRID_LENGTH,GRID_WIDTH) {
    let neighbors = [];
    let x = currentNode.row;
    let y = currentNode.col;

    if(x > 0 && y > 0 && y < GRID_LENGTH - 1 && x < GRID_WIDTH -1 ) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if(x === 0 && y === 0) {
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if(x === 0 && y === GRID_LENGTH - 1) {
      neighbors.push(grid[x][y + WEST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if(x === GRID_WIDTH - 1 && y === 0) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
    } else if(x === GRID_WIDTH - 1 && y === GRID_LENGTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if(y === 0 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if (x === 0 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if (y === GRID_LENGTH - 1 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } 
    else if(x === GRID_WIDTH - 1 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x][y + WEST]);
    }
    return (
      neighbors
    );
  }