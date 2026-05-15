<template>
  <TablerIconMoney :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconMoney from '@tabler/icons-vue/dist/esm/icons/IconCurrencyDollar.mjs';

export default {
  name: 'IconMoney',
  components: {
    TablerIconMoney: IconMoney
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
