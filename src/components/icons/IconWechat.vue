<template>
  <TablerIconWechat :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconWechat from '@tabler/icons-vue/dist/esm/icons/IconBrandWechat.mjs';

export default {
  name: 'IconWechat',
  components: {
    TablerIconWechat: IconWechat
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
