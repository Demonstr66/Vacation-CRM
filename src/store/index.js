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
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async initModules({dispatch}) {
      let promises = []
      for (let module in modules) {
        try {
          if (modules[module].actions && modules[module].actions.initialize)
            promises.push(dispatch(`${module}/initialize`))
        } catch (e) {
          continue
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
          continue
        }
      }
    },


    createAndDownloadXLSX() {
      const wb = XLSX.utils.book_new()
      wb.SheetNames.push('testSheet')
      wb.SheetNames.push('testSheet2')

      const ws = XLSX.utils.aoa_to_sheet([['a1', 'b1'], ['a2', 'b2']])

      wb.Sheets['testSheet'] = ws
      wb.Sheets['testSheet2'] = ws

      XLSX.writeFile(wb, "autoGenerateFile.xlsx");
    }
  },
  modules
})
