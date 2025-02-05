import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
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
      if (liff.isLoggedIn()) {
        if (liff.isLoggedIn()) {
          this.isLogedIn = true
          const profile = await liff.getProfile()
          return await userSignin(
            profile.userId,
            profile.pictureUrl,
            profile.displayName,
          )
        } else {
          await this.login()
        }
      }
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