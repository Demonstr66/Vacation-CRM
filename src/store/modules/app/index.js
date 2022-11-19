import router from '@/router'
import axios from "axios";

const DEBUG = process.env.VUE_APP_DEBUG;

export default {
  namespaced: true,
  state: {
    appName: 'Vacation CRM',
    accessLevel: 0,
    ready: false,
    wid: null
  },
  getters: {
    isReady: (s) => s.ready,
    getAppName: (s) => s.appName,
    getAccessLevel: (s) => s.accessLevel,
    getWID: (s) => s.wid,
  },
  mutations: {
    setAccessLevel: (s, user) => {
      switch (true) {
        case !!!user:
          s.accessLevel = 0;
          break;
        case user.emailVerified === false:
          s.accessLevel = 1;
          break;
        case  user.emailVerified === true:
          s.accessLevel = 2;
          break;
      }
    },
    setReady: (s, v) => s.ready = v,
    setWID: (s, v) => s.wid = v,
    clearData: (s) => {
      s.accessLevel = 0
      s.ready = false
      s.wid = null
    }
  },
  actions: {
    onLogOut({commit}) {
      commit('clearData')
    },
    onAuthStateChanged({getters, commit, dispatch}, user) {
      commit('setReady', false)

      if (user) {
        dispatch('loadAppWithUser', user)
      } else {
        if (getters.isLoaded) dispatch('clearModulesData', {root: true})
        dispatch('loadAppWithoutUser')
      }
    },
    async loadAppWithUser({commit, dispatch}, user) {
      const emailCheck = await dispatch('checkEmailVerify', user)

      let start = new Date()

      if (!emailCheck) dispatch('emailNotConfirm')
      else await dispatch('loadUserData', user)

      if (DEBUG) console.log('Data loaded by: ' + (new Date() - start))

      commit('auth/setAuth', true, {root: true})
      commit('setReady', true)
    },
    loadAppWithoutUser({commit}) {
      // commit('setAccessLevel', 0)
      commit('setReady', true)
    },
    checkEmailVerify({}, user) {
      return user.emailVerified
    },
    emailNotConfirm({dispatch}) {
      // dispatch('setMessage', {code: 'auth/email-not-verify', type: 'error'}, {root: true})
      dispatch('redirectTo', {name: 'EmailSending'})
    },
    redirectTo({}, {name}) {
      router.push({name})
    },
    async loadUserData({commit, dispatch}, user) {
      // commit('setAccessLevel', 2)
      let wid = user.photoURL
      if (!wid) {
        const customClaims = JSON.parse(user.reloadUserInfo.customAttributes)
        wid = customClaims.workspace
      }
      console.groupEnd()
      commit('setWID', wid)

      axios.defaults.headers.common['uid'] = user.uid
      axios.defaults.headers.common['wid'] = wid

      await dispatch('initModules', {}, {root: true})
    },
    async setLogoutState({commit}) {
      commit('setReady', true)
      commit('auth/setAuth', false, {root: true})
    },
    logOut({dispatch}) {
      dispatch('clearModulesData', '', {root: true})
    }
  }
}
