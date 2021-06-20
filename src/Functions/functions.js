function pathNodeInbounds(currentNode, length, height) {
  const { row, col } = currentNode;
  return row >= 0 && col >= 0 && row < height && col < length;
}

export function getNeighbors(currentNode, grid, length, height) {
  // 34, 73
  let neighbors = [];
  let row = currentNode.row;
  let col = currentNode.col;
  const north = { row: -1, col: 0 };
  const east = { row: 0, col: 1 };
  const south = { row: 1, col: 0 };
  const west = { row: 0, col: -1 };
  const northNode = { row: row + north.row, col: col + north.col };
  const eastNode = { row: row + east.row, col: col + east.col };
  const southNode = { row: row + south.row, col: col + south.col };
  const westNode = { row: row + west.row, col: col + west.col };
  if (pathNodeInbounds(westNode, length, height)) {
    neighbors.push(grid[westNode.row][westNode.col]);
  }
  if (pathNodeInbounds(southNode, length, height)) {
    neighbors.push(grid[southNode.row][southNode.col]);
  }
  if (pathNodeInbounds(eastNode, length, height)) {
    neighbors.push(grid[eastNode.row][eastNode.col]);
  }
  if (pathNodeInbounds(northNode, length, height)) {
    neighbors.push(grid[northNode.row][northNode.col]);
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
