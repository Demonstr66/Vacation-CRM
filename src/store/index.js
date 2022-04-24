import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import message from './message'
import DB from './DB'
import FB from './FB'
import auth from './auth/index'
import workspace from './workspace'
import currentUser from './currentUser'
import users from './users'
import teams from './teams'
import posts from './posts'
import tasks from './tasks'
import schedules from './schedules'
import templateFile from './templateFile'

const modules = {
  message,
  DB,
  FB,
  workspace,
  currentUser,
  users,
  teams,
  posts,
  tasks,
  schedules,
  templateFile,
  auth,
}


Vue.use(Vuex)

export default new Vuex.Store({
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
    setAccessLevel: (s, v) => s.accessLevel = v,
    setReady: (s, v) => s.ready = v,
    setWID: (s, v) => s.wid = v
  },
  actions: {
    // loadUserData({dispatch}, user) {
    //   return new Promise((res) => {
    //     if (!user.emailVerified) router.replace({name: 'EmailSending'})
    //     // getAuth().onAuthStateChanged(async (user) => {
    //     //   // const result = await dispatch('onChangeAuthState', user)
    //     //
    //     //   res(result)
    //     // })
    //
    //   })
    // },
    loadUserData({commit, dispatch}, user) {
      if (!user.emailVerified) return commit('setAccessLevel', 1)

      commit('setAccessLevel', 2)
      commit('setWID', user.photoURL)
      commit('setReady', true)
      dispatch('FB/remember')
      dispatch('subscribeOnData')
    },
    async onChangeAuthState({dispatch, commit, getters}, user) {
      console.log('onChangeAuthState')
      if (!user) {
        if (getters.isReady) dispatch('logOut')
        return
      }
      if (!user.emailVerified) return dispatch('sendEmailVerification')

      commit('setWID', user.photoURL)
      await dispatch('setAccessLevel', user)

      commit('setReady', true)
      dispatch('FB/remember')
      dispatch('subscribeOnData')
      return Promise.resolve()
    },
    onRouteEnter() {

    },
    async logOut({dispatch, commit}) {
      commit('setReady', true)
      commit('auth/setAuth', false, {root: true})
      await dispatch('clearAllData')
      await dispatch('auth/singOut')
      await dispatch('setAccessLevel')
      router.replace({name: 'Login'})
        .catch(() => {
        })
      return Promise.resolve()
    },
    async logIn({dispatch, commit}, data) {
      let rememberMethod = 'FB/remember'
      if (!data.remember) rememberMethod = 'FB/sessionRemember'

      // await dispatch(rememberMethod)

      const res = await dispatch('auth/singIn', data)
    
      router.replace({name: 'Home'})
        .catch(() => {
        })
      console.log('logIn: ', res)
      return res
    },
    sendEmailVerification({commit, dispatch}) {
      commit('setReady', true)
      return dispatch('auth/sendEmailVerify')
    },
    setAccessLevel({commit}, user) {
      const isAuth = !!user
      const isEmailVerified = isAuth && user.emailVerified
      const isLogging = isAuth && isEmailVerified

      commit('auth/setAuth', isAuth, {root: true})

      let accessLevel

      switch (true) {
        case (!isAuth):
          accessLevel = 0;
          break;
        case (!isEmailVerified):
          accessLevel = 1;
          break;
        case (isLogging):
          accessLevel = 2;
          break;
        default:
          accessLevel = 0;
          break;
      }

      commit('setAccessLevel', accessLevel)
    },
    subscribeOnData({dispatch}) {
      for (let module in modules) {
        try {
          if (modules[module].actions && modules[module].actions.subscribe)
            dispatch(`${module}/subscribe`)
        } catch (e) {
          continue
        }
      }
    },
    clearAllData({commit, dispatch}) {
      commit('setAccessLevel', 0)
      commit('setWID', null)
      for (let module in modules) {
        try {
          if (modules[module].mutations && modules[module].mutations.clear)
            commit(`${module}/clear`)

          if (modules[module].actions && modules[module].actions.unsubscribe)
            dispatch(`${module}/unsubscribe`)
        } catch (e) {
          continue
        }
      }
    },
  },
  modules
})
