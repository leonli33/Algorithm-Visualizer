import { getNeighbors } from "../Functions/functions";

// depth first search
export function DFS(grid, startNode, length, height) {
  // push the first node into the array containing the nodes to be explored
  let stack = [];
  stack.push(startNode);
  startNode.isVisited = true;
  let animation = [];
  //[1, 2, 3, 4]
  while (stack.length !== 0) {
    const currentNode = stack.pop();
    currentNode.isVisited = true;

    // terminate
    if (currentNode.isFinish) {
      const shortestPath = [];
      let current = currentNode.previousNode;
      while (current !== null) {
        shortestPath.push(current);
        current = current.previousNode;
      }
      return {
        visited: animation,
        shortest: shortestPath.reverse(),
      };
    }
    if (!currentNode.isStart) {
      animation.push({ node: currentNode, type: "VISITED" });
    }
    // [W, S, E, N]
    const neighbors = getNeighbors(currentNode, grid, length, height);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue;
      stack.push(neighbor);
      neighbor.previousNode = currentNode;
      neighbor.totalCost = "N/A";
      animation.push({ node: neighbor, type: "NEIGHBOR" });
    }
  }
  return {
    visited: animation,
    shortest: null,
  };
}
