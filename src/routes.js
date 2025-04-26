import { createWebHistory, createRouter } from "vue-router";
import authorization from "./pages/authorization.vue";
import main from "./pages/main.vue";
import developers from "./pages/developers.vue";
import Profile from "./pages/Profile.vue";
import Resume from "./pages/Resume.vue";

const routes = [
  { path: "/", component: main },
  { path: "/authorization", component: authorization },
  { path: "/dev", component: developers },
  { path: "/profile", component: Profile },
  { path: "/resume", component: Resume }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
