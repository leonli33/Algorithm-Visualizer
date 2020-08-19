import {
  generateSideWalls,
  generateRandomNumber,
} from "../Functions/functions";

export function HorizontalWalls(grid, StartNode, FinishNode) {
  let height = grid.length;
  let width = grid[0].length;
  let wallNodes = [];
  // first fill up all the sides with walls
  generateSideWalls(wallNodes, StartNode, FinishNode, width, height);
  for (let i = 1; i < height - 2; i++) {
    for (let j = 1; j < width - 1; j++) {
      if (i % 2 == 0) {
        let num = generateRandomNumber(0, 7);
        if (num >= 1) {
          wallNodes.push({ row: i, col: j });
        }
      }
    }
  }
  return wallNodes;
}
