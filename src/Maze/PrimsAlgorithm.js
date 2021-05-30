import { generateRandomNumber } from "../Functions/functions";
const NORTH = {
  row: -2,
  col: 0,
};
const SOUTH = {
  row: 2,
  col: 0,
};
const EAST = {
  row: 0,
  col: 2,
};
const WEST = {
  row: 0,
  col: -2,
};

export function PrimsAlgorithm(grid, startNode, finishNode) {
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
  const startCell = { row: 1, col: 1 };
  cellMap[1][1] = 0;
  passageCellAnimations.push(startCell);
  let currentFrontierCells = getFrontierCells(startCell, cellMap);
  while (currentFrontierCells.length > 0) {
    const randomFrontierCellIndex = generateRandomNumber(
      0,
      currentFrontierCells.length - 1
    );
    const frontierCell = currentFrontierCells[randomFrontierCellIndex];
    if (cellMap[frontierCell.row][frontierCell.col] === 0) {
      currentFrontierCells.splice(randomFrontierCellIndex, 1);
      continue;
    }
    // get the neighbors of the frontier cell
    const neighbors = getFrontierCellNeighbors(frontierCell, cellMap);
    if (neighbors.length > 0) {
      // cut divider between current frontier cell and neighbor
      const randomNeighborIndex = generateRandomNumber(0, neighbors.length - 1);
      const neighbor = neighbors[randomNeighborIndex];
      const neighborRow = neighbor.row;
      const neighborCol = neighbor.col;
      const middleNodeRow = Math.floor((neighborRow + frontierCell.row) / 2);
      const middleNodeCol = Math.floor((neighborCol + frontierCell.col) / 2);
      cellMap[middleNodeRow][middleNodeCol] = 0;
      passageCellAnimations.push({ row: middleNodeRow, col: middleNodeCol });
    }
    // remove the frontier cell from the frontier list
    cellMap[frontierCell.row][frontierCell.col] = 0;
    currentFrontierCells.splice(randomFrontierCellIndex, 1);
    if (!isStartOrEndNode(frontierCell, startNode, finishNode)) {
      passageCellAnimations.push(frontierCell);
    }

    // compute next frontierCells and add them into the list
    const newFrontierCells = getFrontierCells(frontierCell, cellMap);
    currentFrontierCells = currentFrontierCells.concat(newFrontierCells);
  }
  return passageCellAnimations;
}

function isStartOrEndNode(currentNode, startNode, finishNode) {
  return (
    (currentNode.col === startNode.col && currentNode.row === startNode.row) ||
    (currentNode.col === finishNode.col && currentNode.row === finishNode.row)
  );
}

function getFrontierCellNeighbors(currentCell, cellMap) {
  const neighborCells = [];
  const currentRow = currentCell.row;
  const currentCol = currentCell.col;
  const width = cellMap[0].length;
  const height = cellMap.length;
  if (
    checkCellInBounds({ ...currentCell, row: currentRow + 2 }, height, width) &&
    cellMap[currentRow + 2][currentCol] === 0
  ) {
    neighborCells.push({ row: currentRow + 2, col: currentCol });
  }
  if (
    checkCellInBounds({ ...currentCell, row: currentRow - 2 }, height, width) &&
    cellMap[currentRow - 2][currentCol] === 0
  ) {
    neighborCells.push({ row: currentRow - 2, col: currentCol });
  }
  if (
    checkCellInBounds({ ...currentCell, col: currentCol + 2 }, height, width) &&
    cellMap[currentRow][currentCol + 2] === 0
  ) {
    neighborCells.push({ row: currentRow, col: currentCol + 2 });
  }
  if (
    checkCellInBounds({ ...currentCell, col: currentCol - 2 }, height, width) &&
    cellMap[currentRow][currentCol - 2] === 0
  ) {
    neighborCells.push({ row: currentRow, col: currentCol - 2 });
  }
  return neighborCells;
}

function getFrontierCells(currentCell, cellMap) {
  const frontierCells = [];
  const currentRow = currentCell.row;
  const currentCol = currentCell.col;
  let height = cellMap.length;
  let width = cellMap[0].length;

  const northernFrontierCell = {
    row: currentRow + NORTH.row,
    col: currentCol + NORTH.col,
  };
  const southernFrontierCell = {
    row: currentRow + SOUTH.row,
    col: currentCol + SOUTH.col,
  };
  const westernFrontierCell = {
    row: currentRow + WEST.row,
    col: currentCol + WEST.col,
  };
  const easternFrontierCell = {
    row: currentRow + EAST.row,
    col: currentCol + EAST.col,
  };

  const northernFrontierInbounds = checkCellInBounds(
    northernFrontierCell,
    height,
    width
  );
  const southernFrontierInbounds = checkCellInBounds(
    southernFrontierCell,
    height,
    width
  );
  const easternFrontierInbounds = checkCellInBounds(
    easternFrontierCell,
    height,
    width
  );
  const westernFrontierInbounds = checkCellInBounds(
    westernFrontierCell,
    height,
    width
  );
  if (
    northernFrontierInbounds &&
    cellMap[northernFrontierCell.row][northernFrontierCell.col] === 1
  ) {
    frontierCells.push(northernFrontierCell);
  }
  if (
    southernFrontierInbounds &&
    cellMap[southernFrontierCell.row][southernFrontierCell.col] === 1
  ) {
    frontierCells.push(southernFrontierCell);
  }
  if (
    easternFrontierInbounds &&
    cellMap[easternFrontierCell.row][easternFrontierCell.col] === 1
  ) {
    frontierCells.push(easternFrontierCell);
  }
  if (
    westernFrontierInbounds &&
    cellMap[westernFrontierCell.row][westernFrontierCell.col] === 1
  ) {
    frontierCells.push(westernFrontierCell);
  }
  return frontierCells;
}

function checkCellInBounds(cell, height, width) {
  return (
    cell.row >= 1 && cell.row < height && cell.col >= 1 && cell.col < width
  );
}
