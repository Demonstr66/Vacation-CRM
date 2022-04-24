import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {initializeApp} from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  inMemoryPersistence,
  setPersistence
} from "firebase/auth";
import {getDatabase} from "firebase/database";
import {firebaseConfig} from './plugins/secure'
import VCalendar from 'v-calendar';
const start = Date.now()
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
  console.log('onAuthStateChanged:', user)
  const end = Date.now()
  if (!app) console.log('load by ' + (end - start) + 'ms')
  if (user) store.dispatch('loadUserData', user)
  else {
    // if (user) store.dispatch('auth/singOut')
    store.dispatch('clearAllData')
  }

  if (!app) app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})


