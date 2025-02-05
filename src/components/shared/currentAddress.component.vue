<template>
  <p
    v-if="props.currentAddress"
    class="current_address">
    <img
      src="@/assets/img/icon/location_pin.svg"
      alt="位置情報ピン">
    {{ props.currentAddress }}
  </p>
</template>

<script setup>
  const props = defineProps({
    currentAddress: {
      type: String,
      required: true,
    }
  })

</script>

<style scoped lang="scss">
  .current_address {
    margin: 0 auto;
    color: $color-white;
    height: 22px;
    line-height: 22px;
    vertical-align: middle;

    img {
      display: inline-block;
      height: 22px;
      margin: 0 4px 0 0;
      vertical-align: middle;
    }
  }
</style>