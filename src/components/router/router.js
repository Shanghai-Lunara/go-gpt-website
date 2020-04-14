import Vue from 'vue'
import VueRouter from "vue-router"
import Gen from '../gen/gen'
import Svn from '../svn/svn'
import Ftp from '../ftp/ftp'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/gen',
            name: 'gen',
            component: Gen
        },
        {
            path: '/svn',
            name: 'svn',
            component: Svn
        },
        {
            path: '/ftp',
            name: 'ftp',
            component: Ftp
        }
    ]
})

// 避免连续请求同一路由
const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {

    return routerPush.call(this, location).catch(error=> error)

}

export default router