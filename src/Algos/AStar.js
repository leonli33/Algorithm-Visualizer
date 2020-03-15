const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;


export function aStar(grid, startN, GRID_LENGTH, GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL,) {
    const START_NODE_ROW = startN.row;
    const START_NODE_COL = startN.col;
    let nodesToVisit = [];
    let visitedNodes = [];
    let shortestPath = [];
    let startNode = grid[startN.col][startN.row];

    startNode.distance = 0;
    startNode.gCost = 0;
    startNode.isVisited = true;
    nodesToVisit.push(startNode);

    while(nodesToVisit.length !== 0) {
      nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
      let currentNode = nodesToVisit.shift();
      if(currentNode.isFinish) {
        let current = currentNode;
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
            // get the distance between current node and end node (H cost)
            let distanceFromEndX = (Math.abs(FINISH_NODE_ROW - neighbor.row)) * 10;
            let distanceFromEndY = (Math.abs(FINISH_NODE_COL - neighbor.col)) * 10;
            let distanceFromEndNode = distanceFromEndX  + distanceFromEndY;

            // set the previous node equal to the current node
            neighbor.previousNode = currentNode;

            // get the g cost, determined by a nodes distance from the start node
            let distanceFromStartX = (Math.abs(START_NODE_ROW - neighbor.row)) * 10;
            let distanceFromStartY = (Math.abs(START_NODE_COL - neighbor.col)) * 10;
            let distanceFromStartNode = distanceFromStartX  + distanceFromStartY;
            neighbor.gCost = distanceFromStartNode;

            // A* is calculated by adding Gcost with Hcost
            neighbor.distance = neighbor.gCost + distanceFromEndNode;
            neighbor.isVisited = true;
            nodesToVisit.push(neighbor);
          }
        }
      }
      visitedNodes.push(currentNode);
    }
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