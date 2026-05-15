<template>
  <TablerIconSettings :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconSettings from '@tabler/icons-vue/dist/esm/icons/IconSettings.mjs';

export default {
  name: 'IconSettings',
  components: {
    TablerIconSettings: IconSettings
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
