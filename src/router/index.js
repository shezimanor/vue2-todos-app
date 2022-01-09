import Vue from 'vue';
import VueRouter from 'vue-router';
import TodosHome from '../views/TodosHome.vue';
import UIDemoHome from '../views/UIDemoHome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'TodosHome',
    component: TodosHome
  },
  {
    path: '/ui-demo',
    name: 'UIDemoHome',
    component: UIDemoHome
  }
];

const router = new VueRouter({
  routes
});

export default router;
