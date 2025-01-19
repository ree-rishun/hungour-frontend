<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeaderComponent from '@/components/common/header.component.vue'

const route = useRoute()

onMounted(() => {
})

</script>

<template>
  <HeaderComponent/>
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
