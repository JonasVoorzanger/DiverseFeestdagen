import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0062ab',
          secondary: '#80c9ff',
          background: '#f1f9ff'
        }
      }
    }
  }
})

// Create and mount the app
createApp(App)
  .use(vuetify)
  .mount('#app')
