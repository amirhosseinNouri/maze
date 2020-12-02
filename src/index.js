const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const cells = 3;
const width = 800;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
];

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));
const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const recurse = (row, column) => {
  // If i have visited the cell at [row,column], then return.
  if (grid[row][column]) return;

  // Mark this cell as visited.
  grid[row][column] = true;

  // Order neighbors randomly.
  const neighbors = shuffle([
    [row - 1, column , 'up'],
    [row, column + 1 , 'right'],
    [row + 1, column , 'down'],
    [row, column - 1 , 'left'],
  ]);

  for (neighbor of neighbors) {
    const [nextRow, nextColumn , direction] = neighbor;
    // See if that neighbor is out of bound.
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    // See if we visited this neighor, continue to the next neighbor
    if (grid[nextRow][nextColumn]) continue;

    // Remove a wall from either horizontals or verticals
    if(direction == 'left'){
        verticals[row][column-1] = true
    }
    else if(direction === 'right'){
        verticals[row][column] = true
    }
    else if(direction === 'up'){
        horizontals[row-1][column] = true
    }else if(direction === 'down') {
        horizontals[row][column] = true
    }

    // Move to the next cell
    recurse(nextRow , nextColumn)
  }
};

recurse(startRow, startColumn);
