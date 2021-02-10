import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue'
  )

// import User from '../components/user/User.vue'
// import Roles from '../components/roles/Roles.vue'
// import Rights from '../components/roles/Rights.vue'
const User = () =>
  import(
    /* webpackChunkName:"user_Roles_Rights" */ '../components/user/User.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName:"user_Roles_Rights" */ '../components/roles/Roles.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName:"user_Roles_Rights" */ '../components/roles/Rights.vue'
  )

// import goodsList from '../components/goods/List.vue'
// import Params from '../components/goods/Params.vue'
// import Cate from '../components/goods/Cate.vue'
const goodsList = () =>
  import(
    /* webpackChunkName:"goodsList_Params_Cate" */ '../components/goods/List.vue'
  )
const Params = () =>
  import(
    /* webpackChunkName:"goodsList_Params_Cate" */ '../components/goods/Params.vue'
  )
const Cate = () =>
  import(
    /* webpackChunkName:"goodsList_Params_Cate" */ '../components/goods/Cate.vue'
  )

// import Add1 from '../components/goods/Add1.vue'
const Add1 = () =>
  import(/* webpackChunkName:"add" */ '../components/goods/Add1.vue')

// import Order from '../components/orders/Order.vue'
// import Reports from '../components/reports/Reports.vue'
const Order = () =>
  import(
    /* webpackChunkName:"Order_Reports" */ '../components/orders/Order.vue'
  )
const Reports = () =>
  import(
    /* webpackChunkName:"Order_Reports" */ '../components/reports/Reports.vue'
  )

Vue.use(VueRouter)

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
        { path: '/reports', component: Reports },
        { path: '/add', component: Add1 }
      ]
    }
  ]
})

export default router
