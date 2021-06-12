import {
  checkCellInBounds,
  createNewDirectionMap,
  getStartCell,
  getRandomDirection,
} from "../Functions/functions";

export function RecursiveBacktracking(grid, startNode, finishNode) {
  let height = grid.length;
  let width = grid[0].length;
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
  const visitedCells = new Set();

  const startCell = getStartCell(startNode, finishNode, height, width);
  cellMap[startCell.row][startCell.col] = 0;
  visitedCells.add(`${startCell.row}:${startCell.col}`);
  const stack = [];
  stack.push({
    cell: startCell,
    directions: createNewDirectionMap(),
    backtrack: false,
  });
  while (stack.length > 0) {
    const currentCellData = stack[stack.length - 1];
    const cell = currentCellData.cell;
    cellMap[cell.row][cell.col] = 0;
    const currentDirections = currentCellData.directions;
    if (currentDirections.size === 0) {
      passageCellAnimations.push({ ...cell, backtrack: true });
      stack.pop();
      if (stack.length !== 0) {
        const nextCell = stack[stack.length - 1].cell;
        const middleNodeRow = Math.floor((nextCell.row + cell.row) / 2);
        const middleNodeCol = Math.floor((nextCell.col + cell.col) / 2);
        passageCellAnimations.push({
          row: middleNodeRow,
          col: middleNodeCol,
          backtrack: true,
        });
      }
      continue;
    }
    passageCellAnimations.push({ ...cell, backtrack: false });
    const direction = getRandomDirection(currentDirections);
    const directionMovements = currentDirections.get(direction);
    currentDirections.delete(direction);
    // we need to remove the cell in the middle as well
    const neighbor = {
      row: cell.row + directionMovements.row,
      col: cell.col + directionMovements.col,
    };
    const shouldSkipCell =
      !checkCellInBounds(neighbor, height, width) ||
      cellMap[neighbor.row][neighbor.col] === 0 ||
      visitedCells.has(`${neighbor.row}:${neighbor.col}`);
    if (shouldSkipCell) {
      continue;
    }
    // make cell inbetween a passage as well
    const middleNodeRow = Math.floor((neighbor.row + cell.row) / 2);
    const middleNodeCol = Math.floor((neighbor.col + cell.col) / 2);
    cellMap[middleNodeRow][middleNodeCol] = 0;
    passageCellAnimations.push({
      row: middleNodeRow,
      col: middleNodeCol,
      backtrack: false,
    });
    stack.push({
      cell: neighbor,
      directions: createNewDirectionMap(),
    });
    visitedCells.add(`${neighbor.row}:${neighbor.col}`);
  }
  return passageCellAnimations;
}
