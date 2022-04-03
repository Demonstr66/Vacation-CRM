import db from "./db"
import { getAuth } from "firebase/auth";
import { defUser } from "../../plugins/schema";

export default {
  namespaced: true,
  state: () => ({
    workspace: null,
    users: []
  }),
  getters: {
    get: (s) => s.workspace,
    id: (s) => s.workspace ? s.workspace.id : null,
    users: (s) => s.users
  },
  mutations: {
    set: (s, v) => s.workspace = v,
    update: (s, v) => s.workspace = updateObject(s.workspace, v),
    clear: (s) => s.workspace = null,

    setUsers: (s, v) => s.users = v,
    clearUsers: (s) => s.users = []
  },
  actions: {
    create({ dispatch }, data) {
      return dispatch('db/create', data)
    },
    getInfo({ dispatch, commit }) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          const ws = await dispatch('db/read', auth.currentUser.photoURL)
          commit('set', ws)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getUsers({ dispatch, commit }) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          const users = await dispatch('user/db/read', { uid: '', photoURL: auth.currentUser.photoURL }, { root: true })
          commit('setUsers', users)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getAllData({ dispatch, commit }) {
      return new Promise(async (res, rej) => {
        try {
          Promise.all([
            dispatch('getInfo'),
            dispatch('getUsers')
          ]).then(res())
        } catch (e) {
          rej(e)
        }
      })
    },
    updateUser({ dispatch, commit }, data) {
      const user = defUser(data)
      return dispatch('db/updateUser', user)
    }
  },
  modules: {
    db
  }
}