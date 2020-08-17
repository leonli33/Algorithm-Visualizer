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

// Generate a random number netween lowNum and highNum
function generateRandomNumber(lowNum, highNum) {
  return Math.floor(Math.random() * (highNum - lowNum + 1)) + lowNum;
}

function generateSideWalls(wallNodes, StartNode, FinishNode, width, height) {
  // left side
  for (let row = 0; row < height; row++) {
    if (
      (row !== StartNode.row || StartNode.col !== 0) &&
      (row !== FinishNode.row || FinishNode.col !== 0)
    ) {
      let node = {
        row: row,
        col: 0,
      };
      wallNodes.push(node);
    }
  }

  // top side
  for (let col = 0; col < width; col++) {
    if (
      (col !== StartNode.col || StartNode.row !== 0) &&
      (col !== FinishNode.col || FinishNode.row !== 0)
    ) {
      let node = {
        row: 0,
        col: col,
      };
      wallNodes.push(node);
    }
  }

  //right side
  for (let row = 0; row < height; row++) {
    if (
      (row !== StartNode.row || StartNode.col !== width - 1) &&
      (row !== FinishNode.row || FinishNode.col !== width - 1)
    ) {
      let node = {
        row: row,
        col: width - 1,
      };
      wallNodes.push(node);
    }
  }

  // bottom side
  for (let col = 0; col < width; col++) {
    if (
      (col !== StartNode.row || StartNode.col !== height - 1) &&
      (col !== FinishNode.row || FinishNode.col !== height - 1)
    ) {
      let node = {
        row: height - 1,
        col: col,
      };
      wallNodes.push(node);
    }
  }
}
