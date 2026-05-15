<template>
  <TablerIconCopy :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconCopy from '@tabler/icons-vue/dist/esm/icons/IconCopy.mjs';

export default {
  name: 'IconCopy',
  components: {
    TablerIconCopy: IconCopy
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
