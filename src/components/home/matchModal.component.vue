<template>
  <div
    class="background">
    <div
      v-if="queue.length > 0"
      class="current-review">
      <p
        class="current-review_rate">
        {{ queue[0]?.rating ?? 0 }}
      </p>
      <p>
        {{queue[0]?.userRatingCount ?? 0}}件のクチコミ
      </p>
      <starRateComponent
        :score="String(queue[0]?.rating ?? 0)"
        :imageSize="48"/>
    </div>
    <vueTinder
      v-if="queue.length > 0"
      class="vue_tinder"
      ref="tinder"
      key-name="id"
      v-model:queue="queue"
      :max="3"
      :offset-y="0"
      allow-down
      @submit="onSubmit">
      <template
        #default="{ data }">
        <div
          class="card">
          <div
            class="shop-image"
            :style="{
            'background-image': `url(${getPhoto(data?.photos[0].name)})`
          }">
            <div
              class="shop-image_mask">
              <h3>
                {{ data.displayName.text }}
              </h3>
            </div>
          </div>
          <ul>
            <li>
              <span>予算</span>{{ data?.priceRange?.startPrice?.units ?? '-' }} ～ {{ data?.priceRange?.endPrice?.units ?? '-' }}円
            </li>
            <li>
              <span>営業終了</span>{{ convToJST(data.currentOpeningHours.nextCloseTime) }}
            </li>
            <li>
              <span>徒歩</span>{{ Math.floor(data?.extWalkTime) }}分
            </li>
          </ul>
        </div>
      </template>
      <template #like>
        like
      </template>
      <template #nope>
        nope
      </template>
      <template #super>
        super
      </template>
      <template #down>
        down
      </template>
      <template #rewind>
        rewind
      </template>
      <!--
      <img class="like-pointer" slot="like" src="./assets/nope-txt.png">
      <img class="nope-pointer" slot="nope" src="./assets/nope-txt.png">
      <img class="super-pointer" slot="super" src="./assets/super-txt.png">
      <img class="rewind-pointer" slot="rewind" src="./assets/rewind-txt.png">
      -->
    </vueTinder>
  </div>
  <div
    class="progress">
    <p>
      {{ shopCandidates.length }} / 3 完了
    </p>
    <div
      class="progress__bar">
      <span
        :style="`width: ${34 * shopCandidates.length}%;`"
      ></span>
    </div>
  </div>
</template>

<script
  setup>
  import {
    ref,
    onMounted,
    watchEffect,
  } from 'vue'
  import vueTinder from 'vue-tinder'
  import starRateComponent from '@/components/starRate.component.vue'
  import 'vue-tinder/lib/style.css'
  import { getPlacesPhoto } from '@/services/places.service.js'

  const props = defineProps(
    {
      shops: {
        required: true,
        default: [],
      },
    }
  )
  const emits = defineEmits(['completed'])
  const queue = ref([])
  const shops = ref([])
  const offset = ref(0)
  const shopCandidates = ref([])

  const mock = (count = 5, append = true) => {
    const list = []
    // TODO: 次のリストを取得
    for (let i = 0; i < count; i++) {
      list.push(shops.value[offset.value])
      offset.value++
    }
    if (append) {
      queue.value = queue.value.concat(list)
    } else {
      queue.value.unshift(...list)
    }
  }

  const onSubmit = (e) => {
    console.log(e)
    if (e.type === 'like') {
      shopCandidates.value.push(e.item)
      if (shopCandidates.value.length >= 3) {
        emits('completed', shopCandidates.value)
      }
    }
    if (queue.value.length < 3) {
      mock()
    }
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

  onMounted(
    () => {
      shops.value = props.shops
      queue.value = props.shops
    }
  )

  watchEffect(
    () => {
      shops.value = props.shops
      if (shops.value.length > 0 && queue.value.length === 0) {
        mock()
      }
  })
</script>

<style scoped lang="scss">
  .background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.7);
  }
  .current-review {
    padding: 64px 0 0;
    text-align: center;
    color: $color-primary-main;
    font-size: 16px;
    .current-review_rate {
      font-weight: bold;
      font-size: 32px;
    }
  }
  .vue_tinder {
    display: block;
    margin: 0 auto;
    width: calc(100% - 32px);
    height: 604px;
    max-height: calc(60vh + 4px);
    .card {
      height: 600px;
      max-height: 60vh;
      border: 2px solid $color-primary-main;
      border-radius: 8px;
      color: #ffffff;
      background-color: $color-background;
      overflow: hidden;

      .shop-image {
        position: relative;
        display: block;
        width: 100%;
        height: 220px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        .shop-image_mask {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(0, $color-background 0%, $color-background 5%, rgba(0,0,0,0) 50%);
        }
        h3 {
          position: absolute;
          bottom: 0;
          left: 0;
          min-height: 32px;
          padding: 0 16px;
          line-height: 32px;
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
        }
      }

      ul {
        li {
          padding: 0 16px;
          line-height: 32px;
          span {
            display: inline-block;
            color: $color-light-gray;
            width: 100px;
          }
        }
      }
    }
  }
  .progress {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 201;
    padding: 0 16px 8px;
    display: block;
    width: calc(100% - 32px);
    max-width: 400px;
    p {
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .progress__bar {
      width: 100%;
      height: 8px;
      margin: 4px auto 0;
      border-radius: 4px;
      background-color: $color-gray;
    }
    span {
      display: block;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #DB36A4 0%, #FFC300 100%);
      transition: width 0.5s ease;
    }
  }
</style>