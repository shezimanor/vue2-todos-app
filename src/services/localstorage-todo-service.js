// refer axios's response's constructure
import { responseHandler, errorHandler } from '@/services/api-request';
import { v4 as uuidv4 } from 'uuid';

export default {
  getTodos(params) {
    console.log('API_getTodos: ', params);
    return new Promise((resolve, reject) => {
      if (!('localStorage' in window)) {
        reject({
          response: {
            status: 404,
            statusText: 'localStorage access is denied!',
            data: { errorType: 'accessDenied' }
          }
        });
      }
      // get localStorage todos
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      resolve({
        headers: '',
        status: 200,
        // return todos
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
  createTodo(todo) {
    console.log('API_createTodo: ', todo);
    return new Promise((resolve, reject) => {
      if (!('localStorage' in window)) {
        reject({
          response: {
            status: 404,
            statusText: 'localStorage access is denied!',
            data: { errorType: 'accessDenied' }
          }
        });
      }
      // imitate database manipulation
      // create `id`
      let newTodo = {
        ...todo,
        id: uuidv4()
      };
      // add data & save in localStorage
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      todos.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(todos));
      resolve({
        headers: '',
        status: 200,
        // return newTodo with its new id
        data: {
          todo: newTodo
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
  updateTodo(id, updatedContent) {
    console.log('API_updateTodo: ', id, updatedContent);
    return new Promise((resolve, reject) => {
      if (!('localStorage' in window)) {
        reject({
          response: {
            status: 404,
            statusText: 'localStorage access is denied!',
            data: { errorType: 'accessDenied' }
          }
        });
      }
      // imitate database manipulation
      // find the todo
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      let targetTodoIndex = todos.findIndex(todo => todo.id === id);
      // error: Not found
      if (targetTodoIndex == -1) {
        reject({
          response: {
            status: 404,
            statusText: 'The todo is not found!',
            data: {
              errorType: 'fileNotFound'
            }
          }
        });
      }
      let targetTodo = todos[targetTodoIndex];
      let updatedTodo = {
        ...targetTodo,
        ...updatedContent,
        id: id
      };
      // update todo and save in localStorage
      todos[targetTodoIndex] = updatedTodo;
      localStorage.setItem('todos', JSON.stringify(todos));
      resolve({
        headers: '',
        status: 200,
        // return newTodo & its index
        data: {
          todo: updatedTodo,
          index: targetTodoIndex
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
  deleteTodo(id) {
    console.log('API_deleteTodo: ', id);
    return new Promise((resolve, reject) => {
      if (!('localStorage' in window)) {
        reject({
          response: {
            status: 404,
            statusText: 'localStorage access is denied!',
            data: { errorType: 'accessDenied' }
          }
        });
      }
      // imitate database manipulation
      // find the todo
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      let targetTodoIndex = todos.findIndex(todo => todo.id === id);
      // Not found
      if (targetTodoIndex == -1) {
        reject({
          response: {
            status: 404,
            statusText: 'The todo is not found!',
            data: {
              errorType: 'fileNotFound'
            }
          }
        });
      }
      // delete todo and save in localStorage
      todos.splice(targetTodoIndex, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      resolve({
        headers: '',
        status: 200,
        data: {
          index: targetTodoIndex
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
  }
};
