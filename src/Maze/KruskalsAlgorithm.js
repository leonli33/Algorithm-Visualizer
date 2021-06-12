import {
  checkCellInBounds,
  generateRandomNumber,
  createNewDirectionMap,
  getRandomDirection,
} from "../Functions/functions";

export function KruskalsAlgorithm(grid) {
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

  // This will map a string (node) to its set that it belongs to
  const currentSets = new Map();
  // This will map a cell to all of the directions it has yet to explore
  const currentCellDirections = new Map();
  // Array that contains all of the cells
  const allCells = [];
  // Add each node to its own set
  for (let i = 0; i < height; i++) {
    if (i % 2 === 0) continue;
    for (let j = 0; j < width; j++) {
      if (j % 2 === 0) continue;
      const cell = `${i}:${j}`;
      const set = new Set();
      set.add(cell);
      currentSets.set(cell, set);
      currentCellDirections.set(cell, createNewDirectionMap());
      allCells.push(cell);
    }
  }
  while (allCells.length !== 0) {
    const randomCellIndex = generateRandomNumber(0, allCells.length - 1);
    const currentCell = allCells[randomCellIndex];
    // Get a random direction to explore
    const currentDirections = currentCellDirections.get(currentCell);
    const directionToExplore = getRandomDirection(currentDirections);
    const directionObject = currentDirections.get(directionToExplore);
    currentDirections.delete(directionToExplore);
    if (currentDirections.size === 0) {
      allCells.splice(randomCellIndex, 1);
    }
    const places = currentCell.split(":");
    const currentRow = parseInt(places[0]);
    const currentCol = parseInt(places[1]);
    const neighbor = {
      row: parseInt(places[0]) + directionObject.row,
      col: parseInt(places[1]) + directionObject.col,
    };
    // if the neighboring cell is out of bounds, then continue
    if (!checkCellInBounds(neighbor, height, width)) continue;
    const currentCellSet = currentSets.get(currentCell);
    // if the cells are already in the same set, then continue
    const neighborStringified = `${neighbor.row}:${neighbor.col}`;
    if (currentCellSet.has(neighborStringified)) {
      continue;
    }
    // if they are in different sets, then merge the sets together
    const neighborCellSet = currentSets.get(neighborStringified);
    const mergedSet = mergeTwoSets(currentCellSet, neighborCellSet);
    for (const element of currentCellSet) {
      currentSets.set(element, mergedSet);
    }
    for (const element of neighborCellSet) {
      currentSets.set(element, mergedSet);
    }
    const middleNodeRow = Math.floor((neighbor.row + parseInt(places[0])) / 2);
    const middleNodeCol = Math.floor((neighbor.col + parseInt(places[1])) / 2);
    if (cellMap[middleNodeRow][middleNodeCol] !== 0) {
      passageCellAnimations.push({ row: middleNodeRow, col: middleNodeCol });
    }
    if (cellMap[parseInt(places[0])][parseInt(places[1])] !== 0) {
      passageCellAnimations.push({
        row: parseInt(places[0]),
        col: parseInt(places[1]),
      });
    }
    if (cellMap[neighbor.row][neighbor.col] !== 0) {
      passageCellAnimations.push({ row: neighbor.row, col: neighbor.col });
    }
    cellMap[middleNodeRow][middleNodeCol] = 0;
    cellMap[parseInt(places[0])][parseInt(places[1])] = 0;
    cellMap[neighbor.row][neighbor.col] = 0;
  }
  return passageCellAnimations;
}

function mergeTwoSets(set1, set2) {
  const mergedSet = new Set();
  for (const el of set1) {
    mergedSet.add(el);
  }
  for (const el of set2) {
    mergedSet.add(el);
  }
  return mergedSet;
}
