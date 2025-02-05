<template>
  <button
    @click="clicked">
    {{ props.text }}
  </button>
</template>

<script
  setup>
  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
  })
  const emits = defineEmits(['clicked'])

  const clicked = () => {
    emits('clicked')
  }
</script>

<style
  scoped
  lang="scss">
  button {
    display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
    height: 48px;
    line-height: 48px;
    border-radius: 24px;
    color: #ffffff;
    font-weight: bold;
    font-size: 20px;
    background: linear-gradient(90deg, #DB36A4 0%, #FFC300 100%);
  }
</style>