<template>
  <p
    v-if="currentAddress"
    class="current_address">
    <img
      src="@/assets/img/icon/location_pin.svg"
      alt="位置情報ピン">
    {{ currentAddress }}
  </p>
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
  const currentAddress = ref(null)

  onMounted(
    async () => {
      // 現在地の取得
      const position = await getLocation()
      location.value.lat = position.coords.latitude
      location.value.lng = position.coords.longitude

      const addr = await getAddress()
      currentAddress.value = buildShortAddress(addr)
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

  // 座標から住所文字列の取得
  const getAddress = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5001/hunger-gourmet/asia-northeast1/api/geocode/?lat=${location.value.lat}&lng=${location.value.lng}`,
    )
    console.log(res)

    return res.data.results[0]
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

  const buildShortAddress = (data) => {
    const area = data.address_components.find(component =>
      component.types.includes("administrative_area_level_1")
    )

    console.log(data)

    if (area?.long_name ?? null) {
      const index = data.formatted_address.indexOf(area.long_name)
      if (index) {
        return data.formatted_address.slice(index + area.long_name.length)
      }
    }


    // 区以下の要素をフィルタリングするタイプ
    const targetTypes = [
      'locality',               // 区
      'sublocality_level_2',    // 地域名（例: 歌舞伎町）
      'sublocality_level_3',    // 丁目（例: １丁目）
      'sublocality_level_4',    // 丁番（例: ４）
      'premise'                 // 建物名や施設名（例: １）
    ]

    // 条件に一致する要素を順番に取得
    const filteredComponents = data.address_components.filter(component =>
      component.types.some(type => targetTypes.includes(type))
    )

    // 各要素の long_name を連結して住所を生成
    return filteredComponents
      .reverse()
      .map(component => component.long_name)
      .join('')
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
