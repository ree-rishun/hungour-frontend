<template>
  <h2>
    {{ props.title }}
  </h2>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    }
  })

</script>

<style scoped lang="scss">
  h2 {
    margin: 16px auto 0;
    font-weight: bold;
    font-size: 20px;
    color: #ffffff;
  }
</style>