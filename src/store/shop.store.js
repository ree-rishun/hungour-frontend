import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
  state: () => ({
    shops: []
  }),
  actions: {
    setShops(shops) {
      this.shops = shops;
    },
  },
})
