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
  const startCell = { row: startCellRow, col: startCellRow };
  cellMap[startCell.row][startCell.col] = 0;
  let currentFrontierCells = getSurroundingCells(startCell, cellMap, false);
  const firstIterationAnimation = {
    selectedNode: startCell,
    frontierNodes: [...currentFrontierCells],
    newPassageCells: [startCell],
  };
  passageCellAnimations.push(firstIterationAnimation);
  passageCellAnimations.push(firstIterationAnimation);
  while (currentFrontierCells.length > 0) {
    const iterationAnimation = {
      selectedNode: null,
      frontierNodes: [],
      newPassageCells: [],
    };
    const randomFrontierCellIndex = generateRandomNumber(
      0,
      currentFrontierCells.length - 1
    );
    const frontierCell = currentFrontierCells[randomFrontierCellIndex];
    iterationAnimation.selectedNode = frontierCell;

    if (cellMap[frontierCell.row][frontierCell.col] === 0) {
      currentFrontierCells.splice(randomFrontierCellIndex, 1);
      continue;
    }
    // get the neighbors of the frontier cell
    const neighbors = getSurroundingCells(frontierCell, cellMap, true);
    iterationAnimation.frontierNodes = neighbors;

    if (neighbors.length > 0) {
      // cut divider between current frontier cell and neighbor
      const randomNeighborIndex = generateRandomNumber(0, neighbors.length - 1);
      const neighbor = neighbors[randomNeighborIndex];
      const neighborRow = neighbor.row;
      const neighborCol = neighbor.col;
      const middleNodeRow = Math.floor((neighborRow + frontierCell.row) / 2);
      const middleNodeCol = Math.floor((neighborCol + frontierCell.col) / 2);
      cellMap[middleNodeRow][middleNodeCol] = 0;
      const neighborSelectedNode = { row: middleNodeRow, col: middleNodeCol };
      iterationAnimation.newPassageCells.push(neighborSelectedNode);
    }
    // remove the frontier cell from the frontier list
    cellMap[frontierCell.row][frontierCell.col] = 0;
    currentFrontierCells.splice(randomFrontierCellIndex, 1);
    if (!isStartOrEndNode(frontierCell, startNode, finishNode)) {
      iterationAnimation.newPassageCells.push(frontierCell);
    }

    // compute next frontierCells and add them into the list
    const newFrontierCells = getSurroundingCells(frontierCell, cellMap, false);
    currentFrontierCells = currentFrontierCells.concat(newFrontierCells);
    passageCellAnimations.push(iterationAnimation);
    passageCellAnimations.push(iterationAnimation);
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
