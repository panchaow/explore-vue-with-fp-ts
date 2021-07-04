import Home from "./pages/Home.vue";
import Profile from "./pages/Profile.vue";
import Login from "./pages/Login.vue";
import Register from './pages/Register.vue';
import Settings from './pages/Settings.vue';
import Article from './pages/Article.vue';
import Editor from './pages/Editor.vue';
import MyArticles from './components/Profile/MyArticles.vue';
import FavoritedArticles from './components/Profile/FavoritedArticles.vue';
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    // requiredAuth: true,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: "/editor/:slug?", 
    component: Editor,
    meta: { requiresAuth: true }
  },
  {
    path: "/@:username",
    component: Profile,
    children: [
      {
        path: "",
        component: MyArticles,
      },
      {
        path: "favorites",
        component: FavoritedArticles,
      }
    ]
  },
  {
    path: "/article/:slug",
    component: Article
  }
];

export const router = createRouter({ routes, history: createWebHashHistory() });