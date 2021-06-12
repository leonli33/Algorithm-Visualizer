import React from "react";
import {
  generateRandomNumber,
  checkCellInBounds,
  createNewDirectionMap,
} from "../Functions/functions";

export const MAZE_TYPE = "MAZE_TYPE";
export const EXPLORE_TYPE = "EXPLORE_TYPE";
export const WALL_TYPE = "WALL_TYPE";

export function WilsonsAlgorithm(grid) {
  let height = grid.length;
  let width = grid[0].length;
  const directions = createNewDirectionMap();
  // map representing the current state of all of the grids.
  // 0: passage, 1: wall
  const cellMap = [];
  const allPossibleCells = new Set();
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(1);
      if (i % 2 !== 0 && j % 2 !== 0) {
        allPossibleCells.add(`${i}:${j}`);
      }
    }
    cellMap.push(row);
  }
  const animations = [];
  const cellsInMaze = new Set();
  cellsInMaze.add(`${1}:${1}`);
  cellsInMaze.add(`${1}:${2}`);
  cellsInMaze.add(`${1}:${3}`);
  allPossibleCells.delete(`${1}:${1}`);
  allPossibleCells.delete(`${1}:${2}`);
  allPossibleCells.delete(`${1}:${3}`);

  const beginningAnimationsArr = [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ];
  animations.push(getCellAnimations(beginningAnimationsArr, MAZE_TYPE));

  while (allPossibleCells.size !== 0) {
    const randomCell = getRandomCellToBeExplored(allPossibleCells);
    animations.push(getCellAnimations([randomCell], EXPLORE_TYPE));
    const currentPath = [];
    const cellsInPath = new Set();

    currentPath.push(randomCell);
    cellsInPath.add(`${randomCell.row}:${randomCell.col}`);
    let previousDirection = null;

    while (true) {
      const currentCell = currentPath[currentPath.length - 1];
      const currentDirection = getRandomDirection(
        previousDirection,
        currentCell,
        directions,
        height,
        width
      );
      const directionObject = directions.get(currentDirection);
      const nextCell = {
        row: currentCell.row + directionObject.row,
        col: currentCell.col + directionObject.col,
      };
      const nextCellStringified = `${nextCell.row}:${nextCell.col}`;
      // Check to see if the next cell is in the maze or is currently part of the path
      if (cellsInMaze.has(nextCellStringified)) {
        // remove the cells in the current path from the cells that are not in the maze
        for (const cell of currentPath) {
          const cellStringified = `${cell.row}:${cell.col}`;
          allPossibleCells.delete(cellStringified);
          cellsInMaze.add(cellStringified);
        }
        // animate
        const path = getFullPath(currentPath, false);
        path.push(getMiddleCell(currentCell, nextCell));
        const animationObject = getCellAnimations(path, MAZE_TYPE);
        animations.push(animationObject);
        break;
      } else if (cellsInPath.has(nextCellStringified)) {
        const middleCell = getMiddleCell(currentCell, nextCell);
        animations.push(getCellAnimations([middleCell], EXPLORE_TYPE));
        const index = currentPath.findIndex(
          (el) => el.row === nextCell.row && el.col === nextCell.col
        );
        const loop = currentPath.slice(index + 1);
        const path = getFullPath([currentPath[index], ...loop], true);
        const animationObject = getCellAnimations(
          [middleCell, ...path],
          WALL_TYPE
        );
        animations.push(animationObject);
        if (index === 0) {
          animations.push(getCellAnimations([currentPath[0]], WALL_TYPE));
          break;
        }
        currentPath.splice(index + 1);
        for (const cell of loop) {
          const cellStringified = `${cell.row}:${cell.col}`;
          cellsInPath.delete(cellStringified);
        }
        previousDirection =
          index === 1 ? null : getPreviousDirection(currentPath);
      } else {
        // cell is neither in the maze or in the current path
        currentPath.push(nextCell);
        cellsInPath.add(`${nextCell.row}:${nextCell.col}`);
        const middleCell = getMiddleCell(currentCell, nextCell);
        const animationObject = getCellAnimations(
          [middleCell, nextCell],
          EXPLORE_TYPE
        );
        animations.push(animationObject);
        previousDirection = currentDirection;
      }
    }
  }
  return animations;
}

function getPreviousDirection(cellArr) {
  const cell1 = cellArr[cellArr.length - 1];
  const cell2 = cellArr[cellArr.length - 2];
  if (cell1.row < cell2.row) {
    return "NORTH";
  } else if (cell1.row > cell2.row) {
    return "SOUTH";
  } else if (cell1.col < cell2.col) {
    return "WEST";
  } else {
    return "EAST";
  }
}

function getFullPath(cellArray, isLoopPath) {
  const path = [];
  for (let i = 0; i < cellArray.length - 1; i++) {
    const currentCell = cellArray[i];
    const nextCell = cellArray[i + 1];
    const middleCell = getMiddleCell(currentCell, nextCell);
    path.push(middleCell);
    if (i === 0 && isLoopPath) continue;
    path.push(currentCell);
  }
  path.push(cellArray[cellArray.length - 1]);
  return path;
}

function getCellAnimations(cellArray, type) {
  const animationObj = {
    animations: cellArray,
    animationType: type,
  };
  return animationObj;
}

function getMiddleCell(cell1, cell2) {
  const middleNodeRow = Math.floor((cell1.row + cell2.row) / 2);
  const middleNodeCol = Math.floor((cell1.col + cell2.col) / 2);
  return {
    row: middleNodeRow,
    col: middleNodeCol,
  };
}

/*
  The direction returned will give a valid neighbor and also will not be the same direction that the
  path has previously come from
*/
function getRandomDirection(
  currentDirection,
  currentCell,
  directions,
  height,
  width
) {
  const options = ["NORTH", "SOUTH", "WEST", "EAST"];
  const oppositeDirections = new Map();
  oppositeDirections.set("NORTH", "SOUTH");
  oppositeDirections.set("SOUTH", "NORTH");
  oppositeDirections.set("EAST", "WEST");
  oppositeDirections.set("WEST", "EAST");
  let direction = options[generateRandomNumber(0, options.length - 1)];
  while (
    direction === oppositeDirections.get(currentDirection) ||
    !checkCellInBounds(
      {
        row: currentCell.row + directions.get(direction).row,
        col: currentCell.col + directions.get(direction).col,
      },
      height,
      width
    )
  ) {
    direction = options[generateRandomNumber(0, options.length - 1)];
  }
  return direction;
}

function getRandomCellToBeExplored(allPossibleCells) {
  const allCellsArr = Array.from(allPossibleCells);
  let randomIndex = generateRandomNumber(0, allCellsArr.length - 1);
  let cellPlacement = allCellsArr[randomIndex].split(":");
  let cellRow = parseInt(cellPlacement[0]);
  let cellCol = parseInt(cellPlacement[1]);
  return { row: cellRow, col: cellCol };
}
