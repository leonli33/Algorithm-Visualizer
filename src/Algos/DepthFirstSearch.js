const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

export function DFS(grid, startN, GRID_LENGTH, GRID_WIDTH) {
    let nodesToVisit = [];
    nodesToVisit.push(startN);
    let nodesVisited = [];
    let path = helperDFS(grid,GRID_LENGTH,GRID_WIDTH,nodesToVisit,nodesVisited);
    return path;
}

function helperDFS(grid,GRID_LENGTH,GRID_WIDTH,nodesToVisit,nodesVisited) {
    if(nodesToVisit.length !== 0 && nodesToVisit[nodesToVisit.length - 1].isFinish) {
        return nodesVisited;
    }
    else if(nodesToVisit.length === 0) {
        return null;
    }
    else {
        let currentNode = nodesToVisit[nodesToVisit.length - 1];
        let neighbors = getNeighbors(currentNode,grid,GRID_LENGTH,GRID_WIDTH);
        for(let i = 0; i < neighbors.length; i++) {
            if(!neighbors[i].isWall && !neighbors[i].isStart) {
                let neighbor = neighbors[i];
                if(!neighbor.isVisited) {
                    neighbor.isVisited = true;
                    nodesVisited.push(neighbor);
                    nodesToVisit.push(neighbor);
                    let recursiveResult = helperDFS(grid,GRID_LENGTH,GRID_WIDTH,nodesToVisit,nodesVisited);
                    if(recursiveResult !== null) {
                        return recursiveResult;
                    }
                }
            }
        }
        nodesToVisit.pop();
    }
}

function getNeighbors(currentNode, grid,GRID_LENGTH,GRID_WIDTH) {
  let neighbors = [];
  let x = currentNode.row;
  let y = currentNode.col;

  if(x > 0 && y > 0 && y < GRID_LENGTH - 1 && x < GRID_WIDTH -1 ) {
    console.log(x + "," + y)
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