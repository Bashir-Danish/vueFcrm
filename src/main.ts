import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from '@/i18n'
import moment from 'moment'
import './style.css'
import './assets/index.css'

import '@/data/index'

import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(MotionPlugin)
app.provide('$t', i18n.global.t)

app.config.globalProperties.$dt = moment
app.provide('$dt', moment)

if (localStorage.getItem('accessToken')) {
  console.warn('Auth store is not available. Token handling is disabled.')
}

app.mount('#app')
