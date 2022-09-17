import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import message from './message'
import DB from './modules/DB'
import FB from './modules/FB'
import auth from './modules/auth'
import workspace from './modules/workspace'
import currentUser from './modules/currentUser'
import users from './modules/users'
import teams from './modules/teams'
import posts from './modules/posts'
import tasks from './modules/tasks'
import vacations from './modules/vacations'
import schedules from './modules/schedules'
import templateFile from './modules/templateFile'
import * as XLSX from "xlsx/xlsx.mjs";
import defineAbilitiesFor from "@/plugins/defineAbilities";

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
  vacations,
  app
}


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sandboxMode: false
  },
  getters: {
    sandboxMode: (s) => s.sandboxMode
  },
  mutations: {
    setSandboxMode: (s, v) => s.sandboxMode = v
  },
  actions: {
    async initModules({dispatch}) {
      let promises = []
      for (let module in modules) {
        try {
          if (modules[module].actions && modules[module].actions.initialize)
            promises.push(dispatch(`${module}/initialize`))
        } catch (e) {

        }
      }
      return Promise.all(promises)
    },

    clearModulesData({dispatch}) {
      for (let module in modules) {
        try {
          if (modules[module].actions && modules[module].actions.onLogOut)
            dispatch(`${module}/onLogOut`)
        } catch (e) {

        }
      }
    },

    initAbilities({rootGetters}) {
      const ws = rootGetters['workspace/get']
      const user = rootGetters['currentUser/get']
      let privacy

      if (ws.id) {
        privacy = ws.privacy
      }
      console.log(user, privacy)
      return defineAbilitiesFor(user, privacy)

    },

    sandboxModeOn({commit}) {
      commit('setSandboxMode', true)
    },
    sandboxModeOff({commit}) {
      commit('setSandboxMode', false)
    }
  },
  modules
})
