import Vue from 'vue';
import Vuex from 'vuex';
import * as todo from '@/store/modules/todo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    todo
  }
});
