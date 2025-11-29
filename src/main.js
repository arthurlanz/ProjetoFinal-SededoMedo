import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import VueLazyLoad from 'vue3-lazyload' // ADICIONE ESTA LINHA
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueLazyLoad) // ADICIONE ESSA LINHA

app.mount('#app')
app.use(VueLazyLoad, {
  loading: 'URL_DA_IMAGEM_LOADING',
  error: 'URL_DA_IMAGEM_ERRO'
})
