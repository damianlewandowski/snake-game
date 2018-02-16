class Square {
  constructor(x, y, size, color, ctx) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.ctx = ctx;
  }

  move(dir) {
    switch (dir) {
      case 37:
        this.x += -this.size;
        break;
      case 38:
        this.y += -this.size;
        break;
      case 39:
        this.x += this.size;
        break;
      case 40:
        this.y += this.size;
        break;
      default:
        break;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.size, this.size);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class Snake {
  constructor() {
    // Get canvas element and its 2d context
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Get handler to the score element
    this.scoreHandler = document.getElementById("score");
    this.scoreHandler.innerHTML = "Score: 0";

    // Set width and height of the game
    this.canvas.width = 500;
    this.canvas.height = 500;

    // Some default stuff
    this.squareSize = 20;
    this.snakeColor = '#00ff99';
    this.appleColor = '#ff0000';

    // Spawn apple at the beginning
    this.spawnApple();

    this.score = 0;

    this.head = new Square(0, 0, this.squareSize, "#000", this.ctx);
    // Start moving right
    this.headDirection = 39;
    this.headDirections = [39];

    this.tailQueue = [];  // When the head eats the apple, add new snake segment to the queue
    this.tail = [];

    // Add keydown listener
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault();
      this.headDirection = e.keyCode;
    }
  }

  // Clear the context
  clear() {
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.closePath();
  }

  moveHead() {
    this.head.move(this.headDirection);
    this.headDirections.push(this.headDirection);
  }

  drawHead() {
    this.head.draw();
  }

  checkHeadCollision() {
    if(this.head.x < 0 || this.head.x + this.squareSize > this.canvas.width || this.head.y < 0 || this.head.y + this.squareSize > this.canvas.height) {
      this.resetScore();
      alert("You lost!");
      location.reload();
    }
    for(let segmentObj of this.tail) {
      if(this.head.x === segmentObj.segment.x && this.head.y === segmentObj.segment.y) {
        alert("Don't eat yourself! You lost!");
        location.reload();
      }
    }
  }

  // Add last head direction to the tail
  updateTailDirections() {
    // Update tail queue
    for(let segmentObj of this.tailQueue) {
      segmentObj.directions.push(this.headDirection);
    }
    // Update real tail
    for(let segmentObj of this.tail) {
      segmentObj.directions.push(this.headDirection);
    }
  }

  updateTailQueue() {
    if(this.tailQueue.length !== 0) {
      for (let segmentObj of this.tailQueue) {
        segmentObj.counter++;
      }
      if (this.tailQueue[0].counter === this.tailQueue[0].limit) {
        this.tail.push(this.tailQueue.shift());
      }
    }
  }

  moveTail() {
    for(let segmentObj of this.tail) {
      let direction = segmentObj.directions.shift();
      segmentObj.segment.move(direction);
    }
  }

  drawTail() {
    for(let segmentObj of this.tail) {
      segmentObj.segment.draw();
    }
  }

  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAppleX() {
    return Math.floor(this.getRandomNum(0, this.canvas.width) / this.squareSize) * this.squareSize;
  }

  getAppleY() {
    return Math.floor(this.getRandomNum(0, this.canvas.height) / this.squareSize) * this.squareSize;
  }

  spawnApple() {
    let x = this.getAppleX();
    let y = this.getAppleY();
    this.apple = new Square(x, y, this.squareSize, this.appleColor, this.ctx);
  }

  drawApple() {
    this.apple.draw();
  }

  checkAppleEat() {
    return this.apple.x === this.head.x && this.apple.y === this.head.y;
  }

  incrementScore() {
    ++this.score;
    this.scoreHandler.innerHTML = "Score: " + this.score;
  }

  resetScore() {
    this.score = 0;
  }

  eatApple() {
    // Create new snake segment and add it to the tail queue
    let snakeSegment = new Square(this.apple.x, this.apple.y, this.squareSize, this.snakeColor, this.ctx);
    let snakeSegmentObj = {
      segment: snakeSegment,
      directions: [],
      counter: 0,
      limit: this.headDirections.length + 1,
    };
    this.tailQueue.push(snakeSegmentObj);

    this.spawnApple();
    // Redraw the apple
    this.drawApple();
  }

  drawGame() {
    this.clear();
    this.drawApple();
    this.moveHead();
    this.drawHead();
    this.checkHeadCollision();
    this.updateTailDirections();
    if(this.checkAppleEat()) {
      this.eatApple();
      this.incrementScore();
    } else {
      this.headDirections.shift();
    }


    this.updateTailQueue();
    this.moveTail();
    this.drawTail();
  }
}

let snake = new Snake();
setInterval(() => snake.drawGame(), 100);