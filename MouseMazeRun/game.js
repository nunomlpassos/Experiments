const SIZE = 10;
const START = { row: SIZE - 1, col: SIZE - 1 };
const DIRS = [
  { key: "up", row: -1, col: 0, wall: "top", opposite: "bottom" },
  { key: "right", row: 0, col: 1, wall: "right", opposite: "left" },
  { key: "down", row: 1, col: 0, wall: "bottom", opposite: "top" },
  { key: "left", row: 0, col: -1, wall: "left", opposite: "right" },
];

const mazeEl = document.querySelector("#maze");
const movesLeftEl = document.querySelector("#movesLeft");
const bestPathEl = document.querySelector("#bestPath");
const levelTitleEl = document.querySelector("#levelTitle");
const messageEl = document.querySelector("#message");
const starsEl = document.querySelector("#stars");
const retryButton = document.querySelector("#retryButton");
const nextButton = document.querySelector("#nextButton");

let level = 1;
let maze = [];
let exit = null;
let mouse = { ...START };
let shortestPath = [];
let moveLimit = 0;
let movesLeft = 0;
let gameOver = false;
let touchStart = null;

function createCell(row, col) {
  return {
    row,
    col,
    visited: false,
    walls: { top: true, right: true, bottom: true, left: true },
  };
}

function blankMaze() {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => createCell(row, col)),
  );
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function carveMaze(grid) {
  const stack = [grid[START.row][START.col]];
  grid[START.row][START.col].visited = true;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = shuffle(DIRS).filter((dir) => {
      const row = current.row + dir.row;
      const col = current.col + dir.col;
      return isInside(row, col) && !grid[row][col].visited;
    });

    if (!options.length) {
      stack.pop();
      continue;
    }

    const dir = options[0];
    const next = grid[current.row + dir.row][current.col + dir.col];
    current.walls[dir.wall] = false;
    next.walls[dir.opposite] = false;
    next.visited = true;
    stack.push(next);
  }
}

function addLoops(grid, count) {
  let opened = 0;
  let attempts = 0;
  while (opened < count && attempts < 180) {
    attempts += 1;
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
    const nextRow = row + dir.row;
    const nextCol = col + dir.col;
    if (!isInside(nextRow, nextCol) || !grid[row][col].walls[dir.wall]) continue;
    grid[row][col].walls[dir.wall] = false;
    grid[nextRow][nextCol].walls[dir.opposite] = false;
    opened += 1;
  }
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function neighbors(grid, cell) {
  return DIRS.flatMap((dir) => {
    const row = cell.row + dir.row;
    const col = cell.col + dir.col;
    if (!isInside(row, col) || cell.walls[dir.wall]) return [];
    return [{ row, col, dir: dir.key }];
  });
}

function findShortestPath(grid, target) {
  const queue = [{ row: START.row, col: START.col, path: [{ ...START }] }];
  const seen = new Set([keyOf(START)]);

  while (queue.length) {
    const current = queue.shift();
    if (current.row === target.row && current.col === target.col) return current.path;

    for (const next of neighbors(grid, grid[current.row][current.col])) {
      const key = keyOf(next);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({
        row: next.row,
        col: next.col,
        path: [...current.path, { row: next.row, col: next.col }],
      });
    }
  }

  return [];
}

function keyOf(cell) {
  return `${cell.row},${cell.col}`;
}

function minimumPathForLevel(currentLevel) {
  if (currentLevel <= 10) return randomInt(14, 18);
  if (currentLevel <= 30) return randomInt(18, 24);
  if (currentLevel <= 60) return randomInt(24, 30);
  return randomInt(28, 34);
}

function extraMovesForLevel(currentLevel) {
  if (currentLevel <= 10) return randomInt(5, 7);
  if (currentLevel <= 30) return randomInt(3, 5);
  if (currentLevel <= 60) return randomInt(2, 4);
  return randomInt(0, 3);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countTurns(path) {
  let turns = 0;
  let last = null;
  for (let i = 1; i < path.length; i += 1) {
    const previous = path[i - 1];
    const current = path[i];
    const dir = `${Math.sign(current.row - previous.row)},${Math.sign(current.col - previous.col)}`;
    if (last && dir !== last) turns += 1;
    last = dir;
  }
  return turns;
}

function countDeadEnds(grid) {
  let deadEnds = 0;
  for (const row of grid) {
    for (const cell of row) {
      const openSides = DIRS.filter((dir) => !cell.walls[dir.wall]).length;
      if (openSides === 1) deadEnds += 1;
    }
  }
  return deadEnds;
}

function chooseExitAndValidate(grid, minPath) {
  const exits = shuffle(Array.from({ length: SIZE }, (_, col) => ({ row: 0, col })));

  for (const candidate of exits) {
    const path = findShortestPath(grid, candidate);
    if (!path.length) continue;
    const distance = path.length - 1;
    const turns = countTurns(path);
    const deadEnds = countDeadEnds(grid);
    if (distance >= minPath && turns >= 5 && deadEnds >= 10 && deadEnds <= 42) {
      grid[candidate.row][candidate.col].walls.top = false;
      return { exit: candidate, path };
    }
  }

  return null;
}

function generateLevel() {
  const minPath = minimumPathForLevel(level);

  for (let attempt = 0; attempt < 900; attempt += 1) {
    const grid = blankMaze();
    carveMaze(grid);
    addLoops(grid, level > 30 ? 9 : 6);
    const result = chooseExitAndValidate(grid, minPath);
    if (result) {
      maze = grid;
      exit = result.exit;
      shortestPath = result.path;
      moveLimit = shortestPath.length - 1 + extraMovesForLevel(level);
      resetRun();
      return;
    }
  }

  level = Math.max(1, level - 1);
  generateLevel();
}

function resetRun() {
  mouse = { ...START };
  movesLeft = moveLimit;
  gameOver = false;
  render();
  setMessage("Study the maze, then swipe one cell at a time.");
  starsEl.textContent = "☆ ☆ ☆";
}

function render() {
  mazeEl.innerHTML = "";
  mazeEl.classList.remove("win", "invalid");
  levelTitleEl.textContent = `Level ${level}`;
  movesLeftEl.textContent = movesLeft;
  bestPathEl.textContent = shortestPath.length - 1;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = maze[row][col];
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.style.borderTopWidth = cell.walls.top ? "2px" : "0";
      cellEl.style.borderRightWidth = cell.walls.right ? "2px" : "0";
      cellEl.style.borderBottomWidth = cell.walls.bottom ? "2px" : "0";
      cellEl.style.borderLeftWidth = cell.walls.left ? "2px" : "0";

      if (exit && row === exit.row && col === exit.col) cellEl.classList.add("exit");
      if (row === mouse.row && col === mouse.col) {
        const mouseEl = document.createElement("div");
        mouseEl.className = "mouse";
        cellEl.append(mouseEl);
      }

      mazeEl.append(cellEl);
    }
  }
}

