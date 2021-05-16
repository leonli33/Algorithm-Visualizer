import { getNeighbors } from "../Functions/functions";

// A* algo
export function AStar(
  grid,
  startN,
  GRID_LENGTH,
  GRID_WIDTH,
  FINISH_NODE_ROW,
  FINISH_NODE_COL
) {
  let nodesToVisit = [];
  let visitedNodes = [];
  let shortestPath = [];
  let startNode = grid[startN.row][startN.col];

  // push the start node into the array to be explored
  startNode.distance = 0;
  startNode.gCost = 0;
  startNode.isVisited = true;
  nodesToVisit.push(startNode);

  // while array containing the nodes to be explored is not empty
  while (nodesToVisit.length !== 0) {
    // sort the array
    nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    // take the first element out of the array
    let currentNode = nodesToVisit.shift();
    // check if the current node is the finish node
    if (currentNode.isFinish) {
      let current = currentNode;
      // if it is, get the shortest path
      while (current !== null) {
        shortestPath.push(current);
        current = current.previousNode;
      }
      // end the loop
      break;
    }
    // if the currenNode is a wall, dont do anything
    if (currentNode.isWall) continue;

    // get the nodes surrounding the currentNode
    let surroundingNodes = getNeighbors(
      currentNode,
      grid,
      GRID_LENGTH,
      GRID_WIDTH
    );

    // for every neighbor
    for (let i = 0; i < surroundingNodes.length; i++) {
      // if the node is not a wall and is not the start node
      if (!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
        let neighbor = surroundingNodes[i];
        // if the neighbor has not already been visited
        if (!neighbor.isVisited) {
          // get the distance between current node and end node (H cost)
          let distanceFromEndX = Math.abs(FINISH_NODE_ROW - neighbor.row) * 10;
          let distanceFromEndY = Math.abs(FINISH_NODE_COL - neighbor.col) * 10;
          let distanceFromEndNode = distanceFromEndX + distanceFromEndY;

          // set the previous node equal to the current node
          neighbor.previousNode = currentNode;

          // get the g cost, determined by a nodes distance from the start node
          let distanceFromStartX =
            Math.abs(currentNode.row - neighbor.row) * 10;
          let distanceFromStartY =
            Math.abs(currentNode.col - neighbor.col) * 10;
          neighbor.gCost =
            currentNode.gCost + distanceFromStartX + distanceFromStartY;

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
    visited: visitedNodes,
    shortest: shortestPath,
  };
  return path;
}
