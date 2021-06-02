import { generateRandomNumber } from "../Functions/functions";

export function RecursiveBacktracking(grid, startNode, finishNode) {
  let height = grid.length;
  let width = grid[0].length;
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
  // map representing the current state of all of the grids.
  // 0: passage, 1: wall
  const cellMap = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(1);
    }
    cellMap.push(row);
  }
  const passageCellAnimations = [];

  const startCell = getStartCell(startNode, finishNode);
  cellMap[startCell.row][startCell.col] = 0;
  const stack = [];
  stack.push({ cell: startCell, directions: new Map(directions) });
  while (stack.length > 0) {
    const currentCellData = stack[stack.length - 1];
    const cell = currentCellData.cell;
    passageCellAnimations.push({ row: cell.row, col: cell.col });
    const currentDirections = currentCellData.directions;
    if (currentDirections.size === 0) {
      stack.pop();
      continue;
    }
    const direction = getRandomDirection(directions);
    currentCellData.remove(direction);
    const neighbor = {
      row: cell.row + direction.row,
      col: cell.col + direction.col,
    };
    if (
      !checkCellInBounds(neighbor, height, width) ||
      cellMap[neighbor.row][neighbor.col] === 1
    ) {
      continue;
    }
    stack.push({ cell: neighbor, directions: new Map(directions) });
  }
  return passageCellAnimations;
}

function getRandomDirection(currentDirections) {
  const options = [];
  for (const key of currentDirections.keys()) {
    options.push(key);
  }
  const randomIndex = generateRandomNumber(0, options.length - 1);
  return options[randomIndex];
}

function Recurse(stack, directions, currentDirections, passageCellAnimations) {}

function getStartCell(startNode, finishNode) {
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

function isStartOrEndNode(currentNode, startNode, finishNode) {
  return (
    (currentNode.col === startNode.col && currentNode.row === startNode.row) ||
    (currentNode.col === finishNode.col && currentNode.row === finishNode.row)
  );
}

function checkCellInBounds(cell, height, width) {
  return (
    cell.row >= 1 && cell.row < height && cell.col >= 1 && cell.col < width
  );
}
