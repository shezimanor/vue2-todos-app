<template>
  <div>
    <b-container class="border border-primary">
      <b-dropdown
        size="sm"
        variant="link"
        toggle-class="text-decoration-none"
        right
        no-caret
      >
        <template #button-content>
          <b-icon-three-dots variant="assistant"></b-icon-three-dots>
          <span class="sr-only">More Action</span>
        </template>
        <b-dropdown-item href="#">Action</b-dropdown-item>
        <b-dropdown-item href="#">Another action</b-dropdown-item>
        <b-dropdown-item href="#">Something else here...</b-dropdown-item>
      </b-dropdown>
    </b-container>
    <b-container class="border border-primary" fluid>fluid</b-container>
    <b-container class="border border-primary" fluid="sm">
      100% wide until small breakpoint
    </b-container>
    <b-container class="border border-primary" fluid="md">
      100% wide until medium breakpoint
    </b-container>
    <b-container class="border border-primary" fluid="lg">
      100% wide until large breakpoint
    </b-container>
    <b-container class="border border-primary" fluid="xl">
      100% wide until extra large breakpoint
    </b-container>
  </div>
</template>

<script>
import { BIconThreeDots } from 'bootstrap-vue';
export default {
  name: 'UIDemoHome',
  components: {
    BIconThreeDots
  }
};
</script>
