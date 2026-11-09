// 表示一列字符的类
class CodeColumn {
  constructor(x) {
    this.x = x;
    this.maxLength = ceil(height / fontSize);
    this.y = 0;
    this.speed = random(1);
    this.chars = [];
    this.colors = [];

    // 填充随机字符
    for (let i = 0; i < this.maxLength; i++) {
      this.chars.push(this.randomChar());
      if (gSpeed > 1) {
        this.colors.push(colorList[1])
      } else {
        this.colors.push(random(colorList))
      }
    }

    this.life = true;
  }

  // 随机得到一个字符
  randomChar() {
    let str = ""
    if (gSpeed > 1) {
      str = "mesta";
    } else {
      str = "adefgilmorstz";
    }
    let arr = str.split("");
    return arr[int(random(arr.length))];
  }

  // 绘制一列字符
  display() {
    for (let i = 0; i < this.chars.length; i++) {
      fill(this.colors[i]);
      text(this.chars[i], this.x, this.y - i * fontSize);
      // 偶尔替换字符
      if (random(100) > 90) {
        this.chars[i] = this.randomChar();
      }
    }
  }

  // 更新位置
  update() {
    this.y += this.speed + gSpeed;
    if (this.y - this.maxLength * fontSize > height) {
      this.life = false;
    }
  }
}

let columns = [];
let gSpeed = 0;

let totalColumns = 800;
let duration = 20 * 60; // 20秒 (60fps)
let generated = 0;
let fontSize = 60
let fillBlack = false;
let a = 0;
let bgImg;
let colorList = [];

function preload() {
  bgImg = loadImage("bg.jpg")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  textSize(fontSize);
  textAlign(CENTER, TOP);
  let font = loadFont('Roboto-Medium.ttf');
  textFont(font);

  bgImg.resize(width, height);

  colorList = [
    color("#EDC2DF"),
    color("#574A83"),
    color("#D3E2F1"),
  ]
}

function draw() {
  image(bgImg, 0, 0)

  if (!fillBlack) {
    background(255, 150); // 拖影效果
  }

  if (a == 255) {
    fill(0);
    noStroke();
    rect(0, 0, width, height);
  }

  if (!fillBlack) {
    // 当前已经过去的比例 (0 ~ 1)
    let t = constrain(frameCount / duration, 0, 1);

    // 由慢变快
    let target = int(totalColumns * pow(t, 4));

    // 生成需要补上的列
    while (generated < target || generated == 0) {
      columns.push(new CodeColumn(random(width)));
      generated++;
    }
  }

  if (a < 255) {
    // 绘制更新
    for (let col of columns) {
      col.display();
      col.update();
    }
  }

  // 加速 
  if (frameCount % 60 == 0 && frameCount > 0) {
    gSpeed = min(5, gSpeed + 0.1);
  }

  // 过滤掉死亡的列
  columns = columns.filter(col => col.life);

  if (columns.length >= totalColumns - 100) {
    fillBlack = true;
  }

  if (fillBlack) {
    a = min(255, a + 3);
  }
}
