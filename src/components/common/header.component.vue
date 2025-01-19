<template>
  <header>
    <img
      src="@/assets/img/logo.svg"
      alt="hungourロゴ">
  </header>
</template>

<script setup>

</script>

<style scoped lang="scss">
  header {
    height: $header-height;
    img {
      display: block;
      height: 36px;
      padding: 0;
      margin: (($header-height - 36px) / 2) 0 0 16px;
    }
  }
</style>
