import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";
export class GameMap extends AcGameObject{
    constructor(ctx,parent){
        super();
        this.ctx = ctx;
        this.parent = parent;
        
        // 初始化迷宫是 13*13 
        this.rows = 13;
        this.cols = 13;
        
        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1} , this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2} , this),
        ];
    }
    check_ready(){ // 判断两条蛇是否都准备好下一回合
        for(const snake of this.snakes){
            if(snake.status !== "idle") return false; 
            if(snake.direction === -1 ) return false;
        }
        return true;
    }

    add_listening_events(){ // 获得用户输入
        this.ctx.canvas.focus();

        const [snake0,snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown",e=>{
            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        });
    }

    check_valid(cell) {  // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {  // 当蛇尾会前进的时候，蛇尾不要判断
                k -- ;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }

    // 子类重写父类函数
    start(){ 
        for(let i = 0 ; i < 1000 ; i++){
            if(this.create_walls()){
                break;
            }
        }
        this.add_listening_events();
    }

    check_connectivity(g, sx, sy , tx ,ty){ // 传入起点和重点横纵坐标
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            //debugger;
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;

    }

    create_walls(){
        // new Wall(0,0,this);
        const g = [] // 地图的布尔数组
        for(let r = 0 ; r < this.rows ; r++){ // 初始化布尔数组
            g[r] = [];
            for(let c = 0 ; c < this.cols ; c++){
                g[r][c] = false;
            }
        }

        //给四周加上障碍物
        for(let r = 0 ; r < this.rows ; r++){
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for(let i = 0 ; i < this.inner_walls_count ; i++){
            for(let j = 0 ; j < 1000 ; j++){ 
                let r = parseInt(Math.random() * this.rows ); // [0,1) * [0,13] = [0,13)的随机值
                let c = parseInt(Math.random() * this.cols);

                if(g[r][c] || g[c][r]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                    continue;

                else g[r][c] = g[c][r] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g)); // 复制布尔数组
        if(!this.check_connectivity(copy_g , this.rows - 2 , 1 , 1 , this.cols - 2)) return false;
        // 给障碍物格子染色
        for(let r = 0 ; r < this.rows; r ++){
            for(let c = 0 ; c < this.cols ; c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r,c,this));
                }
            }
        }

        return true;
    }

    update_size(){
        // 单位格子的像素长度 取整数
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    next_step(){ // 让两条蛇进入下一回合
        for(const snake of this.snakes){
            snake.next_step();
        }

    }

    update(){
        this.update_size();
        if(this.check_ready()){
            this.next_step();
        }
        this.render();
    }

    render(){
        const color_even = "#AAD751", color_odd = "#A2D149";
        // 对格子染色
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
        
    }


}
