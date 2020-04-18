import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [{
        path: '/users',
        component: Users
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('login')
  }
})

// 导出路由
export default router
