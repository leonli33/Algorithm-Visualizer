import React from "react";
import { generateRandomNumber } from "../Functions/functions";

export function RecursiveDivision(grid) {
  const width = grid[0].length;
  const height = grid.length;
  const wallAnimations = [];
  divide(wallAnimations, 0, width - 1, height - 1, 0, grid);
  return wallAnimations;
}

const cellIsInbounds = (cell, height, width) => {
  return (
    cell.row >= 1 && cell.row < height && cell.col >= 1 && cell.col < width
  );
};

function divide(
  wallAnimations,
  topRightRow,
  topRightCol,
  bottomLeftRow,
  bottomLeftCol,
  grid
) {
  const width = Math.abs(topRightCol - bottomLeftCol);
  const height = Math.abs(bottomLeftRow - topRightRow);
  if (width <= 1 || height <= 1) return;
  const buildHorizontalWall = width < height;
  let startingCol;
  let startingRow;
  if (buildHorizontalWall) {
    // startingRow = generateRandomNumber(topRightRow + 1, bottomLeftRow - 1);
    startingRow = generateRandomNumber(topRightRow + 1, bottomLeftRow - 1);
    startingCol = bottomLeftCol;
  } else {
    // startingCol = generateRandomNumber(bottomLeftCol + 1, topRightCol - 1);
    startingCol = generateRandomNumber(bottomLeftCol + 1, topRightCol - 1);
    startingRow = topRightRow;
  }

  // make the walls
  if (buildHorizontalWall) {
    const passageIndex = generateRandomNumber(
      startingCol,
      startingCol + width - 1
    );
    for (let i = startingCol; i <= startingCol + width; i++) {
      const inBounds = cellIsInbounds(
        { row: startingRow, col: i },
        grid.length,
        grid[0].length
      );
      if (i === passageIndex || false) {
        continue;
      }
      wallAnimations.push({ row: startingRow, col: i });
    }
    // recurse on the up and down sides
    // top
    divide(
      wallAnimations,
      topRightRow,
      topRightCol,
      startingRow - 1,
      bottomLeftCol,
      grid
    );
    // bottom
    divide(
      wallAnimations,
      startingRow + 1,
      topRightCol,
      bottomLeftRow,
      bottomLeftCol,
      grid
    );
  } else {
    const passageIndex = generateRandomNumber(
      startingRow,
      startingRow + height - 1
    );
    for (let i = startingRow; i <= startingRow + height; i = i + 1) {
      const inBounds = cellIsInbounds(
        { row: i, col: startingCol },
        grid.length,
        grid[0].length
      );
      if (i === passageIndex || !inBounds) {
        continue;
      }

      wallAnimations.push({ row: i, col: startingCol });
    }
    // left
    divide(
      wallAnimations,
      topRightRow,
      startingCol - 1,
      bottomLeftRow,
      bottomLeftCol,
      grid
    );
    // right
    divide(
      wallAnimations,
      topRightRow,
      topRightCol,
      bottomLeftRow,
      startingCol + 1,
      grid
    );
  }
}
