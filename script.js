const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const boardSize = 10;
const cellSize = 30; // Each cell is 10% of 300px
let snake = [{ x: 0, y: 0 }];
let apples = [];
let direction = { x: 1, y: 0 };
let score = 0;
let highScore = 0;
let isMoving = false;
let gameInterval;

// Initialize Board
function initBoard() {
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.left = `${x * cellSize}px`;
            cell.style.top = `${y * cellSize}px`;
            board.appendChild(cell);
        }
    }
    resetGame();
}

// Render the game
function render() {
    const snakeSegments = document.querySelectorAll('.snake');
    snakeSegments.forEach(segment => segment.remove());

    snake.forEach((segment, index) => {
        const snakePart = document.createElement('div');
        snakePart.classList.add('snake');
        snakePart.style.transform = `translate(${segment.x * cellSize}px, ${segment.y * cellSize}px)`;
        board.appendChild(snakePart);
    });

    const appleSegments = document.querySelectorAll('.apple');
    appleSegments.forEach(apple => apple.remove());

    apples.forEach(apple => {
        const applePart = document.createElement('div');
        applePart.classList.add('apple');
        applePart.style.transform = `translate(${apple.x * cellSize}px, ${apple.y * cellSize}px)`;
        board.appendChild(applePart);
    });
}

// Move the snake
function moveSnake() {
    if (isMoving) return;
    isMoving = true;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision
    if (
        head.x < 0 || head.x >= boardSize ||
        head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if snake eats an apple
    const appleIndex = apples.findIndex(apple => apple.x === head.x && apple.y === head.y);
    if (appleIndex !== -1) {
        score += 1;
        apples.splice(appleIndex, 1);
        if (score % 5 === 0) {
            placeApples();
        }
        if (score === 500) {
            alert('Victory! You reached the maximum score of 500!');
            resetGame();
            return;
        }
    } else {
        snake.pop();
    }

    render();
    updateScore();
    isMoving = false;
}

// Place apples on the board (limit 5 at a time)
function placeApples() {
    while (apples.length < 5) {
        const newApple = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
        if (!snake.some(segment => segment.x === newApple.x && segment.y === newApple.y) &&
            !apples.some(apple => apple.x === newApple.x && apple.y === newApple.y)) {
            apples.push(newApple);
        }
    }
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

// Handle swipe input
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

window.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Swipe Right
        else if (deltaX < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Swipe Left
    } else {
        if (deltaY > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Swipe Down
        else if (deltaY < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Swipe Up
    }
});

// Game over
function gameOver() {
    alert(`Game Over! Your score: ${score}`);
    clearInterval(gameInterval);
    resetGame();
}

// Reset the game
function resetGame() {
    score = 0;
    direction = { x: 1, y: 0 };
    snake = [{ x: 0, y: 0 }];
    apples = [];
    updateScore();
    placeApples();
    render();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 200);
}

// Start the game
initBoard();
