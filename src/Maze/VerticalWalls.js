import {
  generateSideWalls,
  generateRandomNumber,
} from "../Functions/functions";

export function VerticalWalls(grid, StartNode, FinishNode) {
  let height = grid.length;
  let width = grid[0].length;
  let wallNodes = [];
  // first fill up all the sides with walls
  generateSideWalls(wallNodes, StartNode, FinishNode, width, height);
  for (let i = 1; i < width - 2; i++) {
    for (let j = 1; j < height; j++) {
      if (i % 2 == 0) {
        let num = generateRandomNumber(0, 7);
        if (num >= 1) {
          wallNodes.push({ row: j, col: i });
        }
      }
    }
  }
  return wallNodes;
}
