const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const heart = document.getElementById("heart");
const scoreDisplay = document.getElementById("score");
const soundToggle = document.getElementById("sound-toggle");

let score = 0;
let soundOn = true;
let caughtSound = new Audio("sounds/caught.mp3");
let heartSound = new Audio("sounds/heart.mp3");
let bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

let playerPos = { top: 100, left: 100 };
let enemyPos = { top: 300, left: 300 };
let heartPos = { top: 200, left: 200 };

function movePlayer(dx, dy) {
  playerPos.top = Math.max(0, Math.min(playerPos.top + dy, gameArea.clientHeight - 40));
  playerPos.left = Math.max(0, Math.min(playerPos.left + dx, gameArea.clientWidth - 40));
  player.style.top = playerPos.top + "px";
  player.style.left = playerPos.left + "px";
}

function moveEnemy() {
  if (enemyPos.top < playerPos.top) enemyPos.top += 2;
  if (enemyPos.top > playerPos.top) enemyPos.top -= 2;
  if (enemyPos.left < playerPos.left) enemyPos.left += 2;
  if (enemyPos.left > playerPos.left) enemyPos.left -= 2;
  enemy.style.top = enemyPos.top + "px";
  enemy.style.left = enemyPos.left + "px";
}

function checkCollision() {
  const dx = Math.abs(playerPos.left - enemyPos.left);
  const dy = Math.abs(playerPos.top - enemyPos.top);
  if (dx < 40 && dy < 40) {
    if (soundOn) caughtSound.play();
    alert("Caught! Final Score: " + score);
    score = 0;
  }
}

function checkHeart() {
  const dx = Math.abs(playerPos.left - heartPos.left);
  const dy = Math.abs(playerPos.top - heartPos.top);
  if (dx < 40 && dy < 40) {
    score += 10;
    if (soundOn) heartSound.play();
    heartPos.top = Math.random() * (gameArea.clientHeight - 40);
    heartPos.left = Math.random() * (gameArea.clientWidth - 40);
    heart.style.top = heartPos.top + "px";
    heart.style.left = heartPos.left + "px";
  }
}

function updateScore() {
  score++;
  scoreDisplay.textContent = "Score: " + score;
}

function toggleSound() {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "🔊 Sound: ON" : "🔇 Sound: OFF";
  if (soundOn) bgMusic.play();
  else bgMusic.pause();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -10);
  if (e.key === "ArrowDown") movePlayer(0, 10);
  if (e.key === "ArrowLeft") movePlayer(-10, 0);
  if (e.key === "ArrowRight") movePlayer(10, 0);
});

let touchStartX = 0;
let touchStartY = 0;

document.getElementById("game-area").addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.getElementById("game-area").addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) movePlayer(10, 0);
    else movePlayer(-10, 0);
  } else {
    if (dy > 0) movePlayer(0, 10);
    else movePlayer(0, -10);
  }
});

soundToggle.addEventListener("click", toggleSound);

setInterval(() => {
  moveEnemy();
  checkCollision();
  checkHeart();
  updateScore();
}, 100);
