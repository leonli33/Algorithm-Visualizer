import {
  generateSideWalls,
  generateRandomNumber,
} from "../Functions/functions";

export function RandomMaze(grid, StartNode, FinishNode) {
  let height = grid.length;
  let width = grid[0].length;
  let wallNodes = [];
  // first fill up all the sides with walls
  generateSideWalls(wallNodes, StartNode, FinishNode, width, height);
  for (let i = 1; i < height; i++) {
    for (let j = 1; j < width; j++) {
      let num = generateRandomNumber(0, 2);
      if (num < 1) {
        wallNodes.push({ row: i, col: j });
      }
    }
  }
  return wallNodes;
}
