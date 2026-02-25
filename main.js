const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let game = new Game(canvas)
console.log(game);
let showGrid = false;

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);
    game.particles.forEach(particle => particle.update());
    game.attractors.forEach(attractor => attractor.update());

    document.getElementById('particleCount').innerText = 'Particles: ' + game.particles.length;
    document.getElementById('attractorCount').innerText = 'Attractors: ' + game.attractors.length;
}

window.addEventListener('resize', game.resizeCanvas);
game.resizeCanvas();

window.addEventListener('click', (event) => {
    if (event.target.id !== 'myCanvas') return;
    new Particle(game, event.x, event.y);
})

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    new Attractor(game, event.x, event.y);
})

document.getElementById('clearAll').addEventListener('click', () => {
    game.particles = [];
    game.attractors = [];
    game.grid = Array.from({length: game.cols * game.rows}, () => null);
})

document.getElementById('clearParticles').addEventListener('click', () => {
    game.particles = [];
    game.grid = Array.from({length: game.cols * game.rows}, () => null);
    game.attractors.forEach(attractor => attractor.gridIndex = null);
})

document.getElementById('clearAttractors').addEventListener('click', () => {
    game.attractors = [];
    game.grid = Array.from({length: game.cols * game.rows}, () => null);
    game.particles.forEach(particle => particle.gridIndex = null);
})

document.getElementById('spawnParticlesButton').addEventListener('click', () => {
    const particleCount = document.getElementById('particleAddCount').value;
    console.log(particleCount)
    spawnRandomParticles(particleCount);
})
document.getElementById('showGrid').addEventListener('change', (e) => {
    showGrid = e.target.checked;
})

animate();
function spawnParticles () {
    const totalRows = 10;
    const totalCols = 10;

// Calculate spacing based on the window size
    const spacingX = window.innerWidth / (totalCols + 1);
    const spacingY = window.innerHeight / (totalRows + 1);

    for (let i = 1; i <= totalRows; i++) {
        for (let j = 1; j <= totalCols; j++) {
            // 1. Calculate the exact screen position
            const posX = j * spacingX;
            const posY = i * spacingY;

            // 2. Create the new particle
            new Particle(game, posX, posY);
        }
    }
}

function spawnRandomParticles(count) {
    for (let i = 0; i < count; i++) {
        new Particle(game, Math.random() * canvas.width, Math.random() * canvas.height);
    }
}

function drawGrid(ctx) {
    if (!showGrid) return;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; // Subtle faint white
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Draw Vertical Lines
    for (let x = 0; x <= canvas.width; x += game.cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Draw Horizontal Lines
    for (let y = 0; y <= canvas.height; y += game.cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}

spawnParticles();
