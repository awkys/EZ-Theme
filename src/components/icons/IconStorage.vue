<template>
  <TablerIconStorage :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconStorage from '@tabler/icons-vue/dist/esm/icons/IconDatabase.mjs';

export default {
  name: 'IconStorage',
  components: {
    TablerIconStorage: IconStorage
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
