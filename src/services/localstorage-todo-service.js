// refer axios's response's constructure
import { apiRequest } from '@/services/api-request';
import { v4 as uuidv4 } from 'uuid';

// Error Response: `Not Found` response
const todoNotFoundResponse = {
  response: {
    status: 404,
    statusText: 'The todo is not found!',
    data: {
      errorType: 'fileNotFound'
    }
  }
};

// All method below: imitate database manipulation
export default {
  getTodos(params) {
    console.log('API_getTodos: ', params);
    return apiRequest(resolve => {
      // get localStorage todos
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      resolve({
        headers: '',
        status: 200,
        // return todos
        data: { todos }
      });
    });
  },
  createTodo(todo) {
    console.log('API_createTodo: ', todo);
    return apiRequest(resolve => {
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
        data: { todo: newTodo }
      });
    });
  },
  updateTodo(id, updatedContent) {
    console.log('API_updateTodo: ', id, updatedContent);
    return apiRequest((resolve, reject) => {
      // find the todo
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      let targetTodoIndex = todos.findIndex(todo => todo.id === id);
      // error: Not found
      if (targetTodoIndex == -1) reject(todoNotFoundResponse);
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
    });
  },
  deleteTodo(id) {
    console.log('API_deleteTodo: ', id);
    return apiRequest((resolve, reject) => {
      // find the todo
      let todos = JSON.parse(localStorage.getItem('todos')) || [];
      let targetTodoIndex = todos.findIndex(todo => todo.id === id);
      // Not found
      if (targetTodoIndex == -1) reject(todoNotFoundResponse);
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
    });
  }
};
