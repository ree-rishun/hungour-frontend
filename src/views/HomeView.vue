<template>
  <div>

  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
  } from 'vue'

  const location = ref({
    lat: null,
    lng: null,
  })
  const errMessage = ref('')

  onMounted(
    async () => {
      // 現在地の取得
      const position = await getLocation()
      location.value.lat = position.coords.latitude
      location.value.lng = position.coords.longitude
      console.log(location.value)

      // 飲食店一覧の検索
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

  }
</script>


<style lang="scss" scoped>
</style>
