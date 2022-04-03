import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import user from './user'
import workspace from './workspace'
import message from './message'
import access from './access'
import { getAuth } from "firebase/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: 'Vacation CRM',
    accessLevel: 0
  },
  getters: {
    getAppName: (s) => s.appName,
    getAccessLevel: (s) => s.accessLevel,
  },
  mutations: {
    setAccessLevel: (s, v) => s.accessLevel = v
  },
  actions: {
    async onBeforeLoadingHandler({ dispatch }) {
      try {
        if (await dispatch('setAuthState')) {
          await dispatch('user/getCurrentUserData')
          await dispatch('workspace/getAllData')
        }
      } catch (e) {
        dispatch("signOut")
      }

      dispatch('setAccessLevel')
    },
    onLoadHandeler({ dispatch, commit }) {
      dispatch('onSignIn')
    },
    authStateChanged({ dispatch }) {
      dispatch('setAuthState').then(
        dispatch('setAccessLevel')
      )
    },
    clearAllPersData({ commit }) {
      commit('setAuth', false)
      commit('setEmailVerified', false)
      commit('setLogining', false)

      commit('user/clear')
      commit('workspace/clear')
    },
    async onSignIn({ dispatch }) {
      const auth = getAuth();
    },
    setAccessLevel({ commit, getters }) {
      const isAuth = getters['isAuth']
      const isEmailVerified = getters['isEmailVerified']
      const isLogining = getters['isLogining']

      let accessLevel

      switch (true) {
        case (!isAuth): accessLevel = 0; break;
        case (!isEmailVerified): accessLevel = 1; break;
        case (isLogining): accessLevel = 2; break;
        default: accessLevel = 0; break;
      }

      commit('setAccessLevel', accessLevel)
    },
    logUser() {
      const auth = getAuth();

      console.log(auth.currentUser)
    }
  },
  modules: {
    auth,
    message,
    access,
    user,
    workspace
  }
})
