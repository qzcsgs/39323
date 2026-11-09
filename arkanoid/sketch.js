let barY = 510;
let barX;
let barHeight = 20;

let blocks = [];
let blockWidth = 64;
let blockHeight = 32;
let canvasScale = 0.93;

let gameState = 1;
let ball;
let colorList = []

function setup() {
  createCanvas(530, 600);
  textSize(44);
  textAlign(CENTER, CENTER);
  noStroke();

  ball = new Ball(width / 2, height / 2, 15);

  colorList = [
    color("#EDC2DF"),
    color("#574A83"),
    color("#D3E2F1"),
  ]

  resetBlocks();
}

function draw() {
  background(255);

  push();
  scale(canvasScale);

  if (gameState === 2) {
    fill(255);
    text("You Win!", width / 2, height / 2);
    return;
  }

  // // 球拍
  barX = mouseX;
  // 球拍立体效果
  let barW = 100;
  let barH = barHeight;

  // 主体
  fill(colorList[0]);
  rect(barX - barW / 2, barY, barW, barH);

  // 高光（上 + 左）
  fill(220);
  rect(barX - barW / 2, barY, barW, 3);     // 上
  rect(barX - barW / 2, barY, 3, barH);     // 左

  // 阴影（下 + 右）
  fill(100);
  rect(barX - barW / 2, barY + barH - 3, barW, 3); // 下
  rect(barX + barW / 2 - 3, barY, 3, barH);       // 右

  ball.update();
  ball.display();

  // 掉出屏幕重新生成小球
  if (ball.isOutOfScreen()) {
    ball.reset();
  }

  // 碰撞检测
  for (let i = blocks.length - 1; i >= 0; i--) {
    let block = blocks[i];
    block.display();

    if (ball.hitBlock(block)) {
      blocks.splice(i, 1);
    }
  }

  if (blocks.length === 0) {
    gameState = 2;
  }
  pop();

  // 四周的边框
  // 上边框
  fill(200);
  rect(0, 0, width, 15);
  fill(120);
  rect(0, 15, width, 5);

  // 左边框
  fill(200); // 亮面
  rect(0, 0, 15, height);
  fill(120); // 暗面
  rect(15, 0, 5, height);
  // 右边框
  fill(200);
  rect(width - 20, 0, 15, height);
  fill(120);
  rect(width - 5, 0, 5, height);
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 5;
    this.xSpeed = 0;
    this.ySpeed = 5;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    let u = this.y - this.r / 2;
    let d = this.y + this.r / 2;
    let l = this.x - this.r / 2;
    let r = this.x + this.r / 2;

    // 碰到左右墙
    if (l < 0 + 20 || r > width - 20) {
      this.xSpeed *= -1;
    }
    // 碰到上边
    if (u < 0 + 20) {
      this.ySpeed *= -1;
    }

    // 碰到球拍
    if (
      this.ySpeed > 0 &&
      this.x > barX - 50 &&
      this.x < barX + 50 &&
      d > barY - barHeight / 2
    ) {
      this.xSpeed = (barX - this.x) / -10;
      this.ySpeed = -sqrt(sq(this.speed) - sq(this.xSpeed));
      this.speed += 0.05;
    }
  }

  display() {
    // 主体
    fill(180);
    ellipse(this.x, this.y, this.r, this.r);
    // 阴影（底部偏右）
    fill(100, 100, 100, 120);
    ellipse(this.x + this.r * 0.1, this.y + this.r * 0.1, this.r * 0.8, this.r * 0.8);
    // 高光（左上角）
    fill(255, 255, 255, 180);
    ellipse(this.x - this.r * 0.2, this.y - this.r * 0.2, this.r * 0.4, this.r * 0.4);
  }

  reset() {
    this.x = width / 2;
    this.y = height / 3;
    this.xSpeed = random([-2, 2]); // 给点随机X方向
    this.ySpeed = 4;
    this.speed = 5;
  }

  isOutOfScreen() {
    return this.y + this.r / 2 > height;
  }

  hitBlock(block) {
    let u = this.y - this.r / 2;
    let d = this.y + this.r / 2;
    let l = this.x - this.r / 2;
    let r = this.x + this.r / 2;

    // 左右碰撞
    if (
      r + this.xSpeed > block.blockL &&
      l + this.xSpeed < block.blockR &&
      d > block.blockU &&
      u < block.blockD
    ) {
      this.xSpeed *= -1;
      return true;
    }

    // 上下碰撞
    if (
      d + this.ySpeed > block.blockU &&
      u + this.ySpeed < block.blockD &&
      r > block.blockL &&
      l < block.blockR
    ) {
      this.ySpeed *= -1;
      return true;
    }

    return false;
  }
}

class Block {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.blockWidth = w;
    this.blockHeight = h;

    this.blockU = y;
    this.blockD = y + h;
    this.blockL = x;
    this.blockR = x + w;
    this.c = c;
  }

  display() {
    // 主体
    fill(this.c);
    rect(this.x, this.y, this.blockWidth, this.blockHeight);

    push();
    // translate(this.blockWidth / 2, this.blockHeight / 2);
    // 高光（上 + 左）
    fill(220);
    rect(this.blockL, this.blockU, this.blockWidth, 3); // 上
    rect(this.blockL, this.blockU, 3, this.blockHeight); // 左

    // 阴影（下 + 右）
    fill(100);
    rect(this.blockL, this.blockD - 3, this.blockWidth, 3); // 下
    rect(this.blockR - 3, this.blockU, 3, this.blockHeight); // 右
    pop();
  }
}

function resetBlocks() {
  blocks = [];
  let colorIndex = 0;
  for (let row = 100; row <= 180; row += 40) {
    for (let col = 40; col <= width - blockWidth / 2; col += 70) {
      let c = colorList[colorIndex];
      blocks.push(new Block(col, row, blockWidth, blockHeight, c));
    }
    colorIndex++;
  }
}
