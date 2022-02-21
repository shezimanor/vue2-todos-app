import Vue from 'vue';
import VueRouter from 'vue-router';
import TodosHome from '../views/TodosHome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'TodosHome',
    component: TodosHome
  }
];

const router = new VueRouter({
  routes
});

export default router;
