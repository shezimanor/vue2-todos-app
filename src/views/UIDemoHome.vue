<template>
  <div>
    <div class="text-center">
      <b-button
        v-b-popover.hover="'I am popover content!'"
        title="Popover Title"
        >Hover Me</b-button
      >
      <b-button v-b-popover.hover title="Popover 2">Hover Me</b-button>
    </div>
  </div>
</template>

<script>
import { VBPopover } from 'bootstrap-vue';
export default {
  name: 'UIDemoHome',
  directives: {
    'b-popover': VBPopover
  }
};
</script>
