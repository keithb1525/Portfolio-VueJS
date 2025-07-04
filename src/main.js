// Import reverse-fix first to ensure it's loaded before anything else
// import './reverse-fix'
import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(createPinia())
app.mount('#app')