<template>
  <HeaderComponent/>
  <main>
    <RouterView />
  </main>
</template>

<script
  setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStoreLiff } from '@/store/liff.store.js'
  import HeaderComponent from '@/components/common/header.component.vue'

  const router = useRouter()
  const liffStore = useStoreLiff()

  onMounted(async () => {
    const res = await liffStore.init()
    if (res.data.status === 'unactivated') {
      router.push('/mypage/signup')
    }
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
