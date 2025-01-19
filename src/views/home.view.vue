<template>
  <div>
    <div
      class="shopInfo"
      v-for="shop in shops">
      <h3>
        {{ shop.displayName.text }}
      </h3>

      <starRateComponent
        :score="shop?.rating ?? 0"/>

      <p>
      予算：{{ shop?.priceRange?.startPrice?.units ?? '-' }} ～ {{ shop?.priceRange?.endPrice?.units ?? '-' }}円
      </p>
    </div>
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
  } from 'vue'
  import axios from 'axios'
  import starRateComponent from '../components/starRate.component.vue'

  const location = ref({
    lat: null,
    lng: null,
  })
  const errMessage = ref('')
  const minRating = ref(3.0)
  const shops = ref([])

  onMounted(
    async () => {
      // 現在地の取得
      const position = await getLocation()
      location.value.lat = position.coords.latitude
      location.value.lng = position.coords.longitude
      console.log(location.value)

      // 飲食店一覧の検索
      await getPlaces()
    }
  )

  // 現在地の取得
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          err => {
            errMessage.value = '不明なエラーが発生しました'
            if (err.code === err.PERMISSION_DENIED) {
              errMessage.value = '位置情報の取得が許可されていません'
            }
            if (err.code === err.POSITION_UNAVAILABLE) {
              errMessage.value = '位置情報を取得できませんでした'
            }
            if (err.code === err.TIMEOUT) {
              errMessage.value = '位置情報の取得にタイムアウトしました'
            }
          }
        )
      } else {
        errMessage.value = 'Geolocation API がサポートされていません'
      }
    })
  }

  // 飲食店一覧の検索
  const getPlaces = async () => {
    const res = await axios.post(
      'http://127.0.0.1:5001/hunger-gourmet/asia-northeast1/api/places/',
      {
        text: '居酒屋',
        lat: location.value.lat,
        lng: location.value.lng,
        radius: 10000,
        min_rating: minRating.value,
        open_now: true,
        include_pure_service_area_businesses: true,
        departure_in_minutes: 5,
      }
    )

    console.log(res)
    shops.value = res.data
  }

  // 予約の開始
  const startReserve = async () => {
    // TODO: Firestoreに予約対象を保存

    // TODO: 予約状況ページへ遷移
  }
</script>


<style lang="scss" scoped>
  .shopInfo {
    margin: 0 auto 32px;
  }
</style>
