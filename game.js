class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.cellSize = 50;
        this.particles = [];
        this.attractors = [];

        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);

        this.grid = Array.from({length: this.cols * this.rows}, () => null);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    updateParticle(particle, oldIndex, newIndex) {
        // ==========================================
        // STEP 1: REMOVE FROM THE OLD CELL
        // ==========================================

        // Link the previous particle to the next particle
        if (particle.prev !== null) {
            particle.prev.next = particle.next;
        } else {
            // If there is no 'prev', this particle was the very first one in the cell (the head).
            // So, we tell the grid to start the list with the next particle instead.
            this.grid[oldIndex] = particle.next;
        }

        // Link the next particle back to the previous particle
        if (particle.next !== null) {
            particle.next.prev = particle.prev;
        }


        // ==========================================
        // STEP 2: INSERT INTO THE NEW CELL
        // ==========================================

        // Look at who is currently at the front of the new cell
        const currentHead = this.grid[newIndex];

        // Point our particle forward to the current head
        particle.next = currentHead;
        particle.prev = null; // It's going to be the new head, so nothing is behind it

        // If there was already a particle in this cell, point it back to our new particle
        if (currentHead !== undefined && currentHead !== null) {
            currentHead.prev = particle;
        }

        // Officially make our particle the new head of this cell's list
        this.grid[newIndex] = particle;
    }
}