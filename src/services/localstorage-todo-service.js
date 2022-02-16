// use axios's response constructure
import { responseHandler, errorHandler } from './api-request';

export default {
  getTodos(params) {
    console.log(`getTodos`, params);
    return new Promise((resolve, reject) => {
      if (!('localStorage' in window)) {
        reject({
          response: {
            status: 404,
            statusText: 'localStorage access is denied!',
            data: {
              errorType: 'accessDenied'
            }
          }
        });
      }
      let todos = JSON.parse(localStorage.getItem('todos'));
      // if user is a new visitor
      if (!todos) todos = [];
      resolve({
        headers: '',
        status: 200,
        data: {
          todos
        }
      });
    })
      .then(response => {
        console.log(`responseHandler`, response);
        return responseHandler(response);
      })
      .catch(error => {
        return errorHandler(error);
      });
  },
  getTodo(id) {
    console.log(id);
  },
  createTodo(todo) {
    console.log(todo);
  },
  updateTodo(id, todo) {
    console.log(id, todo);
  },
  deleteTodo(id) {
    console.log(id);
  }
};
