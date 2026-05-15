<template>
  <TablerIconFileText :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconFileText from '@tabler/icons-vue/dist/esm/icons/IconFileText.mjs';

export default {
  name: 'IconFileText',
  components: {
    TablerIconFileText: IconFileText
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
