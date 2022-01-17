import { apiRequest } from './api-request';

export default {
  getTodos(params) {
    return apiRequest({
      method: 'get',
      url: `/todos`,
      data: params
    });
  },
  getTodo(id) {
    return apiRequest({
      method: 'get',
      url: `/todos/${id}`
    });
  },
  createTodo(todo) {
    return apiRequest({
      method: 'post',
      url: `/todos`,
      data: todo
    });
  },
  updateTodo(id, todo) {
    return apiRequest({
      method: 'patch',
      url: `/todos/${id}`,
      data: todo
    });
  },
  deleteTodo(id) {
    return apiRequest({
      method: 'delete',
      url: `/todos/${id}`
    });
  }
};
