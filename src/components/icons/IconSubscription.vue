<template>
  <TablerIconSubscription :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconSubscription from '@tabler/icons-vue/dist/esm/icons/IconClipboard.mjs';

export default {
  name: 'IconSubscription',
  components: {
    TablerIconSubscription: IconSubscription
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
