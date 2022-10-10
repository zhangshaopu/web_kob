const AC_GAME_OBJECTS = []

export class AcGameObject { // export没有defalt的时候，别的文件import时要用大括号，有defalt时，不需要大括号
    constructor(){
        AC_GAME_OBJECTS.push(this); // 初始化时把该对象添加进数组
        this.has_called_start = false;
        this.timedelta = 0; // 时间间隔（单位毫秒）
    }

    start(){

    }

    update(){ // 每一帧执行一次，除了第一帧

    }

    on_destroy(){ // 删除之前执行

    }

    destroy() {
        this.on_destroy();

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp;// 上一次执行的时间戳
const step = (timestamp) => {
    for(let obj of AC_GAME_OBJECTS){
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step);
}
console.log("执行requestAnimationFrame");
//当执行 requestAnimationFrame(callback)的时候，不会立即调用 callback 回调函数，只是将其放入回调函数队列而已，<timerid,callback>
requestAnimationFrame(step); //浏览器在下次重绘之前调用指定的回调函数更新动画
