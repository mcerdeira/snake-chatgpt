let context = null;
let gameInterval = null;

class Snake {
  constructor() {
    this.size = 20;
    this.body = [{ x: 0, y: 0 }];
    this.direction = '';
  }

  move() {
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }

    switch (this.direction) {
      case 'up':
        this.body[0].y -= this.size;
        break;
      case 'down':
        this.body[0].y += this.size;
        break;
      case 'left':
        this.body[0].x -= this.size;
        break;
      case 'right':
        this.body[0].x += this.size;
        break;
    }
  }

  draw() {
    context.fillStyle = 'green';
    for (let i = 0; i < this.body.length; i++) {
      context.fillRect(this.body[i].x, this.body[i].y, this.size, this.size);
    }
  }

  grow() {
    this.body.push({ x: this.body[this.body.length - 1].x, y: this.body[this.body.length - 1].y });
  }

  reset() {
    this.direction = '';
    this.size = 20;
    this.body = [{ x: 0, y: 0 }];
  }
}

class Food {
  constructor(snake) {
    this.size = 20;
    this.position = {
      x: Math.floor(Math.random() * (canvas.width / this.size)) * this.size,
      y: Math.floor(Math.random() * (canvas.height / this.size)) * this.size
    };

    for (let i = 0; i < snake.body.length; i++) {
      if (snake.body[i].x === this.position.x && snake.body[i].y === this.position.y) {
        this.position.x = Math.floor(Math.random() * (canvas.width / this.size)) * this.size;
        this.position.y = Math.floor(Math.random() * (canvas.height / this.size)) * this.size;
        i = -1;
      }
    }
  }

  draw() {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  reset() {
    this.position = {
      x: Math.floor(Math.random() * (canvas.width / this.size)) * this.size,
      y: Math.floor(Math.random() * (canvas.height / this.size)) * this.size
    };
  }
}

// Definir el elemento canvas y obtener su contexto
const canvas = document.getElementById('canvas');

// Agregar un EventListener para asegurarnos de que el canvas esté completamente cargado
window.addEventListener('load', () => {
  context = canvas.getContext('2d');

  // Continuar con el resto del código
  const scoreElement = document.getElementById('score');
  let snake = new Snake();
  let food = new Food(snake);
  gameInterval = setInterval(gameLoop, 100);

  function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    snake.draw();
    food.draw();
    updateScore();
    checkCollision();
  }

  function updateScore() {
    scoreElement.textContent = snake.body.length - 1;
  }

  function checkCollision() {
    // Verificar si la serpiente choca con las paredes
    if (snake.body[0].x < 0 || snake.body[0].x >= canvas.width || snake.body[0].y < 0 || snake.body[0].y >= canvas.height) {
      clearInterval(gameInterval);
      alert('Game over! Your score is ' + (snake.body.length - 1));
    }

    // Verificar si la serpiente choca consigo misma
    for (let i = 1; i < snake.body.length; i++) {
      if (snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
        clearInterval(gameInterval);
        alert('Game over! Your score is ' + (snake.body.length - 1));
      }
    }

    // Verificar si la serpiente come la comida
    if (snake.body[0].x === food.position.x && snake.body[0].y === food.position.y) {
      snake.grow();
      food = new Food(snake);
    }
  }

  const restartButton = document.getElementById('restart-button');
  restartButton.addEventListener('click', () => {
    clearInterval(gameInterval);
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.reset();
    food.reset();
    gameInterval = setInterval(() => gameLoop(), 100);
  });

  // Agregar un EventListener para mover la serpiente
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowUp':
        if (snake.direction !== 'down') {
          snake.direction = 'up';
        }
        break;
      case 'ArrowDown':
        if (snake.direction !== 'up') {
          snake.direction = 'down';
        }
        break;
      case 'ArrowLeft':
        if (snake.direction !== 'right') {
          snake.direction = 'left';
        }
        break;
      case 'ArrowRight':
        if (snake.direction !== 'left') {
          snake.direction = 'right';
        }
        break;
    }
  });
});
