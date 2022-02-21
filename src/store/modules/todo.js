import { RESPONSE_TYPE } from '@/services/api-request';
import TodoService from '@/services/localstorage-todo-service';
// utils
import { getTodayFormat } from '@/utils';

export const namespaced = true;

const perPage = 10;

export const state = {
  todos: [],
  todoCategory: {
    life: 'Life',
    work: 'Work',
    plan: 'Plan'
  },
  todoPriorty: {
    1: 'Low',
    2: 'Medium',
    3: 'High'
  },
  todosFilterCondition: ''
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
  },
  DELETE_TODO(state, index) {
    state.todos.splice(index, 1);
  },
  FILTER_TODOS(state, condition) {
    state.todosFilterCondition = condition;
  }
};

export const actions = {
  async getTodos({ commit }, { page = 1, completed }) {
    const skip = (page - 1) * perPage;
    const response = await TodoService.getTodos({ perPage, skip, completed });
    // console.log(`getTodos actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('SET_TODOS', response.data.todos);
    return response;
  },
  async createTodo({ commit }, todo) {
    const response = await TodoService.createTodo(todo);
    // console.log(`createTodo actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('ADD_TODO', response.data.todo);
    return response;
  },
  async updateTodo({ commit }, { id, todo }) {
    const response = await TodoService.updateTodo(id, todo);
    // console.log(`updateTodo actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('UPDATE_TODO', {
        todo: response.data.todo,
        index: response.data.index
      });
    return response;
  },
  async deleteTodo({ commit }, id) {
    const response = await TodoService.deleteTodo(id);
    // console.log(`deleteTodo actions`, response);
    if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT)
      commit('DELETE_TODO', response.data.index);
    return response;
  },
  // filter todos
  filterTodos({ commit }, condition) {
    console.log(`filterTodos actions`, condition);
    commit('FILTER_TODOS', condition);
  }
};

export const getters = {
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id);
  },
  // currentTodos by mutiple condition
  currentConditionTodos: (state, getters) => {
    switch (state.todosFilterCondition) {
      case 'today':
        return getters.todayTodos;
      case '':
        return state.todos;
      default:
        return getters.filteredTodosByCategory[state.todosFilterCondition];
    }
  },
  // filtered todos `today`
  todayTodos: state => {
    let today = getTodayFormat();
    return state.todos.filter(todo => todo.date === today);
  },
  // filtered todos `by cateogry`
  filteredTodosByCategory: state => {
    let filteredTodos = { empty: [] };
    for (const key in state.todoCategory) {
      if (Object.hasOwnProperty.call(state.todoCategory, key))
        filteredTodos[key] = [];
    }
    state.todos.forEach(todo => {
      switch (todo.category) {
        case '':
          filteredTodos.empty.push(todo);
          break;
        default:
          filteredTodos[todo.category].push(todo);
          break;
      }
    });
    return filteredTodos;
  },
  uncompletedCurrentConditionTodos: (state, getters) => {
    return getters.currentConditionTodos.filter(todo => !todo.completed);
  },
  currentConditionTodosLength: (state, getters) => {
    return getters.currentConditionTodos.length;
  },
  uncompletedTodayTodosLength: (state, getters) => {
    return getters.todayTodos.filter(todo => !todo.completed).length;
  },
  uncompletedCurrentConditionTodosLength: (state, getters) => {
    return getters.uncompletedCurrentConditionTodos.length;
  }
};
