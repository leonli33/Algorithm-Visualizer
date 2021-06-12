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

// Generate a random number netween lowNum and highNum
export function generateRandomNumber(lowNum, highNum) {
  return Math.floor(Math.random() * (highNum - lowNum + 1)) + lowNum;
}

export function createNewDirectionMap() {
  const directions = new Map();
  directions.set("NORTH", {
    row: -2,
    col: 0,
  });
  directions.set("SOUTH", {
    row: 2,
    col: 0,
  });
  directions.set("WEST", {
    row: 0,
    col: -2,
  });
  directions.set("EAST", {
    row: 0,
    col: 2,
  });
  return directions;
}

export function checkCellInBounds(cell, height, width) {
  return (
    cell.row >= 1 && cell.row < height && cell.col >= 1 && cell.col < width
  );
}

export function isStartOrEndNode(currentNode, startNode, finishNode) {
  return (
    (currentNode.col === startNode.col && currentNode.row === startNode.row) ||
    (currentNode.col === finishNode.col && currentNode.row === finishNode.row)
  );
}

export function getStartCell(startNode, finishNode, height, width) {
  let startCellRow = generateRandomNumber(1, height - 1);
  let startCellCol = generateRandomNumber(1, width - 1);
  while (
    isStartOrEndNode(
      { row: startCellRow, col: startCellCol },
      startNode,
      finishNode
    ) ||
    startCellRow % 2 === 0
  ) {
    startCellRow = generateRandomNumber(1, height - 1);
    startCellCol = generateRandomNumber(1, width - 1);
  }
  return { row: startCellRow, col: startCellRow };
}

export function getRandomDirection(currentDirections) {
  const options = [];
  for (const key of currentDirections.keys()) {
    options.push(key);
  }
  const randomIndex = generateRandomNumber(0, options.length - 1);
  return options[randomIndex];
}
