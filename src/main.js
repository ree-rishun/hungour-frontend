import './assets/style/layouts.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Firebase
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './config/firebase-config.js'

initializeApp(firebaseConfig)
const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
