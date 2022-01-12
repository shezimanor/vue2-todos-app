<template>
  <b-container class="todosapp-container">
    <transition-group
      name="todosapp-cardlist"
      tag="ul"
      class="flex-column position-relative pl-0"
      key="1"
    >
      <b-card
        v-for="todo in completedTodos"
        :key="todo.id"
        :title="todo.title"
        tag="li"
        class="todosapp-card w-100 mb-4 px-4"
      >
        <b-card-text class="text-description">
          {{ todo.content }}
        </b-card-text>
        <small class="text-muted">{{ todo.id }}</small>
        <b-form-checkbox
          v-model="todo.completed"
          class="todosapp-card__checkbox"
          @input="onInput(todo.id, todo.completed)"
        ></b-form-checkbox>
        <b-dropdown
          size="sm"
          variant="link"
          toggle-class="text-decoration-none"
          menu-class="todosapp-card__action__menu"
          class="todosapp-card__action"
          right
          no-caret
        >
          <template #button-content>
            <b-icon-three-dots variant="assistant"></b-icon-three-dots>
            <span class="sr-only">More Action</span>
          </template>
          <b-dropdown-item @click="onEdit(todo.id)">Edit</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item variant="danger" @click="onDelete(todo.id)"
            >Delete</b-dropdown-item
          >
        </b-dropdown>
      </b-card>
    </transition-group>
  </b-container>
</template>

<script>
import { RESPONSE_TYPE } from '@/services/api-request';
import TodosService from '@/services/todos-service';
// b-icons: Importing specific icons
import { BIconThreeDots } from 'bootstrap-vue';
export default {
  name: 'TodosHome',
  components: {
    BIconThreeDots
  },
  data() {
    return {
      todos: [],
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    };
  },
  computed: {
    completedTodos() {
      return this.todos.filter(todo => !todo.completed);
    }
  },
  mounted() {
    // console.log('mounted', RESPONSE_TYPE);
    this.getTodos();
  },
  methods: {
    async getTodos() {
      const { responseType, data } = await TodosService.getTodos();
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        this.todos = data;
      } else {
        // error
      }
    },
    async updateTodo(id, completed) {
      console.log('updateTodo:', id, completed);
      const { responseType, data: updatedTodo } = await TodosService.updateTodo(
        id,
        {
          completed
        }
      );
      console.log('api done:', responseType, updatedTodo);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        if (updatedTodo) {
          // replace target todo
          this.todos.splice(
            this.todos.findIndex(todo => todo.id === id),
            1,
            updatedTodo
          );
          console.log('completed updated!');
        } else {
          // not found
          // recover target todo
          const todo = this.todos.find(todo => todo.id === id);
          todo.completed = !todo.completed;
          console.log('fail to update!');
        }
      } else {
        // error
        console.log('fail to update!');
      }
    },
    async deleteTodo(id) {
      console.log('deleteTodo:', id);
      const { responseType, data } = await TodosService.deleteTodo(id);
      console.log('api done:', responseType, data);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        if (data.result) {
          // delete target todo
          this.todos.splice(
            this.todos.findIndex(todo => todo.id === id),
            1
          );
          console.log('completed deteled!');
        } else {
          // not found
          console.log('fail to detele!');
        }
      } else {
        // error
      }
    },
    onInput(id, completed) {
      console.log('onInput:', id, completed);
      this.updateTodo(id, completed);
    },
    onEdit(id) {
      console.log('onEdit:', id);
    },
    onDelete(id) {
      console.log('onDelete:', id);
      this.deleteTodo(id);
    }
  }
};
</script>
