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

const DEBUG = process.env.VUE_APP_DEBUG;
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

let subscribe = false

getAuth().onAuthStateChanged((user) => {

  if (DEBUG && !subscribe) {
    subscribe = true
    store.subscribe(mutation => {
      console.log(`Mutation: ${mutation.type}:`, mutation.payload)
    })

    store.subscribeAction(action => {
      console.log(`Action: ${action.type}:`, action.payload)
    })
  }

  store.commit('app/setAccessLevel', user)
  store.commit('FB/set', user)

  if (!app && DEBUG) {
    const end = new Date()
    console.log('Load for: ' + (end - start) + 'ms')
  }

  if (!app) app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')


  store.dispatch('app/onAuthStateChanged', user)
})


