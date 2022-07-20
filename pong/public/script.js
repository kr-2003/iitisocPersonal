const initVelo = 0.025;
const velInc = 0.00001;

class Ball {
  constructor(elem) {
    this.elem = elem;
    this.reset();
  }

  rect() {
    return this.elem.getBoundingClientRect();
  }

  get x() {
    return parseFloat(getComputedStyle(this.elem).getPropertyValue("--x"));
  }

  set x(value) {
    this.elem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.elem).getPropertyValue("--y"));
  }

  set y(value) {
    this.elem.style.setProperty("--y", value);
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const angle = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
      console.log(this.direction);
    }
    this.velocity = initVelo;
  }

  update(delta, paddlerects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += velInc * delta;
    const rect = this.rect();
    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }
    // if (rect.left >= window.innerWidth || rect.right <= 0) {
    //   this.direction.x *= -1;
    // }
    if (paddlerects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }
}

class Paddle {
  constructor(elem) {
    this.elem = elem;
  }

  rect() {
    return this.elem.getBoundingClientRect();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.elem).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.elem.style.setProperty("--position", value);
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

const ball = new Ball(document.getElementById("ball"));
const leftPaddle = new Paddle(document.getElementById("left"));
const rightPaddle = new Paddle(document.getElementById("right"));
let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [leftPaddle.rect(), rightPaddle.rect()]);
    // leftPaddle.update(delta);
    // rightPaddle.update(delta);
  }
  lastTime = time;
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

document.addEventListener("mousemove", (e) => {
  leftPaddle.position = (e.y / window.innerHeight) * 100;
});

document.addEventListener("keydown", (e) => {
  console.log(e.code);
  if (e.code === "ArrowUp") {
    rightPaddle.position -= 5;
  }
  if (e.code === "ArrowDown") {
    rightPaddle.position += 5;
  }
});
