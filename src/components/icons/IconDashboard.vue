<template>
  <TablerIconDashboard :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconDashboard from '@tabler/icons-vue/dist/esm/icons/IconDeviceDesktop.mjs';

export default {
  name: 'IconDashboard',
  components: {
    TablerIconDashboard: IconDashboard
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
