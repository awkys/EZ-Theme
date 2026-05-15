<template>
  <TablerIconUsers :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconUsers from '@tabler/icons-vue/dist/esm/icons/IconUsers.mjs';

export default {
  name: 'IconUsers',
  components: {
    TablerIconUsers: IconUsers
  },
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    customClass: {
      type: String,
      default: ''
    }
  }
};
</script>
