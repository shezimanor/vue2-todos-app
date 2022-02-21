<template>
  <div id="app" class="main-wrapper">
    <app-header />
    <router-view />
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader';
export default {
  name: 'AppWrapper',
  components: {
    AppHeader
  }
};
</script>
