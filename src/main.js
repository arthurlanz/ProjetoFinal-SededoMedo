import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import VueLazyLoad from 'vue3-lazyload'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueLazyLoad, {
  loading: '',
  error: ''
})

app.mount('#app')