function setMessage(text, warning = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("warning", warning);
}

function move(directionKey) {
  if (gameOver) return;
  const dir = DIRS.find((item) => item.key === directionKey);
  const current = maze[mouse.row][mouse.col];

  if (!dir || current.walls[dir.wall]) {
    showInvalidMove();
    return;
  }

  mouse = { row: mouse.row + dir.row, col: mouse.col + dir.col };
  movesLeft -= 1;
  render();

  if (mouse.row === exit.row && mouse.col === exit.col) {
    winLevel();
    return;
  }

  if (movesLeft <= 0) {
    loseLevel();
    return;
  }

  setMessage(movesLeft <= 3 ? "Only a few careful steps remain." : "Good. Keep planning each cell.");
}

function showInvalidMove() {
  mazeEl.classList.remove("invalid");
  void mazeEl.offsetWidth;
  mazeEl.classList.add("invalid");
  setMessage("There is a wall there. Choose another direction.", true);
}

function winLevel() {
  gameOver = true;
  mazeEl.classList.add("win");
  const stars = calculateStars();
  starsEl.textContent = "★ ".repeat(stars).padEnd(5, "☆ ").trim();
  setMessage(stars === 3 ? "Clean route. Three stars." : "Exit reached. Nice and steady.");
}

function loseLevel() {
  gameOver = true;
  starsEl.textContent = "☆ ☆ ☆";
  setMessage("No moves left. Retry and plan a quieter route.", true);
}

function calculateStars() {
  const used = moveLimit - movesLeft;
  const extraUsed = used - (shortestPath.length - 1);
  const spare = moveLimit - (shortestPath.length - 1);
  if (extraUsed <= Math.max(0, Math.floor(spare * 0.25))) return 3;
  if (extraUsed <= Math.max(1, Math.floor(spare * 0.7))) return 2;
  return 1;
}

function handleSwipe(endX, endY) {
  if (!touchStart) return;
  const dx = endX - touchStart.x;
  const dy = endY - touchStart.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  touchStart = null;

  if (Math.max(absX, absY) < 24) return;
  if (absX > absY) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}

mazeEl.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
});

mazeEl.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  handleSwipe(touch.clientX, touch.clientY);
});

mazeEl.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") return;
  touchStart = { x: event.clientX, y: event.clientY };
});

mazeEl.addEventListener("pointerup", (event) => {
  if (event.pointerType === "touch") return;
  handleSwipe(event.clientX, event.clientY);
});

retryButton.addEventListener("click", resetRun);
nextButton.addEventListener("click", () => {
  level += 1;
  generateLevel();
});

generateLevel();
