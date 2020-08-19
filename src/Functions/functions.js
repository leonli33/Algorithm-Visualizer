const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

export function getNeighbors(currentNode, grid, GRID_LENGTH, GRID_WIDTH) {
  let neighbors = [];
  let x = currentNode.row;
  let y = currentNode.col;

  if (x > 0 && y > 0 && y < GRID_LENGTH - 1 && x < GRID_WIDTH - 1) {
    neighbors.push(grid[x + NORTH][y]);
    neighbors.push(grid[x][y + EAST]);
    neighbors.push(grid[x + SOUTH][y]);
    neighbors.push(grid[x][y + WEST]);
  } else if (x === 0 && y === 0) {
    neighbors.push(grid[x][y + EAST]);
    neighbors.push(grid[x + SOUTH][y]);
  } else if (x === 0 && y === GRID_LENGTH - 1) {
    neighbors.push(grid[x][y + WEST]);
    neighbors.push(grid[x + SOUTH][y]);
  } else if (x === GRID_WIDTH - 1 && y === 0) {
    neighbors.push(grid[x + NORTH][y]);
    neighbors.push(grid[x][y + EAST]);
  } else if (x === GRID_WIDTH - 1 && y === GRID_LENGTH - 1) {
    neighbors.push(grid[x + NORTH][y]);
    neighbors.push(grid[x][y + WEST]);
  } else if (y === 0 && x > 0 && x < GRID_WIDTH - 1) {
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
  } else if (x === GRID_WIDTH - 1 && y > 0 && y < GRID_LENGTH - 1) {
    neighbors.push(grid[x + NORTH][y]);
    neighbors.push(grid[x][y + EAST]);
    neighbors.push(grid[x][y + WEST]);
  }
  return neighbors;
}

export function generateSideWalls(
  wallNodes,
  StartNode,
  FinishNode,
  width,
  height
) {
  // left side
  for (let row = 0; row < height; row++) {
    if (
      (row !== StartNode.row || StartNode.col !== 0) &&
      (row !== FinishNode.row || FinishNode.col !== 0)
    ) {
      let node = {
        row: row,
        col: 0,
      };
      wallNodes.push(node);
    }
  }

  // top side
  for (let col = 0; col < width; col++) {
    if (
      (col !== StartNode.col || StartNode.row !== 0) &&
      (col !== FinishNode.col || FinishNode.row !== 0)
    ) {
      let node = {
        row: 0,
        col: col,
      };
      wallNodes.push(node);
    }
  }

  //right side
  for (let row = 0; row < height; row++) {
    if (
      (row !== StartNode.row || StartNode.col !== width - 1) &&
      (row !== FinishNode.row || FinishNode.col !== width - 1)
    ) {
      let node = {
        row: row,
        col: width - 1,
      };
      wallNodes.push(node);
    }
  }

  // bottom side
  for (let col = 0; col < width; col++) {
    if (
      (col !== StartNode.row || StartNode.col !== height - 1) &&
      (col !== FinishNode.row || FinishNode.col !== height - 1)
    ) {
      let node = {
        row: height - 1,
        col: col,
      };
      wallNodes.push(node);
    }
  }
}

// Generate a random number netween lowNum and highNum
export function generateRandomNumber(lowNum, highNum) {
  return Math.floor(Math.random() * (highNum - lowNum + 1)) + lowNum;
}
