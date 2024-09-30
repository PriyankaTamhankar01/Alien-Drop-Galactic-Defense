const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gameStartSound = document.getElementById('game-start-sound');
const alienDropSound = document.getElementById('alien-drop-sound');
const backgroundMusic = document.getElementById('background-music');

// Set background music to loop
backgroundMusic.loop = true;

document.getElementById('start-game').addEventListener('click', () => {
  document.getElementById('game-start').style.display = 'none';

  // Play background music once when the game starts
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  }

  gameStartSound.play();  // Play the game start sound

  gameLoop();
  alienSpawnInterval = setInterval(spawnAlien, 1000);
  timerInterval = setInterval(updateTimer, 1000);
});


let score = 0;
let timeLeft = 60; // 1 minute
let aliens = [];
let gameInterval, alienSpawnInterval, timerInterval;
let ship = { x: canvas.width / 2 - 70, y: canvas.height - 50, width: 140, height: 30 }; // Wider ship

// Load alien image
const alienImage = new Image();
alienImage.src = './assets/ufo.png'; // Alien image

// Load spaceship image
const spaceshipImage = new Image();
spaceshipImage.src = 'https://i.imgur.com/ZrX3a5Y.png'; // Spaceship image

let imagesLoaded = 0;
alienImage.onload = () => checkImagesLoaded();
spaceshipImage.onload = () => checkImagesLoaded();

document.getElementById('start-game').addEventListener('click', () => {
  document.getElementById('game-start').style.display = 'none';
  gameLoop();
  alienSpawnInterval = setInterval(spawnAlien, 1000);
  timerInterval = setInterval(updateTimer, 1000);
});

function updateAliens() {
  aliens.forEach(alien => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) {
      aliens.splice(aliens.indexOf(alien), 1);
    }
  });
}

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    createStars();
    drawSpaceship();
    gameLoop();
    alienSpawnInterval = setInterval(spawnAlien, 1000);
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function createStars() {
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;

    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';

    star.style.animationDuration = Math.random() * 2 + 1 + 's';
    document.body.appendChild(star);
  }
}

function drawShip() {
  ctx.fillStyle = 'lime';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawAliens() {
  aliens.forEach(alien => {
    ctx.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);
  });
}

function updateAliens() {
  aliens.forEach(alien => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) {
      aliens.splice(aliens.indexOf(alien), 1);
    }
  });
}

function spawnAlien() {
  const alien = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: Math.random() * 2 + 1
  };
  aliens.push(alien);
}

function checkCollision() {
  aliens.forEach(alien => {
    if (alien.x < ship.x + ship.width &&
        alien.x + alien.width > ship.x &&
        alien.y < ship.y + ship.height &&
        alien.y + alien.height > ship.y) {
      score += 1;
      aliens.splice(aliens.indexOf(alien), 1);
    }
  });
}

function updateScore() {
  document.getElementById('score').innerText = score;
}

function updateTimer() {
  timeLeft -= 1;
  document.getElementById('time').innerText = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(alienSpawnInterval);
  clearInterval(timerInterval);
  cancelAnimationFrame(gameInterval);
  document.getElementById('final-score').innerText = score;
  document.getElementById('game-over').style.display = 'block';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawAliens();
  updateAliens();
  checkCollision();
  updateScore();
  gameInterval = requestAnimationFrame(gameLoop);
}

function drawSpaceship() {
  ctx.drawImage(spaceshipImage, canvas.width / 2 - 70, 10, 140, 50); // Wider spaceship
}

window.addEventListener('mousemove', (event) => {
  ship.x = event.clientX - ship.width / 2;
});

document.getElementById('play-again').addEventListener('click', () => {
  document.getElementById('game-over').style.display = 'none';
  score = 0;
  timeLeft = 60;
  aliens = [];
  updateScore();
  document.getElementById('time').innerText = timeLeft;

  // Restart game without restarting the background music
  gameLoop();
  alienSpawnInterval = setInterval(spawnAlien, 1000);
  timerInterval = setInterval(updateTimer, 1000);
});
