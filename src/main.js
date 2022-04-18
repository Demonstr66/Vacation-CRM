import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from './plugins/secure'
import VCalendar from 'v-calendar';

const fapp = initializeApp(firebaseConfig);
getDatabase(fapp)

const moment = require('moment')
require('moment/locale/ru')

Vue.use(require('vue-moment'), {
  moment
})


Vue.use(VCalendar, {
  componentPrefix: 'vc'
});

Vue.config.productionTip = false





let app = false

getAuth().onAuthStateChanged(async (data) => {
  if (app) {
    store.dispatch('authStateChanged', data)
    return
  }

  console.log('create app')
  app = true
  await store.dispatch('onBeforeLoadingHandler')
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')

})
