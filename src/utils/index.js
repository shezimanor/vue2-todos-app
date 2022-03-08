import store from '@/store';
import { RESPONSE_TYPE } from '@/services/api-request';
let months = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
];

export const getTodos = async () => {
  const response = await store.dispatch('todo/getTodos', {
    page: 1,
    completed: false
  });
  // console.log('todos read api done:', response);
  // handle error
  if (response.responseType === RESPONSE_TYPE.CONNECT_CORRECT) {
    // console.log('got todos successfully!');
  } else {
    // error
    alert('fail to get todos');
  }
};

export const filterTodos = category => {
  store.dispatch('todo/filterTodos', category);
};

export const deepCopy = obj => JSON.parse(JSON.stringify(obj));
export const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
export const getTodayFormat = () => {
  const now = new Date();
  const nowDate = now.getDate();
  return `${now.getFullYear()}-${months[now.getMonth()]}-${
    ((nowDate / 10) | 0) >= 1 ? nowDate : `0${nowDate}`
  }`;
};
