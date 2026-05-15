<template>
  <TablerIconSurfboard :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconSurfboard from '@tabler/icons-vue/dist/esm/icons/IconBrandSurfshark.mjs';

export default {
  name: 'IconSurfboard',
  components: {
    TablerIconSurfboard: IconSurfboard
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
