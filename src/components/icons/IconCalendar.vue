<template>
  <TablerIconCalendar :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconCalendar from '@tabler/icons-vue/dist/esm/icons/IconCalendar.mjs';

export default {
  name: 'IconCalendar',
  components: {
    TablerIconCalendar: IconCalendar
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
