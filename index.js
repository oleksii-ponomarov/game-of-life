let canvasElement = document.getElementById("canvas");
let canvas = canvasElement.getContext("2d");

let canvasWidth = canvasElement.clientWidth;
let canvasHeight = canvasElement.clientHeight;
let cellSize = canvasWidth / 50;
const cellColor = "rgb(0, 0, 0)";

let cells = [...Array(canvasWidth / cellSize)].map(() => [...Array(canvasHeight / cellSize)].map(() => 0));

function drawGrid() {
  const gridColor = "#aaaaaa";
  canvas.strokeStyle = gridColor;

  const colsNo = Math.floor(canvasWidth / cellSize);
  const rowsNo = Math.floor(canvasHeight / cellSize);

  for (let i = 0; i <= colsNo; i++) {
    canvas.beginPath();
    canvas.moveTo(i * cellSize, 0);
    canvas.lineTo(i * cellSize, canvasHeight);
    canvas.stroke();
  }

  for (let j = 0; j <= rowsNo; j++) {
    canvas.beginPath();
    canvas.moveTo(0, j * cellSize);
    canvas.lineTo(canvasWidth, j * cellSize);
    canvas.stroke();
  }
}

function drawFirstGen() {
  canvas.fillStyle = cellColor;

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if (cells[i][j] === 1) {
        canvas.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      } else {
        canvas.clearRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

function tick() {
  canvasWidth = canvasElement.clientWidth;
  canvasHeight = canvasElement.clientHeight;
  cellSize = canvasWidth / 50;

  let cellsNext = [...Array(canvasWidth / cellSize)].map(() => [...Array(canvasHeight / cellSize)].map(() => 0));

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      // Neighbors
      const topLeft = i > 0 ? cells[i - 1][j - 1] : 0;
      const left = i > 0 ? cells[i - 1][j] : 0;
      const bottomLeft = i > 0 ? cells[i - 1][j + 1] : 0;
      const topRight = i < cells.length - 1 ? cells[i + 1][j - 1] : 0;
      const right = i < cells.length - 1 ? cells[i + 1][j] : 0;
      const bottomRight = i < cells.length - 1 ? cells[i + 1][j + 1] : 0;
      const top = j > 0 ? cells[i][j - 1] : 0;
      const bottom = j < cells[i].length ? cells[i][j + 1] : 0;

      const neighbors = [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight];
      const liveNeighbors = neighbors.filter(neighbor => neighbor === 1).length;

      // Game of life rules
      if (cells[i][j] === 1) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          canvas.clearRect(i * cellSize, j * cellSize, cellSize, cellSize);
          cellsNext[i][j] = 0;
        } else {
          cellsNext[i][j] = 1;
        }
      } else {
        if (liveNeighbors === 3) {
          canvas.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          cellsNext[i][j] = 1;
        }
      }
    }
  }

  cells = cellsNext;
}

drawFirstGen();

const pauseButton = document.getElementById("pause");
const startButton = document.getElementById("start");

function pause() {
  clearInterval(game);
  pauseButton.style.display = "none";
  startButton.style.display = "inline-flex";
}

function start() {
  drawFirstGen();
  game = setInterval(tick, 10);
  startButton.style.display = "none";
  pauseButton.style.display = "inline-flex";
}

let drawing = false;

function drawCell(x, y) {
  const offsetX = canvasElement.offsetLeft;
  const offsetY = canvasElement.offsetTop;

  cellSize = canvasElement.clientWidth / 50;

  const positionX = x - offsetX;
  const positionY = y - offsetY;

  const col = Math.floor(positionX / cellSize);
  const row = Math.floor(positionY / cellSize);

  if (col === undefined || row === undefined || col < 0 || row < 0 || col > 49 || row > 49) return;

  cells[col][row] = 1;
  canvas.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function startDrawing({
  x,
  y
}) {
  drawing = true;
  drawCell(x, y);
}

function handleDraw({
  x,
  y
}) {
  if (!drawing) return;
  drawCell(x, y);
}

function startDrawingTouch({
  touches
}) {
  drawing = true;
  drawCell(touches[0].clientX, touches[0].clientY);
}

function handleDrawTouch({
  touches
}) {
  if (!drawing) return;
  drawCell(touches[0].clientX, touches[0].clientY);
}

function endDrawing() {
  drawing = false;
}

pauseButton.addEventListener("click", pause);
startButton.addEventListener("click", start);
canvasElement.addEventListener("mousedown", startDrawing);
canvasElement.addEventListener("touchstart", startDrawingTouch);
canvasElement.addEventListener("mousemove", handleDraw);
canvasElement.addEventListener("touchmove", handleDrawTouch);
canvasElement.addEventListener("mouseup", endDrawing);
canvasElement.addEventListener("touchend", endDrawing);
canvasElement.addEventListener("mouseout", endDrawing);

const pattern1Button = document.getElementById("pattern1");
pattern1Button.addEventListener("click", pattern1);

function clearCells() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j] = 0;
    }
  }
}

function handleClear() {
  pause();
  clearCells();
  drawFirstGen();
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", handleClear);

function pattern1() {
  clearCells();

  cells[24][25] = 1;
  cells[25][25] = 1;
  cells[26][25] = 1;

  cells[2][0] = 1;
  cells[2][1] = 1;
  cells[2][2] = 1;
  cells[1][2] = 1;
  cells[0][1] = 1;

  drawFirstGen();
}

const oscillatorButton = document.getElementById("oscillator");
oscillatorButton.addEventListener("click", oscillator);

function oscillator() {
  clearCells();

  cells[24][25] = 1;
  cells[25][25] = 1;
  cells[26][25] = 1;

  drawFirstGen();
}