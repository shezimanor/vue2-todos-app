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
    <b-button variant="primary" class="todosapp-createbutton" @click="onCreate"
      ><b-icon-plus
        scale="2.3"
        aria-label="Add"
        :animation="completedTodos.length === 0 ? 'fade' : ''"
      ></b-icon-plus
    ></b-button>
    <b-modal
      ref="todoModal"
      scrollable
      hide-footer
      no-close-on-backdrop
      centered
      title="Todo"
      button-size="sm"
    >
      <!-- Todo Form -->
      <div v-if="!loading.currentTodo && currentTodo">
        <b-form @submit="onSubmit">
          <!-- title -->
          <b-form-group
            id="formGroupTodoTitle"
            label="Title:"
            label-for="inputTodoTitle"
          >
            <b-form-input
              id="inputTodoTitle"
              v-model="$v.currentTodo.title.$model"
              type="text"
              placeholder="Enter title"
              :state="inputState_title"
            ></b-form-input>
            <b-form-invalid-feedback :state="$v.currentTodo.title.required">
              Title is required.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- content -->
          <b-form-group
            id="formGroupTodoContent"
            label="Content:"
            label-for="textareaTodoContent"
          >
            <b-form-textarea
              id="textareaTodoContent"
              v-model="$v.currentTodo.content.$model"
              type="text"
              placeholder="Enter content"
              rows="4"
              debounce="300"
              no-resize
              no-auto-shrink
              trim
              :state="inputState_content"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="$v.currentTodo.content.maxLength">
              Content have at most
              {{ $v.currentTodo.content.$params.maxLength.max }} letters.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- date(switch) -->
          <b-form-checkbox
            v-model="todoFormSettings.date.switch"
            name="dateSwitchButton"
            switch
            class="mb-2"
          >
            Date
          </b-form-checkbox>
          <!-- date -->
          <b-form-group
            id="formGroupTodoDate"
            label="Date:"
            label-for="datepickerTodoDate"
            label-sr-only
            v-if="todoFormSettings.date.switch"
          >
            <b-form-datepicker
              id="datepickerTodoDate"
              v-model="currentTodo.date"
              placeholder="Choose a date"
              locale="en"
              :hide-header="true"
              :date-format-options="{
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }"
              :min="todoFormSettings.date.minDate"
            ></b-form-datepicker>
          </b-form-group>
          <!-- time(switch) -->
          <b-form-checkbox
            v-model="todoFormSettings.time.switch"
            name="timeSwitchButton"
            switch
            class="mb-2"
          >
            Time
          </b-form-checkbox>
          <!-- time -->
          <b-form-group
            id="formGroupTodoTime"
            label="Time:"
            label-for="datepickerTodoTime"
            label-sr-only
            v-if="todoFormSettings.time.switch"
          >
            <b-form-timepicker
              id="datepickerTodoTime"
              v-model="currentTodo.time"
              placeholder="Choose a time"
              now-button
              reset-button
              :hide-header="true"
              locale="en"
            ></b-form-timepicker>
          </b-form-group>
          <!-- priority -->
          <b-form-group
            id="formGroupTodoPriority"
            label="Priority:"
            label-for="selectTodoPriority"
          >
            <b-form-select
              id="selectTodoPriority"
              v-model="currentTodo.priority"
              :options="todoFormSettings.priority.options"
            ></b-form-select>
          </b-form-group>
          <!-- category -->
          <b-form-group
            id="formGroupTodoCategory"
            label="Category:"
            label-for="selectTodoCategory"
          >
            <b-form-select
              id="selectTodoCategory"
              v-model="currentTodo.category"
              :options="todoFormSettings.category.options"
            ></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="warning">Reset</b-button>
        </b-form>
      </div>
      <!-- loading -->
      <div v-else>
        <b-skeleton></b-skeleton>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { RESPONSE_TYPE } from '@/services/api-request';
