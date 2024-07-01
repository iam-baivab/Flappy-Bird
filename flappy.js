const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let birdImage = new Image();
birdImage.src = 'https://via.placeholder.com/68x48';
let bird = { x: 100, y: 150, width: 68, height: 48, gravity: 0.3, lift: -4, velocity: 0 };
let pipes = [];
let score = 0;
let gameInterval;
let difficultySettings;
let countdown = 3;
let currentDifficulty;

function startGame(difficulty) {
    document.getElementById('difficultyScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    canvas.style.display = 'block';
    currentDifficulty = difficulty;
    
    switch(difficulty) {
        case 'easy':
            difficultySettings = { gap: 260, speed: 2 };
            break;
        case 'hard':
            difficultySettings = { gap: 195, speed: 3 };
            break;
        case 'advanced':
            difficultySettings = { gap: 130, speed: 4 };
            break;
    }
    
    pipes = [];
    score = 0;
    bird.y = 150;
    bird.velocity = 0;
    countdown = 3;
    
    let countdownInterval = setInterval(() => {
        if (countdown > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '48px Arial';
            ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
            countdown--;
        } else {
            clearInterval(countdownInterval);
            gameInterval = setInterval(gameLoop, 1000 / 60);
        }
    }, 1000);
    
    document.addEventListener('keydown', controlBird);
}

function controlBird(event) {
    if (event.code === 'Space') {
        bird.velocity = bird.lift;
    }
}

function gameLoop() {
    updateBird();
    updatePipes();
    checkCollisions();
    drawGame();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        let pipeY = Math.floor(Math.random() * (canvas.height - difficultySettings.gap));
        pipes.push({ x: canvas.width, y: pipeY, width: 50, gap: difficultySettings.gap });
    }
    
    pipes.forEach(pipe => {
        pipe.x -= difficultySettings.speed;
    });
    
    if (pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
        score++;
    }
}

function checkCollisions() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
    
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gap)) {
            endGame();
        }
    });
}

function endGame() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', controlBird);
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    
    document.getElementById('finalScore').innerText = 'Score: ' + score;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

function restartGame() {
    startGame(currentDifficulty);
}

function showMenu() {
    document.getElementById('difficultyScreen').style.display = 'flex';
    canvas.style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    
    pipes.forEach(pipe => {
        let gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');
        ctx.fillStyle = gradient;
        
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipe.gap, pipe.width, canvas.height - (pipe.y + pipe.gap));
    });
    
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

window.addEventListener('keydown', function(e) {
    if(e.key === ' ' && e.target === document.body) {
        e.preventDefault();
    }
});
