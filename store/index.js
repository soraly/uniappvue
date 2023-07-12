import Vue from "vue";
import Vuex from "vuex";
import playingStore from "./modules/playIngStore";
import websocketStore from "./modules/websocketStore";
import appInfoStore from "./modules/appInfoStore"

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  getters: {},
  mutations: {

  },
  actions: {
  },
  modules: {
    playingStore,
    websocketStore,
    appInfoStore
  },
})

export default store;
