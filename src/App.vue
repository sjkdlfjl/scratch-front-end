<template>
  <div id="app">
    <!-- <Demo></Demo> -->
    <!-- <JsMind></JsMind> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    
  </div>
</template>

<script>
import JsMind from './components/Jsmind.vue'
// import Demo from './components/Demo.vue'
import router from './router'
// import { useRouter } from 'vue-router';
// const router = useRouter();
export default {
  name: 'App',
  components: {
    // Demo,
    JsMind
  }
}
</script>

<style lang="less">
@import "assets/css/reset.less";
</style>
