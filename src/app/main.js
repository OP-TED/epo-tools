import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import VueDiff from 'vue-diff'
import 'vue-diff/dist/index.css'

const pinia = createPinia()
const app = createApp(App)
app.use(VueDiff)
app.use(pinia)
app.mount('#app')
