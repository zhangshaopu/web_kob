import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r; // 横坐标
        this.c = c; // 纵坐标
        this.gamemap = gamemap;
        this.color = "#B37226";
    }

    update() {
        this.render();
    }

    render() {
        // 一个单位格边长
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}
