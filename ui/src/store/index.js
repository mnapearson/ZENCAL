import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: null,
    jwt: null,
  },
  mutations: {
    SET_AUTH_DATA(state, payload) {
      state.user = payload.user;
      state.jwt = payload.jwt;
    },
    LOGOUT(state) {
      state.user = null;
      state.jwt = null;
    },
  },
  actions: {
    async signin(ctx, payload) {
      const res = await fetch("http://localhost:3000/signin", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        throw new Error(data.error);
      }
      ctx.commit("SET_AUTH_DATA", data);
    },
    async signup(ctx, payload) {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        throw new Error(data.error);
      }
      ctx.dispatch("SET_AUTH_DATA", data);
    },
  },
  modules: {},
});
