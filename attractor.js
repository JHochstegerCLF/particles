class Attractor {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 5;

        this.prev = null;
        this.next = null;


        this.gridIndex = null;

        this.game.attractors.push(this);


        this.gridIndex = this.getGridIndex();
        this.game.updateParticle(this, null, this.gridIndex);
    }

    update() {

        const newGridIndex = this.getGridIndex();
        if (newGridIndex !== this.gridIndex) {
            this.game.updateParticle(this, this.gridIndex, newGridIndex);
            this.gridIndex = newGridIndex;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0';
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