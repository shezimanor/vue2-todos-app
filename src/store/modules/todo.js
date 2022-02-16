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
  },
  ADD_TODO(state, todo) {
    state.todos.push(todo);
  },
  UPDATE_TODO(state, { todo, index }) {
    state.todos.splice(index, 1, todo);
  }
};

export const actions = {
  async getTodos({ commit }, { page = 1, completed }) {
    const skip = (page - 1) * perPage;
    const response = await TodoService.getTodos({ perPage, skip, completed });
    // console.log(`actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('SET_TODOS', response.data.todos);
    return response;
  },
  async createTodo({ commit }, todo) {
    const response = await TodoService.createTodo(todo);
    // console.log(`actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('ADD_TODO', response.data.todo);
    return response;
  },
  async updateTodo({ commit }, { id, todo }) {
    const response = await TodoService.updateTodo(id, todo);
    console.log(`actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('UPDATE_TODO', {
        todo: response.data.todo,
        index: response.data.index
      });
    return response;
  }
};

export const getters = {
  completedTodos: state => {
    return state.todos.filter(todo => !todo.completed);
  },
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id);
  }
};
