import Vue from "vue";
import VueRouter from "vue-router";
import LogIn from "../components/login.vue";
import Home from "../components/home.vue";
import Welcome from "../components/welcome.vue";
import Users from "../components/user/users.vue";
import "../assets/css/global.css";
import Right from '../components/power/rights.vue';
import Roles from '../components/power/roles.vue';
import Cate from '../components/goods/cate.vue'
import Params from '../components/goods/params.vue'
import GoodsList from '../components/goods/list.vue'
import Add from '../components/goods/add.vue'
import Order from '../components/order/order.vue'
import Report from '../components/report/report.vue'

Vue.use(VueRouter);

const routes = [{
    path: "/login",
    component: LogIn,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [{
      path: "/welcome",
      component: Welcome,
    }, {
      path: "/users",
      component: Users,
    }, {
      path: "/rights",
      component: Right,
    }, {
      path: "/roles",
      component: Roles,
    }, {
      path: "/categories",
      component: Cate,
    }, {
      path: "/Params",
      component: Params,
    }, {
      path: "/goods",
      component: GoodsList,
      // children: [{
      //   path: "/add",
      //   component: Add,
      // }]
    }, {
      path: "/goods/add",
      component: Add,
    }, {
      path: "/orders",
      component: Order,
    }, {
      path: "/reports",
      component: Report,
    }, ],
  },
];

const router = new VueRouter({
  routes,
});

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to将要访问的路径
//   //from代表从哪个路径跳转而来
//   //next是一个函数，表示放行
//   //next() 放行 next('/login')强制跳转
//   if (to.path === "/login") return next(); //如果用户访问的是登录页面，不需要判断就可以放行
//   //如果用户访问的不是登录页面，需要获取token并进行判断
//   const tokenStr = window.sessionStorage.getItem("token");
//   if (!tokenStr) return next("/login");
//   next();
// });
export default router;