import TodosService from '@/services/todos-service';
import store from '@/store';
import { mapState } from 'vuex';
// b-icons: Importing specific icons
import { BIconPlus, BIconThreeDots } from 'bootstrap-vue';
// Vuelidate Library
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

async function getTodos(routeTo, next) {
  console.log(`getTodos`);

  const response = await store.dispatch('todo/getTodos', {
    page: 1,
    completed: false
  });
  console.log(`getTodos: `, response);

  // handle error
  if (response.responseType !== RESPONSE_TYPE.CONNECT_CORRECT) {
    console.log(`getTodos error`);
  }

  next();
}

export default {
  name: 'TodosHome',
  components: {
    BIconPlus,
    BIconThreeDots
  },
  mixins: [validationMixin],
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 15th two months prior
    const minDate = new Date(today);
    return {
      currentTodo: null,
      loading: {
        todos: true,
        currentTodo: false
      },
      todoFormSettings: {
        date: {
          switch: false,
          minDate: minDate
        },
        time: {
          switch: false
        },
        category: {
          options: [
            { value: '', text: '--' },
            { value: 'life', text: 'Life' },
            { value: 'work', text: 'Work' },
            { value: 'plan', text: 'Plan' }
          ]
        },
        priority: {
          options: [
            { value: null, text: 'None' },
            { value: 1, text: 'Low' },
            { value: 2, text: 'Medium' },
            { value: 3, text: 'High' }
          ]
        }
      }
    };
  },
  validations: {
    currentTodo: {
      title: {
        required
      },
      content: {
        maxLength: maxLength(300)
      }
    }
  },
  computed: {
    ...mapState({
      todos: state => state.todo.todos
    }),
    completedTodos() {
      return this.todos.filter(todo => !todo.completed);
    },
    // inputState
    inputState_title() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.title.$dirty) return null;
      if (vm.$v.currentTodo.title.$invalid) return false;
      else return true;
    },
    inputState_content() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.content.$dirty) return null;
      if (vm.$v.currentTodo.content.$invalid) return false;
      else return true;
    }
  },
  // hook
  async beforeRouteEnter(routeTo, routeFrom, next) {
    // Called before component is created.
    await getTodos(routeTo, next);
  },
  async beforeRouteUpdate(routeTo, routeFrom, next) {
    // Called when the route changes, but still using the same component.
    await getTodos(routeTo, next);
  },
  methods: {
    // async getTodos() {
    //   this.loading.todos = true;
    //   const { responseType, data } = await TodosService.getTodos();
    //   if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
    //     this.todos = data;
    //   } else {
    //     // error
    //   }
    //   this.loading.todos = false;
    // },
    async getTodo(id) {
      this.loading.currentTodo = true;
      const { responseType, data } = await TodosService.getTodo(id);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        this.currentTodo = data;
        console.log('get todo');
      } else {
        // error
      }
      this.loading.currentTodo = false;
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
    async onEdit(id) {
      console.log('onEdit:', id);
      this.showModal();
      this.currentTodo = null;
      await this.getTodo(id);
      this.resetFormState();
      this.$v.currentTodo.$reset();
      console.log('onEdit done');
    },
    onCreate() {
      this.showModal();
      // Todo Template
      this.currentTodo = {
        title: '',
        content: '',
        priority: null,
        completed: false,
        date: '',
        time: '',
        category: '',
        id: null
      };
      this.resetFormState();
      this.$v.currentTodo.$reset();
    },
    onDelete(id) {
      console.log('onDelete:', id);
      this.deleteTodo(id);
    },
    onSubmit(event) {
      console.log('onSubmit:', this.currentTodo);
      event.preventDefault();
    },
    showModal() {
      this.$refs['todoModal'].show();
    },
    hideModal() {
      this.$refs['todoModal'].hide();
    },
    resetFormState() {
      if (this.currentTodo) {
        this.todoFormSettings.date.switch =
          this.currentTodo.date !== '' ? true : false;
        this.todoFormSettings.time.switch =
          this.currentTodo.time !== '' ? true : false;
      }
    }
  }
};
</script>
