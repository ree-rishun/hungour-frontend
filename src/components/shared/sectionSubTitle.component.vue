<template>
  <h3>
    {{ props.title }}
  </h3>
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
  h3 {
    margin: 16px auto 0;
    font-size: $font-std;
    font-weight: bold;
    color: #ffffff;
  }
</style>