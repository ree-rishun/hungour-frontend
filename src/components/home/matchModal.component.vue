<template>
  <div
    class="background">
    <div
      class="current-review">
      <p
        class="current-review_rate">
        {{ shops[0]?.rating ?? 0 }}
      </p>
      <p>
        {{shops[0]?.userRatingCount ?? 0}}件のクチコミ
      </p>
      <starRateComponent
        :score="String(shops[0]?.rating ?? 0)"
        :imageSize="48"/>
    </div>
    <vueTinder
      v-if="props.shops.length > 0"
      ref="tinder"
      key-name="id"
      :queue="shops"
      :max="3"
      :offset-y="0"
      allow-down
      class="vue_tinder"
      @submit="onSubmit">
      <template
        v-slot="{data, i}">
        <div
          class="card"
          :key="data?.id ?? i">
          <div
            class="shop-image"
            :style="{
            'background-image': `url(${getPhoto(data.photos[0].name)})`
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
      <!--
      <img class="like-pointer" slot="like" src="./assets/nope-txt.png">
      <img class="nope-pointer" slot="nope" src="./assets/nope-txt.png">
      <img class="super-pointer" slot="super" src="./assets/super-txt.png">
      <img class="rewind-pointer" slot="rewind" src="./assets/rewind-txt.png">
      -->
    </vueTinder>
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

  const props = defineProps(
    {
      shops: {
        required: true,
        default: [],
      },
    }
  )
  const shops = ref([])

  const onSubmit = (e) => {
    console.log(shops.value)
    console.log(e)
  }

  const convToJST = (utcDateString) => {
    const d = new Date(utcDateString)

    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  }

  const getPhoto = (r) => {
    return `http://127.0.0.1:5001/hunger-gourmet/asia-northeast1/api/places/photos?name=${r}`
  }

  onMounted(
    () => {
      shops.value = props.shops
      console.log(shops.value)
    }
  )

  watchEffect(
    () => {
    shops.value = props.shops
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
      border-radius: 8px;
      border: solid $color-primary-main 2px;
      color: #ffffff;
      background-color: $color-background;

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
</style>