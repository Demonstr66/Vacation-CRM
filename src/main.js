import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from './plugins/secure'

const moment = require('moment')
require('moment/locale/ru')

Vue.use(require('vue-moment'), {
  moment
})

Vue.config.productionTip = false

const fapp = initializeApp(firebaseConfig);
getDatabase(fapp)

let app = false

getAuth().onAuthStateChanged(async() => {
  await store.dispatch('checkAuth')

  if (!app) {
    app = true
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
