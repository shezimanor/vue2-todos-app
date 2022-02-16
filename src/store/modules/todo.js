import { RESPONSE_TYPE } from '@/services/api-request';
import TodoService from '@/services/localstorage-todo-service';

export const namespaced = true;

const perPage = 10;

export const state = {
  todos: []
};

export const mutations = {
  SET_TODOS(state, todos) {
    state.todos = todos;
  }
};

export const actions = {
  async getTodos({ commit }, { page = 1, completed }) {
    const skip = (page - 1) * perPage;
    const response = await TodoService.getTodos({ perPage, skip, completed });
    console.log(`actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('SET_TODOS', response.data.todos);
    return response;
  }
};

export const getters = {};
