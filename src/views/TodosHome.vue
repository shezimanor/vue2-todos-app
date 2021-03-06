<template>
  <div>
    <div class="top-bar w-100 bg-lighter"></div>
    <b-container class="todosapp-container">
      <div class="w-100 mb-1 p-0 text-center">
        <b-button
          variant="primary"
          class="todosapp-createbutton shadow"
          @click="onCreate"
          ><b-icon-plus-square
            aria-hidden="true"
            :animation="
              uncompletedCurrentConditionTodos.length === 0 ? 'fade' : ''
            "
            font-scale="1.2"
          ></b-icon-plus-square>
          New Todo
        </b-button>
      </div>
      <div class="todosapp-header px-0 py-1" v-if="todosFilterCondition !== ''">
        <b-button variant="link" class="p-0 pr-1" @click="filterTodos('')">
          <b-icon-arrow-left-short
            scale="1.25"
            aria-hidden="true"
          ></b-icon-arrow-left-short>
          All
        </b-button>
        <h2>{{ todosFilterCondition | upperFirst }}</h2>
      </div>
      <div class="d-flex w-100 mb-2 px-0 py-1 justify-content-between">
        <b-form-checkbox
          v-if="hasPriorityTodo && unsortedTodos.length > 1"
          v-model="todosSettings.sortingPriority"
          variant="outline-assistant"
          name="sortingPriorityCheckButton"
          button
          button-variant="outline-description"
          size="sm"
          >{{
            todosSettings.sortingPriority ? 'Unsort' : 'Sort by Priority'
          }}</b-form-checkbox
        >
        <b-form-checkbox
          v-if="
            currentConditionTodosLength > 0 &&
            currentConditionTodosLength > uncompletedCurrentConditionTodosLength
          "
          v-model="todosSettings.showDone"
          name="showDoneCheckButton"
          button
          button-variant="outline-description"
          size="sm"
        >
          {{
            todosSettings.showDone ? 'Only todo' : 'Show done'
          }}</b-form-checkbox
        >
      </div>
      <transition-group
        name="todosapp-cardlist"
        tag="ul"
        class="todosapp-cardlist flex-column position-relative pl-0"
      >
        <b-card
          v-for="todo in currentTodos"
          :key="todo.id"
          :title="todo.title"
          tag="li"
          class="todosapp-card w-100 mb-4 px-4"
        >
          <div class="todosapp-card__detail mb-1">
            <b-badge v-if="todo.date" class="badge-date">{{
              todo.date | dateFormatter
            }}</b-badge>
          </div>
          <b-card-text>
            {{ todo.content }}
          </b-card-text>
          <div class="todosapp-card__detail">
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
          <keep-alive>
            <b-form-checkbox
              v-model="todo.completed"
              class="todosapp-card__checkbox"
              size="lg"
              @input="onCompleted(todo.id, todo.completed)"
            ></b-form-checkbox>
          </keep-alive>
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
      <b-modal
        ref="todoModal"
        scrollable
        hide-footer
        no-close-on-backdrop
        centered
        title="Todo"
        button-size="sm"
        class="todosapp-modal"
      >
        <!-- Todo Form -->
        <div v-if="!loading.currentTodo && currentTodo" ref="todoModalContent">
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
                <span class="text-danger">*</span> Title
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
              label="Content"
              label-for="textareaTodoContent"
              :state="
                $v.currentTodo.content.$dirty &&
                !$v.currentTodo.content.maxLength
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
            <b-row>
              <b-form-group
                id="formGroupTodoDate"
                label="Date"
                label-for="datepickerTodoDate"
                label-sr-only
                class="col-md-8"
                v-if="todoFormSettings.date.switch"
              >
                <b-form-datepicker
                  id="datepickerTodoDate"
                  v-model="currentTodo.date"
                  placeholder="Choose a date"
                  locale="en"
                  reset-button
                  hide-header
                  :date-format-options="{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }"
                  :min="todoFormSettings.date.minDate"
                >
                  <template #button-content>
                    <b-icon-calendar-event
                      scale="0.9"
                      style="color: #696969"
                    ></b-icon-calendar-event>
                  </template>
                </b-form-datepicker>
              </b-form-group>
            </b-row>
            <!-- priority -->
            <b-row>
              <b-form-group
                id="formGroupTodoPriority"
                label="Priority"
                label-for="selectTodoPriority"
                class="col-md-8"
              >
                <b-form-select
                  id="selectTodoPriority"
                  v-model="currentTodo.priority"
                  :options="todoFormSettings.priority.options"
                ></b-form-select>
              </b-form-group>
            </b-row>
            <!-- category -->
            <b-row>
              <b-form-group
                id="formGroupTodoCategory"
                label="Category"
                label-for="selectTodoCategory"
                class="col-md-8"
              >
                <b-form-select
                  id="selectTodoCategory"
                  v-model="currentTodo.category"
                  :options="todoFormSettings.category.options"
                ></b-form-select>
              </b-form-group>
            </b-row>
            <div class="todosapp-modal__footer text-right">
              <b-button
                type="reset"
                variant="warning"
                size="sm"
                style="margin-right: 8px"
                >Reset</b-button
              >
              <b-button type="submit" variant="primary" size="sm"
                >Save</b-button
              >
            </div>
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
  </div>
</template>

