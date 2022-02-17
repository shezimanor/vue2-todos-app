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
        <b-card-text>
          {{ todo.content }}
        </b-card-text>
        <div class="todosapp-card__footer">
          <b-badge
            v-if="todo.priority"
            :class="`badge-${todoPriorty[todo.priority].toLowerCase()}`"
            >{{ todoPriorty[todo.priority] }}</b-badge
          >
          <b-badge
            v-if="todo.category"
            :class="`badge-${todoCategory[todo.category].toLowerCase()}`"
            >{{ todoCategory[todo.category] }}</b-badge
          >
        </div>
        <b-form-checkbox
          v-model="todo.completed"
          class="todosapp-card__checkbox"
          @input="onCompleted(todo.id, todo.completed)"
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
        <b-form @submit="onSubmit" @reset="onReset">
          <!-- title -->
          <b-form-group
            id="formGroupTodoTitle"
            label-for="inputTodoTitle"
            :state="
              $v.currentTodo.title.$dirty && !$v.currentTodo.title.required
            "
          >
            <template #label>
              <label
                id="formGroupTodoTitle__BV_label_"
                for="inputTodoTitle"
                class="d-block"
              >
                <span class="text-danger">*</span> Title:
              </label>
            </template>
            <b-form-input
              id="inputTodoTitle"
              v-model="$v.currentTodo.title.$model"
              type="text"
              placeholder="Enter title"
              :state="inputState_title"
            ></b-form-input>
            <b-form-invalid-feedback>
              Title field is required.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- content -->
          <b-form-group
            id="formGroupTodoContent"
            label="Content:"
            label-for="textareaTodoContent"
            :state="
              $v.currentTodo.content.$dirty && !$v.currentTodo.content.maxLength
            "
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
            <b-form-invalid-feedback>
              Content field must be at most
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
          <b-button type="submit" variant="primary">Save</b-button>
          <b-button type="reset" variant="warning">Reset</b-button>
        </b-form>
      </div>
      <!-- loading -->
      <div v-else>
        <b-skeleton></b-skeleton>
        <b-skeleton></b-skeleton>
        <b-skeleton></b-skeleton>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { RESPONSE_TYPE } from '@/services/api-request';
import store from '@/store';
import { mapState, mapGetters } from 'vuex';
// b-icons: Importing specific icons
import { BIconPlus, BIconThreeDots } from 'bootstrap-vue';
// Vuelidate Library
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
// utils
import { deepCopy } from '@/utils';

async function getTodos() {
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
        maxLength: maxLength(60)
      }
    }
  },
  computed: {
    ...mapState({
      todos: state => state.todo.todos,
      todoCategory: state => state.todo.todoCategory,
      todoPriorty: state => state.todo.todoPriorty
    }),
    ...mapGetters('todo', ['completedTodos', 'getTodoById']),
    // inputState
    inputState_title() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.title.$dirty) return null;
      if (vm.$v.currentTodo.title.$invalid) return false;
      else return null;
    },
    inputState_content() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.content.$dirty) return null;
      if (vm.$v.currentTodo.content.$invalid) return false;
      else return null;
    }
  },
  // hook
  async beforeRouteEnter(routeTo, routeFrom, next) {
    // Called before component is created.
    await getTodos(routeTo, next);
    next();
  },
  async beforeRouteUpdate(routeTo, routeFrom, next) {
    // Called when the route changes, but still using the same component.
    await getTodos(routeTo, next);
    next();
  },
  methods: {
    async createTodo(createdTodo) {
      this.loading.currentTodo = true;
      const { responseType } = await store.dispatch(
        'todo/createTodo',
        createdTodo
      );
      console.log('todo create api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        console.log('created successfully!');
      } else {
        // error
        console.log('fail to create!');
      }
      this.loading.currentTodo = false;
    },
    async updateTodo(id, updatedTodo) {
      this.loading.currentTodo = true;
      console.log('updateTodo:', id, updatedTodo);
      const { responseType } = await store.dispatch('todo/updateTodo', {
        id,
        todo: updatedTodo
      });
      console.log('todo update api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        console.log('updated successfully!');
      } else {
        // error
        console.log('fail to update!');
      }
      this.loading.currentTodo = false;
    },
    async deleteTodo(id) {
      console.log('deleteTodo:', id);
      const { responseType } = await store.dispatch('todo/deleteTodo', id);
      console.log('todo detele api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        console.log('deteled successfully!');
      } else {
        // error
        console.log('fail to detele!');
      }
    },
    onCompleted(id, completed) {
      console.log('onCompleted:', id, completed);
      this.updateTodo(id, { completed });
    },
    async onEdit(id) {
      this.showModal();
      // getTodoById: Method-Style Vuex getters
      // deep clone object
      this.currentTodo = deepCopy(this.getTodoById(id));
      this.resetFormState();
      this.$v.currentTodo.$reset();
    },
    resetTodoForm() {
      this.resetFormState();
    },
    onCreate() {
      this.showModal();
      // generate a todo's template
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
      this.resetTodoForm();
    },
    onDelete(id) {
      console.log('onDelete:', id);
      this.deleteTodo(id);
    },
    onSubmit(event) {
      this.$v.currentTodo.$touch();
      // console.log('onSubmit:', this.currentTodo, this.$v.currentTodo);
      event.preventDefault();
      // Validate form
      if (this.$v.currentTodo.$invalid) return;
      // create or update
      if (!this.currentTodo.id) this.createTodo(this.currentTodo);
      else this.updateTodo(this.currentTodo.id, this.currentTodo);
      this.hideModal();
      this.currentTodo = null;
    },
    onReset(event) {
      event.preventDefault();
      this.currentTodo = Object.assign(this.currentTodo, {
        title: '',
        content: '',
        priority: null,
        completed: false,
        date: '',
        time: '',
        category: ''
      });
      this.resetTodoForm();
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
      this.$v.currentTodo.$reset();
    }
  }
};
</script>
