import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Roles from '../components/roles/Roles.vue'
import Rights from '../components/roles/Rights.vue'
import goodsList from '../components/goods/List.vue'
import Params from '../components/goods/Params.vue'
import Cate from '../components/goods/Cate.vue'
import Order from '../components/orders/Order.vue'
import Reports from '../components/reports/Reports.vue'

Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/goods', component: goodsList },
        { path: '/params', component: Params },
        { path: '/categories', component: Cate },
        { path: '/orders', component: Order },
        { path: '/reports', component: Reports }
      ]
    }
  ]
})

export default router
