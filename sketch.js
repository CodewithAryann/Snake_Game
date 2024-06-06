
let numSegments = 10;
let direction = 'right';

const xStart = 0;
const yStart = 150; 
const diff = 10;
const segmentSize = 12; 

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;
let scoreElem;

// Sound effects
let eatSound;
let gameOverSound;

// Game boundaries
const leftWall = 0;
const rightWall = 490; // Adjusted to accommodate the stroke weight
const topWall = 0;
const bottomWall = 370; // Adjusted to accommodate the stroke weight

function preload() {
  eatSound = loadSound('eat.mp3');
  gameOverSound = loadSound('die.mp3');
}

function setup() {
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  createCanvas(494, 373); // Adjusted canvas height
  frameRate(15);
  stroke(0); // Set stroke color to black
  updateFruitCoordinates();

  for (let i = 0; i < numSegments; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  }
}

function draw() {
  background('#93ae07'); // Set background color to dark olive green

  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();

  // Draw walls
  strokeWeight(10);
  stroke(255);
  line(leftWall, topWall, rightWall, topWall); // Top wall
  line(rightWall, topWall, rightWall, bottomWall); // Right wall
  line(rightWall, bottomWall, leftWall, bottomWall); // Bottom wall
  line(leftWall, bottomWall, leftWall, topWall); // Left wall

  // Draw snake
  noStroke();
  for (let i = 0; i < numSegments; i++) {
    let colorR = map(i, 0, numSegments, 50, 200); // Gradient color
    fill(60, 102, 208); // Set snake color to RGB (60, 102, 208)
    ellipse(xCor[i], yCor[i], segmentSize);
  }

  // Draw snake eyes
  fill(255); // White eyes
  const headX = xCor[numSegments - 1];
  const headY = yCor[numSegments - 1];
  const eyeSize = 3; // Size of the eyes
  const eyeOffset = 4; // Offset from the center of the head
  if (direction === 'right' || direction === 'left') {
    ellipse(headX - eyeOffset, headY - eyeOffset, eyeSize); // Left eye
    ellipse(headX - eyeOffset, headY + eyeOffset, eyeSize); // Right eye
  } else if (direction === 'up' || direction === 'down') {
    ellipse(headX - eyeOffset, headY - eyeOffset, eyeSize); // Top eye
    ellipse(headX + eyeOffset, headY - eyeOffset, eyeSize); // Bottom eye
  }
}

function updateSnakeCoordinates() {
  for (let i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

function checkGameStatus() {
  if (
    xCor[xCor.length - 1] >= rightWall || // Hit right wall
    xCor[xCor.length - 1] <= leftWall || // Hit left wall
    yCor[yCor.length - 1] >= bottomWall || // Hit bottom wall
    yCor[yCor.length - 1] <= topWall || // Hit top wall
    checkSnakeCollision()
  ) {
    noLoop();
    gameOverSound.play();
    const scoreVal = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Game ended! Your score was : ' + scoreVal);
  }
}

function checkSnakeCollision() {
  const snakeHeadX = xCor[xCor.length - 1];
  const snakeHeadY = yCor[yCor.length - 1];
  for (let i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

function checkForFruit() {
  fill('#FF0000'); // Set fruit color to red
  ellipse(xFruit, yFruit, segmentSize);

  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    eatSound.play();
    const prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score = ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  xFruit = floor(random(10, (rightWall - 100) / 10)) * 10;
  yFruit = floor(random(10, (bottomWall - 100) / 10)) * 10;
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case RIGHT_ARROW:
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case UP_ARROW:
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case DOWN_ARROW:
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
  }
  return false; // Prevent default behavior of arrow keys
}
