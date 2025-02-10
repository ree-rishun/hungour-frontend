<template>
  <div
    v-if="'reserving' === reserveStatus">
    <h2
      class="about">
      予約中
    </h2>
    <p
      class="plane_text">
      現在AIがお店を予約しています。<br>
      予約が完了しましたらLINEでお知らせします。
    </p>
    <ul
      class="items">
      <li
        v-for="(item, index) in reserveList"
        :key="item.id"
        class="item"
        :class="{
        completed: index < reserveCursor,
        reserving: index == reserveCursor,
      }"
      >
        <div
          class="item__image"
          :style="{
            'background-image': `url(${getPlacesPhoto(item?.photos[0].name)})`
          }">
        </div><div
        class="item__text">
        <h3>{{ item.displayName.text }}</h3>
        <p>
          {{
          index == reserveCursor ? '電話中' :
          index < reserveCursor ? '予約できませんでした' : '未予約'
          }}
        </p>
      </div>
      </li>
    </ul>
    <div
      class="bottom_area">
      <buttonComponent
        text="キャンセルする"
        @clicked="searchShops" />
    </div>
  </div>
  <div
    v-else>
    <h2
      class="about">
      {{
        reserveStatus === 'reserved' ? '予約が完了しました' : '予約できませんでした'
      }}
    </h2>
    <div
      v-if="reserveStatus === 'reserved'"
      class="reserved">
      <h3>
        {{ reserveList[reserveCursor].displayName.text }}
      </h3>
      <div
        class="reserved__image"
        :style="{
            'background-image': `url(${getPlacesPhoto(reserveList[reserveCursor]?.photos[0].name)})`
          }">
      </div>

      <ul>
        <li>
          <span>予約時間</span>{{ formatFirestoreTimestamp(concierge.reserved_time) }}
        </li>
        <li>
          <span>予約人数</span>{{ concierge.party_size }}名
        </li>
      </ul>

      <button
        @click="() => {
          window.open(reserveList[reserveCursor]?.googleMapsLinks.placeUri, '_blank')
        }">
        GoogleMapで開く
      </button>
    </div>
    <div
      v-else
      class="failed">
      申し訳ございません。<br>
      予約できるお店が見つかりませんでした。
    </div>
  </div>
</template>

<script
  setup>
  import { onMounted, onUnmounted, ref, } from 'vue'
  import { useRoute, } from 'vue-router'
  import { getReserve, } from '@/services/reserve.service.js'
  import { getPlacesPhoto } from '@/services/places.service.js'
  import buttonComponent from '@/components/shared/button.component.vue'

  const route = useRoute()
  const reserveId = ref('')
  const reserveList = ref([])
  const reserveCursor = ref(0)
  const reserveStatus = ref('reserving')
  const intervalId = ref(null)
  const concierge = ref(null)

  onMounted(
    async () => {
      reserveId.value = route.params.id

      await fetchData()
      if (reserveStatus.value !== 'reserving') {
        return
      }
      intervalId.value = setInterval(fetchData, 10000)
    }
  )

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
  })

  const fetchData = async () => {
    const reserveRes = await getReserve(reserveId.value)
    if (reserveList.value.length === 0) {
      for (const l of reserveRes.data.list) {
        reserveList.value.push(
          reserveRes.data.list.find(obj => obj.id === l.id)
        )
      }
    }
    concierge.value = reserveRes.data
    reserveCursor.value = reserveRes.data.cursor
    reserveStatus.value = reserveRes.data.status

    if (reserveStatus.value !== 'reserving') {
      clearInterval(intervalId.value)
    }
  }

  function formatFirestoreTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000)

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    const dayOfWeek = weekdays[date.getDay()]

    return `${date.getMonth() + 1}月${date.getDate()}日（${dayOfWeek}）${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
  }
</script>

<style
  scoped
  lang="scss">
  .about {
    margin: 16px auto 0;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: $color-primary-main;
  }
  .plane_text {
    margin: 16px auto 0;
    font-weight: normal;
    font-size: $font-std;
    color: $color-light-gray;
  }
  .items {
    margin: 16px auto 0;
    .item {
      display: block;
      margin: 8px auto 0;
      padding: 8px;
      border-radius: 4px;
      background-color: $color-gray;
      cursor: grab;
      touch-action: none;
      color: #ffffff;
      transition: background .5s ease;

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
      &.completed {
        opacity: .7;
      }
      &.reserving {
        animation-name: gradation;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease-in-out;
        .item__text {
          p {
            color: #ffffff;
            font-weight: bolder;
          }
        }
      }
    }
  }
  .bottom_area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% - 32px);
    padding: 0 16px 16px;
  }

  .reserved {
    h3 {
      margin: 16px auto 0;
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
    }
    .reserved__image {
      display: block;
      width: 100%;
      height: 50vw;
      margin: 16px auto 0;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    ul {
      margin: 16px auto 0;
      li {
        padding: 8px 0;
        color: #ffffff;
        span {
          display: inline-block;
          width: 100px;
          color: $color-light-gray;
        }
      }
    }

    button {
      display: block;
      margin: 32px auto 0;
      width: 100%;
      max-width: 400px;
      height: 48px;
      line-height: 44px;
      border-radius: 24px;
      color: $color-primary-main;
      font-weight: bold;
      font-size: 18px;
      background: none;
      border: solid 2px $color-primary-main;
      transition: background .5s ease;
    }
  }
  .failed {
    display: block;
    margin: 16px auto 0;
    padding: 16px 8px;
    line-height: 32px;
    border-radius: 8px;
    background-color: $color-gray;
    color: #ffffff;
    text-align: center;
  }

  @keyframes gradation{
    0%{
      background-color: #FFC30060;
    }
    100%{
      background-color: #FFC30090;
    }
  }
</style>