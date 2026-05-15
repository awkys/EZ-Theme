<template>
  <TablerIconDocument :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconDocument from '@tabler/icons-vue/dist/esm/icons/IconFileText.mjs';

export default {
  name: 'IconDocument',
  components: {
    TablerIconDocument: IconDocument
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
