import db from "./db"

export default {
  namespaced: true,
  state: () => ({
    workspace: null
  }),
  getters: {
    get: (s) => s.workspace,
  },
  mutations: {
    set: (s, v) => s.workspace = v,
    update: (s, v) => s.workspace = updateObject(s.workspace, v),
    clear: (s) => s.workspace = null
  },
  actions: {
    create({ dispatch }, data) {
      return dispatch('db/create', data)
    }
  },
  modules: {
    db
  }
}