const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const WEST = -1;

// width = length
// height = 

export function maze(grid, startN, GRID_LENGTH, GRID_WIDTH,FINISH_NODE_ROW,FINISH_NODE_COL,) {
    getGrid(grid,0,0,GRID_WIDTH,GRID_LENGTH,getOrientation(GRID_WIDTH,GRID_LENGTH))
}


function getGrid(grid,x,y,width,height,orientation) {
    if(width < 2 || height < 2) return null;
    let horizontal = orientation === "Horizontal";

    // where will wall start?
    let wallX = x + (horizontal ? 0 : Math.random(width - 2));
    let wally = y + (horizontal ? Math.random(height - 2) : 0);

    // determine where passage in the wall will be 
    let passageX = wallX + (horizontal ? Math.random(width) : 0);
    let passageY = wallY + (horizontal ? 0 : Math.random(height));

    // direction of wall:
    let directionX = horizontal ? 1 : 0;
    let directionY = horizontal ? 0 : 1;

    // determine the length of the wall
    let length = horizontal ? width : height;

    // what direction is perp to the wall
    let dir = horizontal ? SOUTH : EAST;

    for(let i = 0; i < length;i++) {
        
    }

}


function getOrientation(width, length) {
    if(length < width) {
        return "Horizontal";
    } else {
        return "Vertical";
    }
}

function getNeighbors(currentNode, grid,GRID_LENGTH,GRID_WIDTH) {
    let neighbors = [];
    let x = currentNode.row;
    let y = currentNode.col;
  
    if(x > 0 && y > 0 && y < GRID_LENGTH - 1 && x < GRID_WIDTH -1 ) {
      console.log(x + "," + y)
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if(x === 0 && y === 0) {
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if(x === 0 && y === GRID_LENGTH - 1) {
      neighbors.push(grid[x][y + WEST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if(x === GRID_WIDTH - 1 && y === 0) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
    } else if(x === GRID_WIDTH - 1 && y === GRID_LENGTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if(y === 0 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
    } else if (x === 0 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } else if (y === GRID_LENGTH - 1 && x > 0 && x < GRID_WIDTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x + SOUTH][y]);
      neighbors.push(grid[x][y + WEST]);
    } 
    else if(x === GRID_WIDTH - 1 && y > 0 && y < GRID_LENGTH - 1) {
      neighbors.push(grid[x + NORTH][y]);
      neighbors.push(grid[x][y + EAST]);
      neighbors.push(grid[x][y + WEST]);
    }
    return (
      neighbors
    );
  }