<script>
import { RESPONSE_TYPE } from '@/services/api-request';
import { mapState, mapGetters } from 'vuex';
// b-icons: Importing specific icons
import {
  BIconArrowLeftShort,
  BIconCalendarEvent,
  BIconPlusSquare,
  BIconThreeDots
} from 'bootstrap-vue';
// Vuelidate Library
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
// utils
import {
  getTodos,
  filterTodos,
  deepCopy,
  getToday,
  getTodayFormat
} from '@/utils';

const today = getToday();
// 15th two months prior
const minDate = new Date(today);

export default {
  name: 'TodosHome',
  components: {
    BIconArrowLeftShort,
    BIconCalendarEvent,
    BIconPlusSquare,
    BIconThreeDots
  },
  filters: {
    upperFirst(value) {
      let first = value.charAt(0);
      return value.replace(first, first.toUpperCase());
    },
    dateFormatter(value) {
      return value.replace(/-/g, '/');
    }
  },
  mixins: [validationMixin],
  data() {
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
        category: {
          options: [
            { value: '', text: 'None' },
            { value: 'life', text: 'Life' },
            { value: 'work', text: 'Work' },
            { value: 'plan', text: 'Plan' }
          ]
        },
        priority: {
          options: [
            { value: 0, text: 'None' },
            { value: 1, text: 'Low' },
            { value: 2, text: 'Medium' },
            { value: 3, text: 'High' }
          ]
        }
      },
      todosSettings: {
        showDone: false,
        sortingPriority: false
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
    // vuex state
    ...mapState({
      todos: state => state.todo.todos,
      todoCategory: state => state.todo.todoCategory,
      todoPriorty: state => state.todo.todoPriorty,
      todosFilterCondition: state => state.todo.todosFilterCondition
    }),
    // vuex getters
    ...mapGetters('todo', [
      'currentConditionTodos',
      'uncompletedCurrentConditionTodos',
      'currentConditionTodosLength',
      'uncompletedCurrentConditionTodosLength',
      'getTodoById'
    ]),
    // inputState(null/false)
    inputState_title() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.title.$dirty) return null;
      if (vm.$v.currentTodo.title.$invalid) return false;
      else return null;
    },
    // inputState(null/false)
    inputState_content() {
      const vm = this;
      if (!vm.currentTodo || !vm.$v.currentTodo.content.$dirty) return null;
      if (vm.$v.currentTodo.content.$invalid) return false;
      else return null;
    },
    unsortedTodos() {
      return this.todosSettings.showDone
        ? this.currentConditionTodos
        : this.uncompletedCurrentConditionTodos;
    },
    sortedPriorityTodos() {
      let sortedPriorityTodos = this.unsortedTodos.slice();
      return sortedPriorityTodos.sort((todo_a, todo_b) => {
        if (todo_a.priority > todo_b.priority) {
          return -1;
        } else if (todo_a.priority < todo_b.priority) {
          return 1;
        }
        return 0;
      });
    },
    hasPriorityTodo() {
      return this.unsortedTodos.findIndex(todo => todo.priority > 0) !== -1
        ? true
        : false;
    },
    currentTodos() {
      return this.todosSettings.sortingPriority
        ? this.sortedPriorityTodos
        : this.unsortedTodos;
    },
    // the invalid form need to be scrolled this DOM element.
    _$modalBody() {
      let modalBodyContent = this.$refs['todoModalContent'];
      return modalBodyContent ? modalBodyContent.parentNode : null;
    }
  },
  watch: {
    'todoFormSettings.date.switch'(switchValue) {
      // when date's switch is `off`, clear `currentTodo` date's value
      if (!switchValue) this.currentTodo.date = '';
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
      const { responseType } = await this.$store.dispatch(
        'todo/createTodo',
        createdTodo
      );
      // console.log('todo create api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        // console.log('created successfully!');
      } else {
        // error
        // alert('fail to create!');
      }
      this.loading.currentTodo = false;
    },
    async updateTodo(id, updatedTodo) {
      this.loading.currentTodo = true;
      const { responseType } = await this.$store.dispatch('todo/updateTodo', {
        id,
        todo: updatedTodo
      });
      // console.log('todo update api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        // console.log('updated successfully!');
      } else {
        // error
        // alert('fail to update!');
      }
      this.loading.currentTodo = false;
    },
    async deleteTodo(id) {
      const { responseType } = await this.$store.dispatch(
        'todo/deleteTodo',
        id
      );
      // console.log('todo detele api done:', responseType);
      if (responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
        // console.log('deteled successfully!');
      } else {
        // error
        // alert('fail to detele!');
      }
    },
    filterTodos: filterTodos,
    onCompleted(id, completed) {
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
        priority: 0,
        completed: false,
        date: '',
        category: '',
        id: null
      };
      // consider current condition
      switch (this.todosFilterCondition) {
        case 'today':
          this.currentTodo.date = getTodayFormat();
          break;
        case '':
          break;
        default:
          this.currentTodo.category = this.todosFilterCondition;
          break;
      }
      this.resetTodoForm();
    },
    onDelete(id) {
      this.deleteTodo(id);
    },
    onSubmit(event) {
      event.preventDefault();
      // to trigger Validation
      this.$v.currentTodo.$touch();
      // Validate form
      if (this.$v.currentTodo.$invalid) return this._$modalBody.scrollTo(0, 0);
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
        priority: 0,
        completed: false,
        date: '',
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
      }
      this.$v.currentTodo.$reset();
    }
  }
};
</script>
<style lang="scss" scoped>
.top-bar {
  height: 3rem;
}
@media screen and (min-width: 576px) {
  .top-bar {
    height: 4rem;
  }
}
</style>
