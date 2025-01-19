<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()

// await liff.init({ liffId: 'xxxxxxxx' })

onMounted(() => {
})

</script>

<template>
  <header>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
  main {
    display: block;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
