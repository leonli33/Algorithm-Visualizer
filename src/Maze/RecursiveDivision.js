const HORIZONTAL = "HORIZONTAL";
const VERTICAL = "VERTICAL";
// currentHeight = col, currentWidth = row

// This is not ready for production yet

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

  let currentGrid = [];
  for (let i = 0; i < height - 2; i++) {
    let row = [];
    for (let j = 0; j < width - 2; j++) {
      row.push("");
    }
    currentGrid.push(row);
  }

  await divide(wallNodes, 1, 1, width - 2, height - 2, HORIZONTAL, currentGrid);
  return wallNodes;
}

async function divide(wallNodes, x, y, width, height, direction, currentGrid) {
  if (width < 3 || height < 3) return;
  let horizontal = direction === HORIZONTAL;
  let positionOkay = false;

  let wallPositionX;
  let wallPositionY;
  let passageX;
  let passageY;
  let directionX;
  let directionY;
  let length;
  while (!positionOkay) {
    wallPositionX = x + (horizontal ? 0 : generateRandomNumber(0, width - 1));
    wallPositionY = y + (horizontal ? generateRandomNumber(0, height - 1) : 0);

    // passage in the wall
    passageX =
      wallPositionX + (horizontal ? generateRandomNumber(0, width) : 0);

    passageY =
      wallPositionY + (horizontal ? 0 : generateRandomNumber(0, height));

    // direction of wall
    directionX = horizontal ? 1 : 0;
    directionY = horizontal ? 0 : 1;

    // how long will the wall be
    length = horizontal ? width : height;

    let allClear = true;
    /*
    //check that there are no improper walls next to current
    for (let i = 1; i <= length; i++) {
      let posy = wallPositionY + directionY * i;
      let posx = wallPositionX + directionX * i;
      if (
        !checkGridForWallsAround(direction, posx - 1, posy - 1, currentGrid)
      ) {
        allClear = false;
      }
    }
    */

    positionOkay = allClear;
  }

  // build the wall
  for (let i = 1; i <= length; i++) {
    wallPositionY += directionY;
    wallPositionX += directionX;
    let posy = wallPositionY;
    let posx = wallPositionX;
    // make everything a wall except the designated passage
    if (passageX !== x || passageY !== y) {
      let node = {
        row: posy,
        col: posx,
      };
      wallNodes.push(node);
    }
  }

  let nextHeight = horizontal ? wallPositionY - y + 1 : height;
  let nextWidth = horizontal ? width : wallPositionX - x + 1;
  let nextDirectionToSlice = getDirectionToSlice(nextWidth, nextHeight);
  let nextX = x;
  let nextY = y;

  // recurse for the left and top side of the wall:
  divide(wallNodes, nextX, nextY, nextWidth, nextHeight, nextDirectionToSlice);

  // recurse right or bottom
  let nextX2 = horizontal ? x : wallPositionX + 1;
  let nextY2 = horizontal ? wallPositionY + 1 : y;

  let nextHeight2 = horizontal ? y + height - wallPositionY - 1 : height;
  let nextWidth2 = horizontal ? width : x + width - wallPositionX - 1;
  let nextDirectionToSlice2 = getDirectionToSlice(nextWidth2, nextHeight2);

  // recurse for the right and bottom side of the wall:
  divide(
    wallNodes,
    nextX2,
    nextY2,
    nextWidth2,
    nextHeight2,
    nextDirectionToSlice2
  );
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

function checkGridForWallsAround(direction, x, y, totalGrid) {
  if (direction === HORIZONTAL) {
    if (isOnGrid(y, x, totalGrid)) {
      console.log("helo");
    }
  } else {
  }
}

function isOnGrid(x, y, grid) {
  if(grid[y]) {
    if(grid[y][x]) {
      return true;
    }
  }
  return false;
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
