<template>
  <TablerIconShadow :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconShadow from '@tabler/icons-vue/dist/esm/icons/IconDeviceMobile.mjs';

export default {
  name: 'IconShadow',
  components: {
    TablerIconShadow: IconShadow
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
