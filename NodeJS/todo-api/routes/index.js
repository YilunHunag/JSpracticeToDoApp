import Vue from "vue";
import Router from "vue-router";
import ProtectedPage from "@/components/ProtectedPage";  // 你需要的頁面
import LoginPage from "@/components/LoginPage";  // 登入頁面

Vue.use(Router);

const routes = [
  {
    path: "/protected",
    component: ProtectedPage,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (!token) {
        next("/login");
      } else {
        next();
      }
    },
  },
  {
    path: "/login",
    component: LoginPage,
  },
];

export default new Router({
  routes,
});
