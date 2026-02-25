class Particle {

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.vx = 0;
        this.vy = 0;
        this.gridIndex = null;

        this.game.particles.push(this);

        this.prev = null;
        this.next = null;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        const newGridIndex = this.getGridIndex();
        if (newGridIndex !== this.gridIndex) {
            this.game.updateParticle(this, this.gridIndex, newGridIndex);
            this.gridIndex = newGridIndex;
        }

        const myCol = Math.floor(this.x / this.game.cellSize);
        const myRow = Math.floor(this.y / this.game.cellSize);

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                const checkCol = myCol + i;
                const checkRow = myRow + j;

                // SAFETY CHECK: Make sure this neighbor cell actually exists on the screen!
                // If we are on the left edge (myCol = 0), checkCol - 1 would be -1, which breaks the array.
                if (checkCol >= 0 && checkCol < this.game.cols && checkRow >= 0 && checkRow < this.game.rows) {

                    // Calculate the exact 1D index for this specific neighbor cell
                    const checkIndex = (checkRow * this.game.cols) + checkCol;

                    // Grab the start of the linked list for THIS cell
                    let particlesInGrid = this.game.grid[checkIndex];

                    // Run your exact same linked list logic!
                    while (particlesInGrid) {
                        if (particlesInGrid !== this) {
                            const dx = this.x - particlesInGrid.x;
                            const dy = this.y - particlesInGrid.y;
                            const squaredDistance = (dx * dx) + (dy * dy);

                            // You might want to add a max distance check here too,
                            // so particles at opposite corners of the 3x3 grid don't push each other.
                            // e.g., if (squaredDistance > 0.1 && squaredDistance < this.game.cellSize * this.game.cellSize)
                            if (squaredDistance > 0.1) {
                                if (particlesInGrid instanceof Particle) {
                                    const force = this.game.particleForce / squaredDistance;
                                    this.vx += dx * force;
                                    this.vy += dy * force;
                                } else if (particlesInGrid instanceof Attractor) {
                                    const force = this.game.attractorForce / squaredDistance;
                                    this.vx -= dx * force;
                                    this.vy -= dy * force;
                                }
                            }
                        }
                        // Move to the next particle in the chain
                        particlesInGrid = particlesInGrid.next;
                    }
                }
            }
        }

        const distLeft = Math.max(0.1, this.x);
        this.vx += this.game.wallForce / (distLeft * distLeft);

        const distRight = Math.max(0.1, canvas.width - this.x);
        this.vx -= this.game.wallForce / (distRight * distRight);

        const distTop = Math.max(0.1, this.y);
        this.vy += this.game.wallForce / (distTop * distTop);

        const distBottom = Math.max(0.1, canvas.height - this.y);
        this.vy -= this.game.wallForce / (distBottom * distBottom);

        if (this.vx > this.game.maxSpeed) this.vx = this.game.maxSpeed;
        if (this.vx < -this.game.maxSpeed) this.vx = -this.game.maxSpeed;
        if (this.vy > this.game.maxSpeed) this.vy = this.game.maxSpeed;
        if (this.vy < -this.game.maxSpeed) this.vy = -this.game.maxSpeed;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    getGridIndex() {
        let col = Math.floor(this.x / game.cellSize);
        let row = Math.floor(this.y / game.cellSize);

        // Keep the column and row safely inside the grid boundaries
        if (col < 0) col = 0;
        if (col >= game.cols) col = game.cols - 1;
        if (row < 0) row = 0;
        if (row >= game.rows) row = game.rows - 1;

        return (row * game.cols) + col;
    }
}
