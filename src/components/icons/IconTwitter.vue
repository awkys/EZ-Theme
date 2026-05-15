<template>
  <TablerIconTwitter :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconTwitter from '@tabler/icons-vue/dist/esm/icons/IconBrandTwitter.mjs';

export default {
  name: 'IconTwitter',
  components: {
    TablerIconTwitter: IconTwitter
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
