import { defineStore } from 'pinia'
import liff from '@line/liff'
import { userSignin } from '@/services/users.service.js'

export const useStoreLiff = defineStore('liff', {
  state: () => ({
    token: '',
    isLogedIn: false,
  }),
  actions: {
    async init() {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
        .then(async () => {
          if (liff.isLoggedIn()) {
            this.isLogedIn = true
            const profile = await liff.getProfile()
            console.log(profile)
            const res = await userSignin(
              profile.userId,
              profile.pictureUrl,
              profile.displayName,
            )
            console.log(res)
          } else {
            await this.login()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    setToken(token) {
      this.token = token
    },
    async getProfile() {
      if (this.isLogedIn) {
        return await liff.getProfile()
      }
      return null
    },
    async getToken() {
      if (!liff.isLoggedIn()) {
        await this.login()
      }
      const token = await liff.getAccessToken()
      this.setToken(token)
      return token
    },
    async login() {
      await liff.login({ redirectUri: window.location.href })
    },
  },
  getters: {
    liffIdWorkerApp() {
      return import.meta.env.VITE_LIFF_ID
    },
  }
});