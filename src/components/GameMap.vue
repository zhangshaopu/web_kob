<template>
    <!-- ref = parent 可以将parent 指向 div -->
    <div ref = "parent" class="gamemap"> 
        <!-- canvas与template的这个canvas产生关联  tabindex=0 可以获得用户操作 -->
        <canvas ref = "canvas" tabindex="0"></canvas> 
    </div>
</template>

<script>
import { GameMap } from "@/assets/scripts/GameMap"
import { ref , onMounted } from 'vue' // vue里面定义变量要用ref onMounted指组件挂载后执行哪些操作
export default {
    setup(){
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'),parent.value)
        });
        return { // return 之后才能在template里面用
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    /* 水平居中 */
    justify-content: center; 
    /* 竖直居中 */
    align-items: center;
}
</style>