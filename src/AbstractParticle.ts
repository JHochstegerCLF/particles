import Game from "./game.js";

export abstract class AbstractParticle {
    game: Game;
    x: number;
    y: number;
    radius: number;
    gridIndex: number | null;
    prev: AbstractParticle | null;
    next: AbstractParticle | null;

    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.gridIndex = null;
        this.prev = null;
        this.next = null;
    }

    abstract update(): void;

    getGridIndex(): number {
        let col: number = Math.floor(this.x / this.game.cellSize);
        let row: number = Math.floor(this.y / this.game.cellSize);

        if (col < 0) col = 0;
        if (col >= this.game.cols) col = this.game.cols - 1;
        if (row < 0) row = 0;
        if (row >= this.game.rows) row = this.game.rows - 1;

        return (row * this.game.cols) + col;
    }
}