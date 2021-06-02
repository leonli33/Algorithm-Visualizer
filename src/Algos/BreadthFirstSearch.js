import { getNeighbors } from "../Functions/functions";

// I decided not to use this algorithm anymore since it is the same as Dijkstra's in my 
// graph representation

// Breadth first search
export function BFS(grid, startN, GRID_LENGTH, GRID_WIDTH) {
  let nodesToVisit = [];
  let visitedNodes = [];
  let shortestPath = [];
  let startNode = grid[startN.row][startN.col];

  // push the start node into the array to be explored
  startNode.distance = 0;
  startNode.isVisited = true;
  nodesToVisit.push(startNode);

  // while there are still nodes to be explored
  while (nodesToVisit.length !== 0) {
    // take the first node from the front of the array
    let currentNode = nodesToVisit.shift();
    if (currentNode.isFinish) {
      //calculate shortest path
      shortestPath.push(currentNode);
      let current = currentNode.previousNode;
      while (current !== null) {
        shortestPath.push(current);
        current = current.previousNode;
      }
      break;
    }
    // if the node is a wall, dont do anything
    if (currentNode.isWall) continue;

    //get the neighbors surrounding the node
    let surroundingNodes = getNeighbors(
      currentNode,
      grid,
      GRID_LENGTH,
      GRID_WIDTH
    );

    // for each surrounding node
    for (let i = 0; i < surroundingNodes.length; i++) {
      // if the node is not a wall and is not the start node
      if (!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
        let neighbor = surroundingNodes[i];
        // if the node has not been visited
        if (!neighbor.isVisited) {
          // calculate distance and push node into the array of nodes to be visited
          neighbor.previousNode = currentNode;
          neighbor.distance = currentNode.distance + 1;
          neighbor.isVisited = true;
          nodesToVisit.push(neighbor);
        }
      }
    }
    // done with node
    visitedNodes.push(currentNode);
  }
  // return the path and the shortest path
  let path = {
    visited: visitedNodes,
    shortest: shortestPath,
  };
  return path;
}
