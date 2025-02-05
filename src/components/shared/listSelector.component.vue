<template>
  <div
    class="label_container">
    <label
      v-for="obj in props.listObj"
      @click="() => { changeCursor(obj.id) }"
      class="radio_button"
      :class="selected === obj.id ? 'selected' : ''">
      {{ obj.label }}
    </label>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'

  const props = defineProps({
    listObj: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      required: false,
      default: null,
    },
  })
  const emits = defineEmits([
    'changed',
  ])

  const selected = ref(null)

  onMounted(
    () => {
      changeCursor(props.selected)
    }
  )

  const changeCursor = (id) => {
    selected.value = id
    emits('changed', id)
  }
</script>

<style scoped lang="scss">
  .label_container {
    margin: 8px auto 0;
    padding: 0 0 8px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin; // Firefox用のスクロールバー調整
    scrollbar-color: #ccc transparent; // スクロールバーの色調整
  }
  .radio_button {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
    margin: 0 8px 0 0;
    border-radius: 4px;
    background-color: $color-gray;
    color: #ffffff;
    cursor: pointer;

    &.selected {
      background-color: $color-primary-main;
      color: $color-black;
      font-weight: bold;
    }
  }
</style>