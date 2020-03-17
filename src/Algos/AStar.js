// determines which direction to go in the 2D array
const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;


// A* algo
export function aStar(grid, startN, GRID_LENGTH, GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL,) {
  // get the position of the start node
    const START_NODE_ROW = startN.row;
    const START_NODE_COL = startN.col;
    let nodesToVisit = [];
    let visitedNodes = [];
    let shortestPath = [];
    let startNode = grid[startN.col][startN.row];

    // push the start node into the array to be explored
    startNode.distance = 0;
    startNode.gCost = 0;
    startNode.isVisited = true;
    nodesToVisit.push(startNode);

    // while array containing the nodes to be explored is not empty
    while(nodesToVisit.length !== 0) {
      // sort the array
      nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
      // take the first element out of the array
      let currentNode = nodesToVisit.shift();
      // check if the current node is the finish node
      if(currentNode.isFinish) {
        let current = currentNode;
        // if it is, get the shortest path
        while(current !== null) {
          shortestPath.push(current);
          current = current.previousNode;
        }
        // end the loop
        break;
      }
      // if the currenNode is a wall, dont do anything
      if(currentNode.isWall) continue;

      // get the nodes surrounding the currentNode
      let surroundingNodes = getNeighbors(currentNode,grid,GRID_LENGTH,GRID_WIDTH);
      
      // for every neighbor
      for(let i = 0; i < surroundingNodes.length; i++) {
        // if the node is not a wall and is not the start node
        if(!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
          let neighbor = surroundingNodes[i];
          // if the neighbor has not already been visited
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
      // push currentNode into the visited array
      visitedNodes.push(currentNode);
    }
    // return the path and the shortest path
    let path = {
        visited : visitedNodes,
        shortest: shortestPath
    }
    return path;
}

// get the neighbors surrounding a node
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