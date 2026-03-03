import Game from "./game.js";
import { AbstractParticle } from "./AbstractParticle.js";

export default class Attractor extends AbstractParticle {
    
    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.radius = 5;

        this.game.attractors.push(this);

        this.gridIndex = this.getGridIndex();
        this.game.updateParticle(this, null, this.gridIndex);
    }

    update(): void {
        const newGridIndex = this.getGridIndex();
        if (newGridIndex !== this.gridIndex) {
            this.game.updateParticle(this, this.gridIndex, newGridIndex);
            this.gridIndex = newGridIndex;
        }

        const ctx = this.game.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0';
        ctx.fill();
    }
}