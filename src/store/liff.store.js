import { defineStore } from 'pinia'
import liff from '@line/liff'
import { userSignin } from '@/services/users.service.js'

export const useStoreLiff = defineStore('liff', {
  state: () => ({
    token: '',
  }),
  actions: {
    async init() {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
        .then(async () => {
          if (liff.isLoggedIn()) {
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
      return await liff.getProfile()
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