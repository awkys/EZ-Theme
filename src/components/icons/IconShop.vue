<template>
  <TablerIconShop :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconShop from '@tabler/icons-vue/dist/esm/icons/IconShoppingCart.mjs';

export default {
  name: 'IconShop',
  components: {
    TablerIconShop: IconShop
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
