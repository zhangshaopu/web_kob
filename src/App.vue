<template>
  <NavBar/>

  <router-view/>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

  export default{
    name: "App",
    setup() {
    },
    components: { NavBar }
    
  }


</script>
<style>

</style>
