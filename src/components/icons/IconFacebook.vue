<template>
  <TablerIconFacebook :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconFacebook from '@tabler/icons-vue/dist/esm/icons/IconBrandFacebook.mjs';

export default {
  name: 'IconFacebook',
  components: {
    TablerIconFacebook: IconFacebook
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
