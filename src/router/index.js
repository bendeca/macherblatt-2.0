// eslint-disable-next-line  no-unused-vars
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CheckoutView from "../views/CheckoutView.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView
    }
  ]
});

export default router;
