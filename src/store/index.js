import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import user from './user'
import workspace from './workspace'
import message from './message'
import access from './access'
import schedules from './schedules'
import DB from './DB'
import {getAuth} from "firebase/auth";
import router from '@/router'

const axios = require('axios');

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
    getWID: (s) => s.wid
  },
  mutations: {
    setAccessLevel: (s, v) => s.accessLevel = v,
    setReady: (s, v) => s.ready = v,
    setWID: (s, v) => s.wid = v
  },
  actions: {
    async beforeLoading({commit, dispatch}) {
      return new Promise((res, rej) => {
        try {
          getAuth().onAuthStateChanged(async (user) => {
            commit('setReady', true)
            dispatch('authStateChanged')

            if (user) {
              commit('setWID', user.photoURL)
              await dispatch('user/getCurrentUserData')
              await dispatch('workspace/getAllData')
              dispatch('user/db/setAsActive')
            }

            res()
          })
        } catch (e) {
          console.log(e)
          dispatch('signOut').then(() => {
            router.push({name: 'Login'})
          })
        }
      })
    },
    authStateChanged({dispatch}) {
      dispatch('setAuthState')
      dispatch('setAccessLevel')
    },
    clearAllPersData({commit}) {
      commit('setAuth', false)
      commit('setEmailVerified', false)
      commit('setLogging', false)

      commit('user/clear')
      commit('workspace/clear')
    },
    setAccessLevel({commit, getters}) {
      const isAuth = getters['isAuth']
      const isEmailVerified = getters['isEmailVerified']
      const isLogging = getters['isLogging']

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
    logUser({dispatch}) {
      const auth = getAuth();
      dispatch('test')
      console.log(auth.currentUser)
    },
    testSendResponse() {
      axios.get('http://localhost:3000/user/set/permission/base', {
        params: {
          u: 'uid_123123123'
        }
      }).then(res => console.log(res))
    }
  },
  modules: {
    auth,
    message,
    access,
    user,
    workspace,
    schedules,
    DB
  }
})
