let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const midX = canvas.width / 2;
const midY = canvas.height / 2;

const speed = 10;

class Square {
  constructor(x, y, color) {
    this.size = 10;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  move(dir) {
    switch (dir) {
      // Move left
      case 37:
        this.x += -speed;
        break;
      // Move Up
      case 38:
        this.y += -speed;
        break;
      // Move right
      case 39:
        this.x += speed;
        break;
      // Move Down
      case 40:
        this.y += speed;
        break;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// Snake Game
class Snake {
  constructor() {
    this.headX = midX;
    this.headY = midY;
    this.snakeColor = "#00ff99";
    this.head = new Square(this.headX, this.headY, this.snakeColor);
    this.headDirection = 37;
    this.headDirections = [];
    this.tail = [];
    this.snakeSize = 0;
    this.appleEatenMoves = 0;  // How many moves were made since the apple was eaten
    this.appleEatenMovesFlag = false;
    this.spawnAppleFlag = true;
    this.wasAppleEaten = false;

    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    // Prevent scrolling
    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault();
      this.headDirection = e.keyCode;
    } else {
      console.log("What are you pressing? This is a snake game! Use arrows!");
    }
  }

  clear() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
  }

  moveHead() {
    switch (this.headDirection) {
      case 37:
        this.head.move(37);
        break;
      case 38:
        this.head.move(38);
        break;
      case 39:
        this.head.move(39);
        break;
      case 40:
        this.head.move(40);
        break;
    }
    if(this.snakeSize !== 0) {
      this.headDirections.push(this.headDirection);
    }
  }

  drawHead() {
    this.head.draw();
  }

  // Inclusive
  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAppleX() {
    return Math.floor(this.getRandomNum(0, canvas.width) / speed) * speed;
  }

  getAppleY() {
    return Math.floor(this.getRandomNum(0, canvas.height) / speed) * speed;
  }

  // Create new apple if there aren't any or if it has been eaten
  spawnApple() {
    if(this.spawnAppleFlag) {
      let appleX = this.getAppleX();
      let appleY = this.getAppleY();
      this.apple = new Square(appleX, appleY, "#ff0000");
      this.spawnAppleFlag = false;
    }
  }

  drawApple() {
    this.apple.draw();
  }

  eatApple() {
    // If apple was eaten
    if(this.apple.x === this.head.x && this.apple.y === this.head.y) {
      this.snakeSize++;
      this.spawnAppleFlag = true;
      this.appleEatenMovesFlag = true;
      this.prevAppleX = this.apple.x;
      this.prevAppleY = this.apple.y;
      this.wasAppleEaten = true;
    }
  }

  handleSnakeSize() {
    if(this.appleEatenMovesFlag) {
      this.appleEatenMoves++;
      if(this.appleEatenMoves === this.snakeSize && this.snakeSize !== 0) {
        let snakeSegment = new Square(this.prevAppleX, this.prevAppleY, this.snakeColor);
        this.tail.push(snakeSegment);
        this.appleEatenMovesFlag = false;
        this.appleEatenMoves = 0;
      }
    }
  }

  moveTail() {
    console.log(this.headDirections);
    for(let i = 0; i < this.tail.length; i++) {
      console.log(this.headDirections[this.headDirections.length - 1 - i]);
      let segmentDirection = this.headDirections[this.headDirections.length - 1 - i];
      this.tail[i].move(segmentDirection);
    }
  }

  drawTail() {
    for(let segment of this.tail) {
      segment.draw();
    }
  }

  drawGame() {
    this.clear();
    this.moveHead();
    this.drawHead();
    this.drawTail();
    this.moveTail();
    this.spawnApple();
    this.drawApple();
    this.eatApple();
    this.handleSnakeSize();

    if(!this.wasAppleEaten) {
      this.headDirections.shift();
    }
    this.wasAppleEaten = false;
  }
}

let snake = new Snake();
setInterval(() => snake.drawGame(), 100);