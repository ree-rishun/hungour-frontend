<template>
  <ul
    class="items">
    <li
      v-for="(item, index) in shops"
      :key="item.id"
      class="item"
      :class="{ dragging: index === draggedIndex || index === touchDragIndex }"
      draggable="true"
      @dragstart="onDragStart($event, index)"
      @dragover="onDragOver($event, index)"
      @drop="onDrop($event, index)"
      @touchstart="onTouchStart($event, index)"
      @touchmove="onTouchMove($event)"
      @touchend="onTouchEnd($event, index)"
      >
      <div
        class="item__image"
        :style="{
            'background-image': `url(${getPhoto(item?.photos[0].name)})`
          }">
      </div><div
        class="item__text">
        <h3>{{ item.displayName.text }}</h3>
        <p>
          {{ convToJST(item.currentOpeningHours.nextCloseTime) }}閉店 / 徒歩{{ Math.floor(item?.extWalkTime) }}分
        </p>
      </div>
    </li>
    </ul>
</template>
<script setup>
  import {ref, onMounted, watchEffect} from 'vue'
  import { getPlacesPhoto } from '@/services/places.service.js'

  const props = defineProps({
    shops: {
      type: Object,
      required: true,
    }
  })
  const emits = defineEmits([
    'sorted',
  ])

  const shops = ref([])
  const draggedIndex = ref(null)
  const touchDragIndex = ref(null)
  const touchStartY = ref(0)
  const touchCurrentY = ref(0)

  onMounted( ()=>{
    shops.value = props.shops
  })

  /** ドラッグ操作が開始されたときに呼び出されます。ドラッグされるアイテムのインデックスを保存し、ドラッグ効果を設定します。 */
  const onDragStart = (event, index) => {
    draggedIndex.value = index
    event.dataTransfer.effectAllowed = 'move'
  }

  /** ドラッグ中にドラッグ対象のアイテムが他のアイテム上にあるときに呼び出されます。ドロップを許可するためにデフォルトの動作を無効にします。 */
  const onDragOver = (event, index) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  /* ドロップ操作が完了したときに呼び出されます。ドラッグされたアイテムを新しい位置に移動します。 */
  const onDrop = (event, index) => {
    event.preventDefault()
    if (draggedIndex.value !== null && draggedIndex.value !== index) {
      const draggedItem = shops.value[draggedIndex.value]
      shops.value.splice(draggedIndex.value, 1)
      shops.value.splice(index, 0, draggedItem)
      draggedIndex.value = null
    }
  }

  /** タッチが開始されたときに呼び出されます。タッチされたアイテムのインデックスと開始位置を保存します。 */
  const onTouchStart = (event, index) => {
    touchDragIndex.value = index
    touchStartY.value = event.touches[0].clientY
  }

  /** タッチ移動中に呼び出されます。アイテムの位置をタッチ移動に合わせて更新します。 */
  const onTouchMove = (event) => {
    touchCurrentY.value = event.touches[0].clientY
    const moveDistance = touchCurrentY.value - touchStartY.value
    event.currentTarget.style.transform = `translateY(${moveDistance}px)`
  }

  /** タッチが終了したときに呼び出されます。ドラッグされたアイテムを新しい位置に移動します。 */
  const onTouchEnd = (event, index) => {
    const moveDistance = touchCurrentY.value - touchStartY.value
    event.currentTarget.style.transform = ''
    const targetIndex = touchDragIndex.value + Math.round(moveDistance / event.currentTarget.clientHeight)
    if (targetIndex !== touchDragIndex.value && targetIndex >= 0 && targetIndex < shops.value.length) {
      const draggedItem = shops.value[touchDragIndex.value]
      shops.value.splice(touchDragIndex.value, 1)
      shops.value.splice(targetIndex, 0, draggedItem)
      emits('sorted', shops.value)
    }
    touchDragIndex.value = null
    touchStartY.value = 0
    touchCurrentY.value = 0
  }

  /** ドラッグ操作が終了したときに呼び出されます。draggedIndex を null にリセットして、ドラッグ中のスタイルを解除します。 */
  const onDragEnd = () => {
    draggedIndex.value = null
  }

  const convToJST = (utcDateString) => {
    if (!utcDateString) {
      return '24時間'
    }
    const d = new Date(utcDateString)

    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  }

  const getPhoto = (r) => {
    return getPlacesPhoto(r)
  }

  watchEffect(
    () => {
      shops.value = props.shops
    })
</script>

<style
  scoped
  lang="scss">
  .items {
    margin: 8px auto 0;
  }
  .item {
    display: block;
    margin: 8px auto 0;
    padding: 8px 8px 8px 32px;
    border-radius: 4px;
    background-color: $color-gray;
    background-image: url("@/assets/img/icon/drag_indicator_icon.svg");
    background-repeat: no-repeat;
    background-position: center left 4px;
    cursor: grab;
    touch-action: none;
    color: #ffffff;

    .item__image {
      display: inline-block;
      width: 48px;
      height: 48px;
      margin: 0 8px 0 0;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      vertical-align: top;
    }
    .item__text {
      display: inline-block;
      width: calc(100% - 48px - 8px);
      vertical-align: top;
      h2 {
        line-height: 24px;
        height: 24px;
        font-weight: bold;
        font-size: 18px;
      }
      p {
        line-height: 24px;
        height: 24px;
        font-size: 16px;
        color: $color-light-gray;
      }
    }
  }
  .dragging {
    z-index: 10;
    position: relative;
    opacity: .8;
  }
</style>

