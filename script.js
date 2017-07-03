let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const squareSize = 10;
const speed = 10;
const appleColor = "#ff0000";
const snakeColor = "#00ff99";
const midX = canvas.width / 2;
const midY = canvas.height / 2;

class Square {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

class Snake {
  constructor() {
    this.head = new Square(midX, midY, snakeColor);
    this.tail = [];
    this.headMoves = [];
    this.snakeSize = 0;
    this.direction = 0; // 0 - left 1 - top 2 - right 3 - down
    this.appleFlag = true;

    // Add keyboard arrow control
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  // Inclusive
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Multiplicities of speed
  getAppleX() {
    return Math.floor(this.getRandomNumber(0, canvas.width) / speed) * speed;
  }

  // Multiplicities of speed
  getAppleY() {
    return Math.floor(this.getRandomNumber(0, canvas.height) / speed) * speed;
  }

  spawnApple() {
    let x = this.getAppleX();
    let y = this.getAppleY();
    this.apple = new Square(x, y, appleColor);
  }

  drawApple() {
    ctx.beginPath();
    ctx.rect(this.apple.x, this.apple.y, squareSize, squareSize);
    ctx.fillStyle = this.apple.color;
    ctx.fill();
    ctx.closePath();
  }

  checkAppleEat() {
    return this.head.x === this.apple.x && this.head.y === this.apple.y;
  }

  eatApple() {
    this.snakeSize++;
    this.appleFlag = true;
    let snakeSegment = new Square(this.head.x, this.head.y, snakeColor);
    this.tail.push(snakeSegment);
    console.log(this.tail);
  }

  checkLose() {
    if(
      this.head.x < 0 ||
      this.head.x + squareSize > canvas.width ||
      this.head.y < 0 ||
      this.head.y + squareSize > canvas.height
    ) {
      return true;
    }
    return false;
  }

  reload() {
    alert("You lost :(");
    location.reload();
  }

  handleKeyDown(e) {
    // No moving the page with arrow keys
    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault();
    }
    switch(e.keyCode) {
      case 37:
        this.direction = 0;
        break;
      case 38:
        this.direction = 1;
        break;
      case 39:
        this.direction = 2;
        break;
      case 40:
        this.direction = 3;
        break;
      default:
        console.log("What the hell are you pressing in a snake game?");
    }
  }

  move(square) {
    switch(this.direction) {
      case 0:
        square.x += -speed;
        break;
      case 1:
        square.y += -speed;
        break;
      case 2:
        square.x += speed;
        break;
      case 3:
        square.y += speed;
        break;
      default:
        console.log("???");
    }
  }

  moveTail() {
    for(let i = 0; i < this.tail.length; i++) {
      let square = this.tail[i];
      let segmentDirection = this.headMoves[i];
      switch(segmentDirection) {
        case 0:
          square.x += -speed;
          break;
        case 1:
          square.y += -speed;
          break;
        case 2:
          square.x += speed;
          break;
        case 3:
          square.y += speed;
          break;
        default:
          console.log("ehh");
      }
    }
  }

  drawTail() {
    for(let square of this.tail) {
      ctx.beginPath();
      ctx.rect(square.x, square.y, squareSize, squareSize);
      ctx.fillStyle = snakeColor;
      ctx.fill();
      ctx.closePath();
    }
  }

  drawHead() {
    ctx.beginPath();
    ctx.rect(this.head.x, this.head.y, squareSize, squareSize);
    ctx.fillStyle = snakeColor;
    ctx.fill();
    ctx.closePath();
  }

  draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(this.appleFlag) {
      this.spawnApple();
      this.appleFlag = false;
    }
    this.drawApple();
    this.move(this.head);
    this.headMoves.push(this.direction);
    if(this.checkLose()) {
      this.reload();
    }
    this.drawHead();
    if(this.checkAppleEat()) {
      this.eatApple();
      this.headMoves.push(this.headMoves.length - 1);
    }
    this.moveTail();
    this.drawTail();
    ctx.closePath();
    console.log(this.headMoves);
    this.headMoves.shift();
  }
}

let snake = new Snake();
setInterval(() => snake.draw(), 500);