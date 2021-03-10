import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Songs from "../views/Songs.vue";
import NotFoundPage from "../views/NotFoundPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/songs",
    name: "Songs",
    component: Songs
  },
  {
    path: "/*",
    name: "NotFoundPage",
    component: NotFoundPage
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
