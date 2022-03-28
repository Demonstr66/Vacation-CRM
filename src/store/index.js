import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import db from './db'
import message from './message'
import access from './access'
import { getAuth } from "firebase/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: 'Vacation CRM',
  },
  getters: {
    getAppName: (s) => s.appName,
  },
  mutations: {
  },
  actions: {
    async registerHandler({ dispatch }, payload) {
      let wid

      if (payload.workspace.isNew) wid = await dispatch('createWorkspace', payload.workspace)
      else wid = payload.workspace.id

      payload.user.role = payload.workspace.isNew ? 'owner' : 'user'

      return dispatch('createUser', { user: payload.user, wid })
    },
    onLoadHandeler({ dispatch, commit }) {
      dispatch('onSignIn')
    },
    clearAllPersData({ commit }) {
      commit('setUser', null)
      commit('setAuth', false)
      commit('setWorkspace', null)

      commit('setPersons', [])
      commit('setTeams', [])
    },
    async onSignIn({ dispatch }) {
      const auth = getAuth();

      if (auth.currentUser) {
        await dispatch('fetchUserInfo')
        await dispatch('fetchWorkspaceInfo', auth.currentUser.uid)
      }

      await dispatch('fetchData')
    }
  },
  modules: {
    auth,
    message,
    db,
    access
  }
})
