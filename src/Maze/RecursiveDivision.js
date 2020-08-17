const HORIZONTAL = "HORIZONTAL";
const VERTICAL = "VERTICAL";
// currentHeight = col, currentWidth = row

export async function GenerateRecursiveDivisionMaze(
  grid,
  StartNode,
  FinishNode
) {
  let height = grid.length;
  let width = grid[0].length;

  let wallNodes = [];
  // first fill up all the sides with walls
  generateSideWalls(wallNodes, StartNode, FinishNode, width, height);

  await divide(wallNodes, 0, 0, width - 2, height - 2, HORIZONTAL);
  return wallNodes;
}

async function divide(wallNodes, row, col, width, height, direction) {
  if (width <= 2 || height <= 2) return;
  console.log(width, height, direction, row, col);
  let vertical = direction === VERTICAL;

  // start position of the wall, change col and row?
  let wallPositionCol = vertical
    ? generateRandomNumber(col + 1, width - 1)
    : col;
  let wallPositionRow = vertical
    ? row
    : generateRandomNumber(row + 1, height - 1);

  // passage in the wall
  let passageRow = vertical
    ? generateRandomNumber(row, height - 1)
    : wallPositionRow;

  let passageCol = vertical
    ? wallPositionCol
    : generateRandomNumber(col, width - 1);

  // direction of wall
  let directionCol = vertical ? 0 : 1;
  let directionRow = vertical ? 1 : 0;

  // how long will the wall be
  let length = vertical ? height : width;

  // build the wall
  for (let i = 0; i < length; i++) {
    let row = wallPositionRow + directionRow * i;
    let col = wallPositionCol + directionCol * i;

    // make everything a wall except the designated passage
    if (passageRow !== row || passageCol !== col) {
      let node = {
        row: row,
        col: col,
      };
      wallNodes.push(node);
    }
  }

  let nextHeight = vertical ? height : wallPositionRow;
  let nextWidth = vertical ? wallPositionCol : width;
  let nextDirectionToSlice = getDirectionToSlice(nextWidth, nextHeight);
  let nextRow = row;
  let nextCol = col;

  // recurse for the left and top side of the wall:
  setTimeout(() => {
    divide(
      wallNodes,
      nextRow,
      nextCol,
      nextWidth,
      nextHeight,
      nextDirectionToSlice
    );
  }, 5);

  // recurse right or bottom
  let nextHeight2 = vertical ? height : height - wallPositionRow;
  let nextWidth2 = vertical ? width - wallPositionCol : width;
  let nextDirectionToSlice2 = getDirectionToSlice(nextWidth2, nextHeight2);
  let nextCol2 = vertical ? wallPositionCol : col;
  let nextRow2 = vertical ? row : wallPositionRow;

  // recurse for the right and bottom side of the wall:
  setTimeout(() => {
    divide(
      wallNodes,
      nextRow2,
      nextCol2,
      nextWidth2,
      nextHeight2,
      nextDirectionToSlice2
    );
  }, 5);
}

function getDirectionToSlice(width, height) {
  if (width > height) {
    return VERTICAL;
  } else if (height > width) {
    return HORIZONTAL;
  } else {
    return generateRandomNumber(0, 1) == 0 ? HORIZONTAL : VERTICAL;
  }
}

// Generate a random number netween lowNum and highNum
function generateRandomNumber(lowNum, highNum) {
  let ans = Math.floor(Math.random() * (highNum - lowNum + 1)) + lowNum;
  return ans;
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
