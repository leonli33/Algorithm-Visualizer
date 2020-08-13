import { getNeighbors } from "../Functions/functions";

// depth first search
export function DFS(grid, startN, GRID_LENGTH, GRID_WIDTH) {
  // push the first node into the array containing the nodes to be explored
  let nodesToVisit = [];
  nodesToVisit.push(startN);
  let nodesVisited = [];
  let path = helperDFS(
    grid,
    GRID_LENGTH,
    GRID_WIDTH,
    nodesToVisit,
    nodesVisited
  );
  return path;
}

// recursive implementation
function helperDFS(grid, GRID_LENGTH, GRID_WIDTH, nodesToVisit, nodesVisited) {
  // if there are more nodes to visit and the node to explore next is the end node, return the path found
  if (
    nodesToVisit.length !== 0 &&
    nodesToVisit[nodesToVisit.length - 1].isFinish
  ) {
    let path = {
      visited: nodesVisited,
      shortest: nodesToVisit,
    };
    return path;
  }
  // if there are no more nodes to visit, terminate
  else if (nodesToVisit.length === 0) {
    let path = {
      visited: nodesVisited,
      shortest: null,
    };
    return path;
  } else {
    // get the current node to be explored next
    let currentNode = nodesToVisit[nodesToVisit.length - 1];
    // get the nodes surrounding the current node
    let neighbors = getNeighbors(currentNode, grid, GRID_LENGTH, GRID_WIDTH);
    // for every neighbor
    for (let i = 0; i < neighbors.length; i++) {
      // if the neighbor is not a wall and is not the start node
      if (!neighbors[i].isWall && !neighbors[i].isStart) {
        // get the current neighbor
        let neighbor = neighbors[i];
        // if the node has not aleady been visited
        if (!neighbor.isVisited) {
          // set the previous node to be the current node
          neighbor.previousNode = currentNode;
          neighbor.isVisited = true;
          // push the neighbor into the nodes to visit and the nodes visited array
          nodesVisited.push(neighbor);
          nodesToVisit.push(neighbor);
          // recurse

          // get the result
          let recursiveResult = helperDFS(
            grid,
            GRID_LENGTH,
            GRID_WIDTH,
            nodesToVisit,
            nodesVisited
          );
          if (recursiveResult === undefined) {
            continue;
          }
          // return the result if not null and undefined
          else if (
            recursiveResult.shortest !== null &&
            recursiveResult.shortest !== undefined
          ) {
            return recursiveResult;
          }
        }
      }
    }
    // pop the last element out of the nodesToVisit array (element being explored)
    nodesToVisit.pop();
    return helperDFS(grid, GRID_LENGTH, GRID_WIDTH, nodesToVisit, nodesVisited);
  }
}
