<template>
  <div class="d-flex w-100 px-3 py-2 justify-content-between">
    <router-link to="/" class="todosapp-logo text-primary"
      ><strong>{{ appName }}</strong></router-link
    >
    <b-dropdown
      v-if="todos.length > 0"
      id="todoDropdownFilter"
      text="Filters"
      size="sm"
      variant="outline-success"
      menu-class="todosapp-filterdropdwon__menu"
      :popper-opts="dropdownPopperOption"
    >
      <template #button-content>
        <b class="mr-1">Filters</b>
        <b-badge v-if="uncompletedTodayTodosLength > 0" variant="danger"
          >{{ uncompletedTodayTodosLength
          }}<span class="sr-only">Today's todos</span></b-badge
        >
      </template>
      <template v-if="uncompletedTodayTodosLength > 0">
        <b-dropdown-item-button @click="filterTodos('today')">
          <b class="mr-1 text-warning">Today</b>
          <b-badge variant="danger"
            >{{ uncompletedTodayTodosLength
            }}<span class="sr-only">Today's todos</span></b-badge
          >
        </b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>
      </template>
      <b-dropdown-group id="todoDropdownCategoryGroup" header="Category">
        <b-dropdown-item-button
          v-for="(category_value, category_key) in todoCategory"
          :key="category_key"
          aria-describedby="todoDropdownCategoryGroup"
          @click="filterTodos(category_key)"
          :disabled="filteredTodosByCategory[category_key].length === 0"
          class="todosapp-filterdropdwon__menuitem"
          >{{ category_value }}</b-dropdown-item-button
        >
      </b-dropdown-group>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button
        class="todosapp-filterdropdwon__menuitem"
        @click="filterTodos('')"
        >All<span class="sr-only">All of todos</span></b-dropdown-item-button
      >
    </b-dropdown>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
// utils
import { filterTodos } from '@/utils';
export default {
  name: 'AppHeader',
  data() {
    return {
      appName: 'Todo',
      dropdownPopperOption: {
        placement: 'bottom-end'
      }
    };
  },
  computed: {
    ...mapState({
      todos: state => state.todo.todos,
      todoCategory: state => state.todo.todoCategory,
      todosFilterCondition: state => state.todo.todosFilterCondition
    }),
    ...mapGetters('todo', [
      'filteredTodosByCategory',
      'uncompletedTodayTodosLength'
    ])
  },
  methods: {
    filterTodos: filterTodos
  }
};
</script>
