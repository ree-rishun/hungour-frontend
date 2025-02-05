<template>
  <div>

  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useShopStore } from '@/store/shop.store.js'

  const shopStore = useShopStore()

  onMounted(
    () => {
      console.log(shopStore.shops)
    }
  )

  // 予約処理の開始と次のページへの遷移
  const startReserve = () => {
    // TODO: Firestoreにデータの保存

    // TODO: 予約ステータスページに遷移
  }
</script>

<style scoped lang="scss">

</style>