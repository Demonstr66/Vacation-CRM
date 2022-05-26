import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {initializeApp} from "firebase/app";
import {getAuth,} from "firebase/auth";
import {getDatabase} from "firebase/database";
import {firebaseConfig} from './plugins/secure'
import VCalendar from 'v-calendar';

const start = new Date()

const fb = initializeApp(firebaseConfig);
getDatabase(fb)

const moment = require('moment')
require('moment/locale/ru')
Vue.use(require('vue-moment'), {
  moment
})


Vue.use(VCalendar, {
  componentPrefix: 'vc'
});

Vue.config.productionTip = false
let app = null

getAuth().onAuthStateChanged((user) => {
  user
    ? store.dispatch('loadUserData', user)
    : store.dispatch('clearAllData')

  if (!app) {
    const end = new Date()
    console.log('Load for: ' + (end - start) + 'ms')
  }

  if (!app) app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})


