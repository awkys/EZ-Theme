<template>
  <TablerIconArrowRight :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconArrowRight from '@tabler/icons-vue/dist/esm/icons/IconArrowRight.mjs';

export default {
  name: 'IconArrowRight',
  components: {
    TablerIconArrowRight: IconArrowRight
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
