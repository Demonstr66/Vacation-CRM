import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { popup_emit } from './plugins/utils'

const moment = require('moment')
require('moment/locale/ru')
 
Vue.use(require('vue-moment'), {
    moment
})
Vue.prototype.$popup_emit = popup_emit 
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
