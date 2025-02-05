<template>
  <button
    @click="clicked"
    :class="{ disable : !props.enable }">
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
    enable: {
      type: Boolean,
      required: false,
      defalut: true,
    }
  })
  const emits = defineEmits(['clicked'])

  const clicked = () => {
    if (!props.enable) {
      return
    }
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
    transition: background .5s ease;

    &.disable {
      background: $color-gray;
    }
  }
</style>