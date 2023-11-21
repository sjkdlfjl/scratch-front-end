import VueRouter from 'vue-router'
import Jsmind from '../components/Jsmind.vue'
import Canvas from '../components/Canvas.vue'
import Pad from '../components/Sketchpad'
import Vue from 'vue'
Vue.use(VueRouter)
const router = new VueRouter({
    mode: "history",
    routes: [
        // { path: '/', redirect: '/login' },
        { path: '/', component: Jsmind },
        { path: '/canvas', component: Canvas }, // /:id
        { path: '/pad/:id', component: Pad }
    ],
})
export default router