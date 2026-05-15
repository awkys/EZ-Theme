<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="customClass"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M6 9l6 6l6 -6" />
  </svg>
</template>

<script>
export default {
  name: "LiteIconChevronDown",
  props: {
    size: {
      type: [Number, String],
      default: 24,
    },
    strokeWidth: {
      type: [Number, String],
      default: 2,
    },
    customClass: {
      type: String,
      default: "",
    },
  },
};
</script>
