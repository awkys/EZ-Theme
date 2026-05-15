<template>
  <TablerIconUser :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconUser from '@tabler/icons-vue/dist/esm/icons/IconUser.mjs';

export default {
  name: 'IconUser',
  components: {
    TablerIconUser: IconUser
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
