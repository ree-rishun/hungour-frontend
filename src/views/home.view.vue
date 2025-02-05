<template>
  <currentAddressComponent
    :currentAddress="currentAddress" />
  <div
    class="search_bar">
    <img
      src="@/assets/img/icon/search.svg"
      alt="検索アイコン">
    <input
      type="text"
      placeholder="焼き鳥">
  </div>
  <sectionSubTitleComponent
    title="出発可能な時間"/>
  <listSelectorComponent
    :listObj="departureTimes"
    @changed="updateDepartureTime"/>

  <sectionSubTitleComponent
    title="予約人数"/>
  <listSelectorComponent
    :listObj="reservationCounts"
    @changed="updatePartySize" />

  <sectionTitleComponent
    title="詳細検索"/>
  <p
    class="plane_text">
    ここで指定された内容は電話時に口頭で確認するため検索結果が必ず満たすものではありません。
  </p>

  <sectionSubTitleComponent
    title="座席タイプ"/>
  <listSelectorComponent
    :listObj="tableType"
    selected="none"
    @changed="updateSeatType"/>

  <matchModalComponent
    v-if="mode === 'match'"
    :shops="shops"
    @completed="startReserve" />

  <div
    class="bottom_area">
    <buttonComponent
      text="お店を探す"
      @clicked="searchShops" />
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
  } from 'vue'
  import axios from 'axios'
  import currentAddressComponent from '@/components/shared/currentAddress.component.vue'
  import sectionTitleComponent from '@/components/shared/sectionTitle.component.vue'
  import sectionSubTitleComponent from '@/components/shared/sectionSubTitle.component.vue'
  import listSelectorComponent from '@/components/shared/listSelector.component.vue'
  import matchModalComponent from '@/components/home/matchModal.component.vue'
  import buttonComponent from '@/components/shared/button.component.vue'
  import { getPlaces } from '@/services/places.service.js'
  import { getGeocode } from '@/services/geocode.service.js'
  import { postReserve } from '@/services/reserve.service.js'
  import { departureTimes, reservationCounts, tableType, } from '@/constants/labels.constant.js'
  import router from '../router'

  const location = ref({
    lat: null,
    lng: null,
  })
  const errMessage = ref('')
  const minRating = ref(3.0)
  const shops = ref([])
  const currentAddress = ref('')
  const mode = ref('default')

  const departureTime = ref(null)
  const partySize = ref(null)
  const seatType = ref(null)

  onMounted(
    async () => {
      // 現在地の取得
      const position = await getLocation()
      location.value.lat = position.coords.latitude
      location.value.lng = position.coords.longitude

      // 現在の住所を表示
      const res = await getGeocode(location.value)
      currentAddress.value = buildShortAddress(res.data.results[0])
    }
  )

  const updateDepartureTime = (val) => {
    departureTime.value = val
    console.log(departureTime.value)
  }
  const updatePartySize = (val) => {
    partySize.value = val
  }
  const updateSeatType = (val) => {
    seatType.value = val
  }

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
  const searchShops = async () => {
    mode.value = 'match'
    const res = await getPlaces(
      location.value,
      minRating.value,
    )
    shops.value = res.data
  }

  // 短縮住所の組立
  const buildShortAddress = (data) => {
    const area = data.address_components.find(component =>
      component.types.includes("administrative_area_level_1")
    )

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
  const startReserve = async (likedShops) => {
    // 予約を作成
    const res = await postReserve(
      likedShops,
      departureTime.value,
      partySize.value,
      seatType.value,
      location.value,
    )

    // 予約ページへ遷移
    router.push(`/reserves/${res.data.id}`)
  }
</script>


<style lang="scss" scoped>
  .shopInfo {
    margin: 0 auto 32px;
  }
  .search_bar {
    display: block;
    height: 48px;
    margin: 16px auto 0;
    background-color: $color-gray;
    border-radius: 4px;

    img {
      height: 24px;
      vertical-align: top;
      margin: 12px 0 0 8px;
    }
    input[type=text] {
      outline: none;
      border: none;
      background: none;

      display: inline-block;
      width: calc(100% - 24px - 8px - 32px - 8px);
      height: 48px;
      margin: 0 0 0 8px;
      line-height: 48px;
      vertical-align: top;
      font-weight: bolder;
      font-size: $font-std;
      color: $color-white;
    }
  }
  .plane_text {
    margin: 4px auto 0;
    font-weight: normal;
    font-size: $font-std;
    color: $color-light-gray;
  }
  .bottom_area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% - 32px);
    padding: 0 16px 16px;
  }
</style>
