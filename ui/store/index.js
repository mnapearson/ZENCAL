import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router";

Vue.use(Vuex);

let lastUsedId = 0;

export default new Vuex.Store({
  // TODO: Persist State in local storage
  state: {
    events: [],
    tasks: [],
    notifications: [],
  },
  mutations: {
    PUSH_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id != id
      );
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    LOGOUT(state) {
      // TODO Reset state
    },
  },
  actions: {
    async fetchEvents({ dispatch, commit, state }) {
      try {
        // TODO: pass jwt
        const body = await (
          await fetch("http://localhost:3000/events", {
            headers: {},
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        commit("SET_EVENTS", body);
      } catch (error) {
        dispatch("pushNotification", "Sorry, couldn't get latest events...");
      }
    },
    async createEvent({ dispatch, state }, event) {
      try {
        // TODO: pass jwt
        const body = await (
          await fetch("http://localhost:3000/events", {
            method: "POST",
            body: JSON.stringify(event),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }
      } catch (error) {
        dispatch(
          "pushNotification",
          "Sorry, couldn't create event. Try again later"
        );
      }
    },
    async signin({ commit, dispatch }, payload) {
      try {
        const body = await (
          await fetch("http://localhost:3000/signin", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        // TODO: store the auth data
      } catch (error) {
        dispatch(
          "pushNotification",
          "Login failed, please check your email and password"
        );
        throw error;
      }
    },
    async signup({ commit, dispatch }, payload) {
      try {
        const body = await (
          await fetch("http://localhost:3000/signup", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        // TODO: store auth data
      } catch (error) {
        dispatch(
          "pushNotification",
          "Signup failed, please check your email and password"
        );
        throw error;
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
      router.push({ name: "Auth" });
    },
    pushNotification({ commit }, text) {
      const notification = {
        id: ++lastUsedId,
        text,
      };
      commit("PUSH_NOTIFICATION", notification);
      setTimeout(() => {
        commit("REMOVE_NOTIFICATION", notification.id);
      }, 5000);
    },
  },
  modules: {},
});
