<template>
  <HeaderComponent/>
  <main>
    <RouterView />
  </main>
</template>

<script
  setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import { useStoreLiff } from '@/store/liff.store.js'
  import HeaderComponent from '@/components/common/header.component.vue'

  const liffStore = useStoreLiff()

  onMounted(async () => {
    liffStore.init()
  })
</script>

<style lang="scss" scoped>
  main {
    display: block;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
