<template>
  <div id="app">
    <Tinder
      ref="tinder"
      key-name="id"
      v-model:queue="queue"
      :max="3"
      :offset-y="10"
      allow-down
      @submit="onSubmit"
    >
      <template #default="{ data }">
        <div
          class="pic"
          :style="{
            'background-image': `url(https://cn.bing.com//th?id=OHR.${data.id}_UHD.jpg&pid=hp&w=720&h=1280&rs=1&c=4&r=0)`
          }"
        />
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
    </Tinder>
    <div class="btns">
      <img src="@/assets/img/icon/heart.svg" @click="decide('rewind')" />
      <img src="@/assets/img/icon/heart.svg" @click="decide('nope')" />
      <img src="@/assets/img/icon/heart.svg" @click="decide('super')" />
      <img src="@/assets/img/icon/heart.svg" @click="decide('like')" />
      <img src="@/assets/img/icon/heart.svg" @click="decide('help')" />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import Tinder from 'vue-tinder'

  const source = [
    'AdelieBreeding_ZH-CN1750945258',
    'BarcolanaTrieste_ZH-CN5745744257',
    'RedRocksArches_ZH-CN5664546697',
    'NationalDay70_ZH-CN1636316274',
    'LofotenSurfing_ZH-CN5901239545',
    'UgandaGorilla_ZH-CN5826117482',
    'FeatherSerpent_ZH-CN5706017355',
    'VancouverFall_ZH-CN9824386829',
    'WallofPeace_ZH-CN5582031878',
    'SanSebastianFilm_ZH-CN5506786379',
    'CommonLoon_ZH-CN5437917206',
    'SunbeamsForest_ZH-CN5358008117',
    'StokePero_ZH-CN5293082939',
    'Wachsenburg_ZH-CN5224299503',
    'SurfboardRow_ZH-CN5154549470',
    'ToothWalkingSeahorse_ZH-CN5089043566',
    'midmoon_ZH-CN4973736313',
    'MilkyWayCanyonlands_ZH-CN2363274510',
    'DaintreeRiver_ZH-CN2284362798',
    'TsavoGerenuk_ZH-CN2231549718',
    'ArroyoGrande_ZH-CN2178202888',
    'SouthernYellow_ZH-CN2055825919',
    'MountFanjing_ZH-CN1999613800',
    'ElMorro_ZH-CN1911346184',
  ]

  const queue = ref([])
  const offset = ref(0)
  const history = ref([])
  const tinder = ref(null)

  function mock(count = 5, append = true) {
    console.log('mock')
    const list = []
    for (let i = 0; i < count; i++) {
      if (i === 4) {
        list.push({ id: source[offset.value] })
      }else {
        list.push({ name: source[offset.value] })
      }
      offset.value++
    }
    if (append) {
      queue.value = queue.value.concat(list)
    } else {
      queue.value.unshift(...list)
    }
  }

  function onSubmit({ item }) {
    console.log('onSubmit')
    console.log(queue)
    if (queue.value.length < 3) {
      mock()
    }
    history.value.push(item)
    console.log(history.value)
  }

  function decide(choice) {
    console.log('decide')
    if (choice === 'rewind') {
      if (history.value.length) {
        tinder.value.rewind(
          history.value.splice(-Math.ceil(Math.random() * 3))
        )
      }
    } else if (choice === 'help') {
      // ヘルプ用の処理をここに記述
    } else {
      tinder.value.decide(choice)
    }
  }

  onMounted(() => {
    mock()
  })
</script>

<style>
  html,
  body {
    height: 100%;
  }

  body {
    margin: 0;
    background-color: #20262e;
    overflow: hidden;
  }

  #app .vue-tinder {
    position: absolute;
    z-index: 200;
    left: 0;
    right: 0;
    top: 23px;
    margin: auto;
    width: calc(100% - 20px);
    height: calc(100% - 23px - 65px - 47px - 16px);
    min-width: 300px;
    max-width: 355px;
  }

  .nope-pointer,
  .like-pointer {
    position: absolute;
    z-index: 200;
    top: 20px;
    width: 64px;
    height: 64px;
  }

  .nope-pointer {
    right: 10px;
  }

  .like-pointer {
    left: 10px;
  }

  .super-pointer,
  .down-pointer {
    position: absolute;
    z-index: 200;
    left: 0;
    right: 0;
    margin: auto;
    width: 112px;
    height: 78px;
  }

  .super-pointer {
    bottom: 40px;
  }

  .down-pointer {
    top: 40px;
  }

  .rewind-pointer {
    position: absolute;
    z-index: 200;
    top: 20px;
    right: 10px;
    width: 112px;
    height: 78px;
  }

  .pic {
    width: 100%;
    height: 60vh;
    background-size: cover;
    background-position: center;
    background-color: #FFC300;
  }

  .btns {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30px;
    margin: auto;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    max-width: 355px;
  }

  .btns img {
    margin-right: 12px;
    box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .btns img:nth-child(2n + 1) {
    width: 53px;
  }

  .btns img:nth-child(2n) {
    width: 65px;
  }

  .btns img:nth-last-child(1) {
    margin-right: 0;
  }

  /* .vue-tinder.right-end,
  .vue-tinder.left-end {
    transform: translateZ(20px);
  }
  .vue-tinder.right-end .tinder-card:nth-child(1) {
    animation: rightEnd 0.2s ease-in-out;
  }
  .vue-tinder.left-end .tinder-card:nth-child(1) {
    animation: leftEnd 0.2s ease-in-out;
  }
  @keyframes leftEnd {
    50% {
      transform: rotateY(8deg);
    }
  }
  @keyframes rightEnd {
    50% {
      transform: rotateY(-8deg);
    }
  } */
</style>