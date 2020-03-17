let grid;

function generate(dimensions, numDoors) {
  //numDoors is unused right now

  grid = new Array();
  for (let  i = 0; i < dimensions; i++) {
      grid[i] = new Array();

      for (let  j = 0; j < dimensions; j++) {
          grid[i][j] = "";
      }
  }

  addOuterWalls();
  let ent = addEntrance();
  addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);
  for(let i = 0; i < dimensions;i++) {
    for(let j = 0; j < dimensions;j++) {
      console.log(grid[i][j]);
    }
  }
}

function addOuterWalls() {
  for (let i = 0; i < grid.length; i++) {
      if (i == 0 || i == (grid.length - 1)) {
          for (var j = 0; j < grid.length; j++) {
              grid[i][j] = "w";
          }
      } else {
          grid[i][0] = "w";
          grid[i][grid.length - 1] = "w";
      }
  }
}

function addEntrance() {
  let x = randomNumber(1, grid.length - 1);
  grid[grid.length - 1][x] = "g";
  return x;
}

function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
  if (h) {
      if (maxX - minX < 2) {
          return;
      }
      var y = randomNumber(minY, maxY);
      addHWall(minX, maxX, y);

      addInnerWalls(!h, minX, maxX, minY, y-1, gate);
      addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
  } else {
      if (maxY - minY < 2) {
          return;
      }

      let x = randomNumber(minX, maxX);
      addVWall(minY, maxY, x);

      addInnerWalls(!h, minX, x-1, minY, maxY, gate);
      addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
  }
}

function addHWall(minX, maxX, y) {
  let hole = randomNumber(minX, maxX);

  for (let i = minX; i <= maxX; i++) {
      if (i == hole) grid[y][i] = "";
      else grid[y][i] = "w";
  }
}

function addVWall(minY, maxY, x) {
  let hole = randomNumber(minY, maxY);

  for (let i = minY; i <= maxY; i++) {
      if (i == hole) grid[i][x] = "";
      else grid[i][x] = "w";
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}