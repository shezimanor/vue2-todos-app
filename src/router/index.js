import Vue from 'vue';
import VueRouter from 'vue-router';
import TodosHome from '../views/TodosHome.vue';
import UIDemoHome from '../views/UIDemoHome.vue';
import TestHome from '../views/TestHome.vue';

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
  },
  {
    path: '/test',
    name: 'TestHome',
    component: TestHome
  }
];

const router = new VueRouter({
  routes
});

export default router;
