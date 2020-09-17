import Vue from "vue";
import VueRouter from "vue-router";
import Welcome from "./components/welcome.vue";
import Events from "../components/events.vue";
import CreateEvent from "../components/CreateEvent.vue";
import Tasks from "../components/tasks.vue";
import CreateTask from "../components/CreateTask.vue";
import Auth from "../components/Auth.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Welcome,
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: Tasks,
  },
  {
    path: "/tasks/new",
    name: "CreateTask",
    component: CreateTask,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/events/new",
    name: "CreateEvent",
    component: CreateEvent,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
