const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const snakeBlock = 10;
const snakeHeadColor = 'orange'; // Set the snake head color to orange
const snakeBodyColor = '#90EE90'; // Light green color for the snake's body
const foodColor = 'red';
let snake = [{x: canvas.width / 2, y: canvas.height / 2}];
let food = {x: Math.floor(Math.random() * canvas.width / snakeBlock) * snakeBlock, y: Math.floor(Math.random() * canvas.height / snakeBlock) * snakeBlock};
let dx = snakeBlock;
let dy = 0;
let changingDirection = false;
let score = 0;
let operations = 0;
let timeLeft = 120; // 2 minutes
let gameInterval;
let countdownInterval;
let gameOver = false;
let baseSnakeSpeed = 15; // Default base speed of the snake

document.addEventListener('keydown', keyDownHandler);

function keyDownHandler(event) {
    const keyPressed = event.keyCode;

    if (gameOver && keyPressed === 13) { // Enter key
        startGame();
        return;
    }

    changeDirection(event);
}

function startGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);

    // Reset game variables
    snake = [{x: canvas.width / 2, y: canvas.height / 2}];
    dx = snakeBlock;
    dy = 0;
    score = 0;
    operations = 0;
    timeLeft = 120;
    gameOver = false;

    // Ask user to choose the speed
    let speed = prompt("Choose snake speed (1: Slow, 2: Normal, 3: Fast):", "2");
    if (speed === "1") {
        baseSnakeSpeed = 5; // Slow speed
    } else if (speed === "3") {
        baseSnakeSpeed = 25; // Fast speed
    } else {
        baseSnakeSpeed = 15; // Normal speed
    }

    gameInterval = setInterval(main, getSnakeSpeed());
    countdownInterval = setInterval(updateCountdown, 1000);
}

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        clearInterval(countdownInterval);
        gameOver = true;
        alert(`Game Over! Final Score: ${score}\nPress Enter to Restart`);
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    updateStatus();
    adjustSpeed();
}

function clearCanvas() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    context.fillStyle = foodColor;
    context.fillRect(food.x, food.y, snakeBlock, snakeBlock);
}

function drawSnake() {
    snake.forEach((snakePart, index) => {
        context.fillStyle = index === 0 ? snakeHeadColor : snakeBodyColor; // Head is orange, body is light green
        context.fillRect(snakePart.x, snakePart.y, snakeBlock, snakeBlock);
        if (index === 0) { // If this is the head
            drawTextOnSnakeHead(snakePart.x, snakePart.y, "Howjun");
        }
    });
}

function drawTextOnSnakeHead(x, y, text) {
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.fillText(text, x - context.measureText(text).width / 2 + snakeBlock / 2, y + snakeBlock / 2 + 3);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {x: Math.floor(Math.random() * canvas.width / snakeBlock) * snakeBlock, y: Math.floor(Math.random() * canvas.height / snakeBlock) * snakeBlock};
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeBlock;
    const goingDown = dy === snakeBlock;
    const goingRight = dx === snakeBlock;
    const goingLeft = dx === -snakeBlock;

    if (changingDirection) return;
    changingDirection = true;

    if (keyPressed === 37 && !goingRight) { dx = -snakeBlock; dy = 0; }
    if (keyPressed === 38 && !goingDown) { dx = 0; dy = -snakeBlock; }
    if (keyPressed === 39 && !goingLeft) { dx = snakeBlock; dy = 0; }
    if (keyPressed === 40 && !goingUp) { dx = 0; dy = snakeBlock; }
    operations++;
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function updateStatus() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('ops').innerText = `Ops: ${operations}`;
}

function updateCountdown() {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').innerText = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(countdownInterval);
        gameOver = true;
        alert(`Time's up! Final Score: ${score}\nPress Enter to Restart`);
    }
}

function getSnakeSpeed() {
    // Calculate the speed based on the base speed and the length of the snake
    return 1000 / (baseSnakeSpeed + Math.floor(score / 5));
}

function adjustSpeed() {
    // Adjust the speed of the game based on the current length of the snake
    clearInterval(gameInterval);
    gameInterval = setInterval(main, getSnakeSpeed());
}

window.onload = () => {
    alert("Press OK to start the game!");
    startGame();
};