<template>
  <TablerIconArrowUp :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconArrowUp from '@tabler/icons-vue/dist/esm/icons/IconArrowUp.mjs';

export default {
  name: 'IconArrowUp',
  components: {
    TablerIconArrowUp: IconArrowUp
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
