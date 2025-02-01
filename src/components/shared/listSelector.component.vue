<template>
  <div>
    <label
      v-for="obj in props.listObj"
      @click="() => { changeCursor(obj.id) }"
      class="radio_button"
      :class="checked === obj.id ? 'selected' : ''">
      {{ obj.label }}
    </label>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'

  const props = defineProps({
    listObj: {
      type: Object,
      required: true,
    },
    checked: {
      type: String,
      required: false,
      default: null,
    },
  })
  const emits = defineEmits([
    'changed',
  ])

  const checked = ref(null)

  onMounted(
    () => {
      checked.value = props.checked
    }
  )

  const changeCursor = (id) => {
    checked.value = id
    emits('changed', id)
  }
</script>

<style scoped lang="scss">
  .radio_button {
    display: inline-block;
    height: 32px;
    padding: 0 8px;
    margin: 0 8px 0 0;
    border-radius: 4px;
    background-color: $color-gray;
    color: #ffffff;
    cursor: pointer;

    &.selected {
      background-color: $color-primary-main;
    }
  }
</style>