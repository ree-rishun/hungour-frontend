<template>
  <header>
    <img
      src="@/assets/img/logo.svg"
      alt="hungourロゴ">
    <div
      class="icon"
      v-if="profile"
      :style="{
        'background-image': `url(${profile?.pictureUrl})`
      }">
    </div>
  </header>
</template>

<script
  setup>
  import { onMounted, ref } from 'vue'
  import { useStoreLiff } from '@/store/liff.store.js'

  const liffStore = useStoreLiff()
  const profile = ref(null)

  onMounted(
    async () => {
      profile.value = await liffStore.getProfile()
      console.log('profile : ', profile.value)
      if (profile.value === null) {
        setTimeout(
          async () => {
            profile.value = await liffStore.getProfile()
          },
          500
        )
      }
    }
  )
</script>

<style scoped lang="scss">
  header {
    position: relative;
    height: $header-height;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
    img {
      display: block;
      height: 36px;
      padding: (($header-height - 36px) / 2) 0 0 0;
    }
    .icon {
      position: absolute;
      right: 0;
      top: 12px;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: 1px solid $color-primary-main;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
</style>
