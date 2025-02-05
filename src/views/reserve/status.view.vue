<template>
  <ul>
    <li>

    </li>
  </ul>
</template>

<script
  setup>
  import { onMounted, ref, } from 'vue'
  import { useRoute, } from 'vue-router'
  import { getReserve, } from '@/services/reserve.service.js'

  const route = useRoute()
  const reserveId = ref('')
  const reserveList = ref([])
  const reserveCursor = ref(0)

  onMounted(
    async () => {
      reserveId.value = route.params.id

      const reserveRes = await getReserve(reserveId.value)
      reserveList.value = reserveRes.data.list
    }
  )
</script>

<style
  scoped
  lang="scss">

</style>