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
      :enable="departureTime !== null && partySize !== null"
      @clicked="searchShops" />
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
  } from 'vue'
  import { useRouter } from 'vue-router'
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
  import { getLocation, buildShortAddress } from '@/utils/geocode.util.js'

  const router = useRouter()
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
      location.value = await getLocation()
      getAddress()
    }
  )

  const getAddress = async () => {
    // 現在の住所を表示
    const res = await getGeocode(location.value)
    console.log(res)
    currentAddress.value = buildShortAddress(res.data.results[0])
  }

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

  // 飲食店一覧の検索
  const searchShops = async () => {
    mode.value = 'match'
    const res = await getPlaces(
      location.value,
      minRating.value,
    )
    shops.value = res.data
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
