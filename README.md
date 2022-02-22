# Vue2 Todos App

## 專案簡介

> 使用 Vue2 撰寫的簡易待辦事項清單專案

[Live Demo](https://shezimanor.github.io/vue2-todos-app/#/)

Framework: [Vue@2.6.14](https://v2.vuejs.org/) & [BootstrapVue@2.21.2](https://bootstrap-vue.org/) (with Vue Cli)

Data Storage: Browser's localStorage

## 功能列表

1. 待辦事項(CRUD)基本操作
2. 切換全部清單/待辦清單
3. 優先度(Priority)排序
4. 清單篩選(Filters)：今日待辦、分類篩選(Category)

## 專案導覽

### 1. `src/`

1. `components/AppHeader.vue` : 用來放置 LOGO 和篩選(Filters)下拉選單。
2. `services/localstorage-todo-service.js` : 模擬 API。
3. `store/modules/todo.js` : todos 資料操作與存取管理。
4. `utils/index.js` : 共用工具型函數。
5. `views/TodosHome.vue` : Todos App 主頁面。

### 2. `Libraries`

1. [Vuelidate](https://github.com/vuelidate/vuelidate): 表單驗證工具。
2. [uuid](https://github.com/uuidjs/uuid): uuid 產生器(用於產生 todo's id)。
