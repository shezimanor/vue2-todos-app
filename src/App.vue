<template>
  <div id="app" class="main-wrapper">
    <div class="d-flex w-100 px-3 py-2 justify-content-between">
      <router-link to="/" class="todosapp-logo text-primary"
        ><strong>Todo</strong></router-link
      >
    </div>
    <router-view />
  </div>
</template>
