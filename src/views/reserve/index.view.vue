<template>
  <currentAddressComponent
    :currentAddress="currentAddress" />

  <h2
    v-if="reserve"
    class="about">
    <span>
      {{ departureTimes.find(item => item.id === reserve.departure_time).label }}
    </span>に出発予定で<span>
      {{ reservationCounts.find(item => item.id === reserve.party_size).label }}
    </span>で予約。
  </h2>

  <sectionTitleComponent
    title="詳細検索"/>
  <p
    v-if="reserve"
    class="plane_text">
    座席タイプ：{{ tableType.find(item => item.id === reserve.seat_type).label }}
  </p>

  <sectionTitleComponent
    title="予約候補"/>
  <p
    class="plane_text">
    リストの上から予約を行うため、行きたいお店を上から順に並べることをお勧めします。
  </p>
  <shopsSortComponent
    :shops="shops"
    @sorted="getSorted"/>

  <div
    class="bottom_area">
    <buttonComponent
      text="予約開始"
      :enable="true"
      @clicked="startReserve" />
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import currentAddressComponent from '@/components/shared/currentAddress.component.vue'
  import sectionTitleComponent from '@/components/shared/sectionTitle.component.vue'
  import sectionSubTitleComponent from '@/components/shared/sectionSubTitle.component.vue'
  import listSelectorComponent from '@/components/shared/listSelector.component.vue'
  import matchModalComponent from '@/components/home/matchModal.component.vue'
  import buttonComponent from '@/components/shared/button.component.vue'
  import shopsSortComponent from '@/components/reserve/shopsSort.component.vue'
  import { getGeocode } from '@/services/geocode.service.js'
  import { getReserve, postStartReserve } from '@/services/reserve.service.js'
  import { departureTimes, reservationCounts, tableType, } from '@/constants/labels.constant.js'
  import { getLocation, buildShortAddress } from '@/utils/geocode.util.js'

  const route = useRoute()
  const router = useRouter()
  const sortedShops = ref([])
  const reserve = ref(null)
  const shops = ref([])
  const currentAddress = ref('')
  const reserveId = ref('')
  const location = ref({
    lat: null,
    lng: null,
  })

  onMounted(
    async () => {
      // 現在地の取得
      location.value = await getLocation()
      // 住所名は非同期で取得
      getAddress()

      reserveId.value = route.params.id

      const reserveRes = await getReserve(reserveId.value)
      if (reserveRes.data.status !== 'created') {
        router.push(`/reserves/${reserveId.value}/status`)
      }
      shops.value = reserveRes.data.list
      reserve.value = reserveRes.data
      console.log(reserve.value)
      sortedShops.value = shops.value
    }
  )

  const getAddress = async () => {
    // 現在の住所を表示
    const res = await getGeocode(location.value)
    currentAddress.value = buildShortAddress(res.data.results[0])
  }

  const getSorted = (s) => {
    sortedShops.value = s
    console.log(sortedShops.value)
  }

  // 予約処理の開始と次のページへの遷移
  const startReserve = async () => {
    const shopList = []
    for (const s of sortedShops.value) {
      console.log(s)
      shopList.push({
        id: s.id,
        name: s.displayName.text,
        tel: s.nationalPhoneNumber,
      })
    }
    // Firestoreにデータの保存
    const res = await postStartReserve(
      reserveId.value,
      shopList,
    )
    console.log(res)

    // TODO: 予約ステータスページに遷移
    router.push(`/reserves/${reserveId.value}/status`)
  }
</script>

<style scoped lang="scss">
  .about {
    margin: 16px auto 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    span {
      color: $color-primary-main;
      font-size: 20px;
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
