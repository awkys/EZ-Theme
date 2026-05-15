<template>
  <TablerIconQRCode :size="size" :stroke-width="strokeWidth" :class="customClass" />
</template>

<script>
import IconQRCode from '@tabler/icons-vue/dist/esm/icons/IconQrcode.mjs';

export default {
  name: 'IconQRCode',
  components: {
    TablerIconQRCode: IconQRCode
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
