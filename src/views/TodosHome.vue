<template>
  <div>
    <b-card-group tag="ul">
      <b-card v-for="todo in todos" :key="todo.id" :title="todo.title">
        <b-card-text class="text-description">
          {{ todo.content }}
        </b-card-text>
        <small class="text-muted">{{ todo.id }}</small>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { RESPONSE_TYPE } from '@/services/api-request';
import TodosService from '@/services/todos-service';
export default {
  name: 'TodosHome',
  data() {
    return {
      todos: []
    };
  },
  mounted() {
    // console.log('mounted', RESPONSE_TYPE);
    this.getTodos();
  },
  methods: {
    async getTodos() {
      const { responseType, data } = await TodosService.getTodos();
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) this.todos = data;
    }
  }
};
</script>
