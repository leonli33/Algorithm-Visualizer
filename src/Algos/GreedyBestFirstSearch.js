import { getNeighbors } from "../Functions/functions";


// Greedier version of A*
export function GBFS(
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

  startNode.isVisited = true;
  nodesToVisit.push(startNode);

  while (nodesToVisit.length !== 0) {
    nodesToVisit.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    let currentNode = nodesToVisit.shift();
    if (currentNode.isFinish) {
      shortestPath.push(currentNode);
      let current = currentNode.previousNode;
      while (current !== null) {
        shortestPath.push(current);
        current = current.previousNode;
      }
      break;
    }

    if (currentNode.isWall) continue;

    let surroundingNodes = getNeighbors(
      currentNode,
      grid,
      GRID_LENGTH,
      GRID_WIDTH
    );
    for (let i = 0; i < surroundingNodes.length; i++) {
      if (!surroundingNodes[i].isWall && !surroundingNodes[i].isStart) {
        let neighbor = surroundingNodes[i];
        if (!neighbor.isVisited) {
          // get the distance between current node and end node (H cost)
          let distanceFromEndX = Math.abs(FINISH_NODE_ROW - neighbor.row) * 10;
          let distanceFromEndY = Math.abs(FINISH_NODE_COL - neighbor.col) * 10;
          let distanceFromEndNode = distanceFromEndX + distanceFromEndY;

          // Greedy best first search only takes into account distance from end node
          // when calculating cost. Thus f(n) = h(n)
          neighbor.previousNode = currentNode;
          neighbor.distance = distanceFromEndNode;
          neighbor.isVisited = true;
          nodesToVisit.push(neighbor);
        }
      }
    }
    visitedNodes.push(currentNode);
  }
  let path = {
    visited: visitedNodes,
    shortest: shortestPath,
  };
  return path;
}
