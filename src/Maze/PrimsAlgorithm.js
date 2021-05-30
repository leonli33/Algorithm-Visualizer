import { generateRandomNumber } from "../Functions/functions";
const directions = [
  {
    row: -2,
    col: 0,
  },
  {
    row: 2,
    col: 0,
  },
  {
    row: 0,
    col: 2,
  },
  {
    row: 0,
    col: -2,
  },
];

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
  let currentFrontierCells = getSurroundingCells(startCell, cellMap, false);
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
    const neighbors = getSurroundingCells(frontierCell, cellMap, true);
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
    const newFrontierCells = getSurroundingCells(frontierCell, cellMap, false);
    currentFrontierCells = currentFrontierCells.concat(newFrontierCells);
  }
  return passageCellAnimations;
}

function getSurroundingCells(currentCell, cellMap, isPath) {
  const frontierCells = [];
  const currentRow = currentCell.row;
  const currentCol = currentCell.col;
  const height = cellMap.length;
  const width = cellMap[0].length;
  const numericalIsPath = isPath ? 0 : 1;

  for (const direction of directions) {
    const currentFrontierCell = {
      row: currentRow + direction.row,
      col: currentCol + direction.col,
    };
    const cellIsInbounds = checkCellInBounds(
      currentFrontierCell,
      height,
      width
    );
    if (
      cellIsInbounds &&
      cellMap[currentFrontierCell.row][currentFrontierCell.col] ===
        numericalIsPath
    ) {
      frontierCells.push(currentFrontierCell);
    }
  }
  return frontierCells;
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
