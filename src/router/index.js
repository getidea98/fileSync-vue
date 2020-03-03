import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: 'login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/login.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../components/profile.vue')
    }
];

const router = new VueRouter({
    routes
});

//挂在路由导航守卫
router.beforeEach((to,from,next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  // next（） 放行， next（/hemo） 跳转到hemo路径
  if(to.path === '/login') return next();
  const token = window.sessionStorage.getItem("token");
  if(!token) return next('/login');
  next()
});

export default router
