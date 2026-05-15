<template>
  <TablerIconSpinner :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconSpinner from '@tabler/icons-vue/dist/esm/icons/IconLoader2.mjs';

export default {
  name: 'IconSpinner',
  components: {
    TablerIconSpinner: IconSpinner
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
