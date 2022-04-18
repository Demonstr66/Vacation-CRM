import db from "./db"
import fb from "./fb"
import { defUser } from "../../plugins/schema";
import { getAuth } from "firebase/auth";

export default {
  namespaced: true,
  state: () => ({
    user: null
  }),
  getters: {
    get: (s) => s.user,
    uid: (s) => s.user ? s.user.uid : undefined,
    email: (s) => s.user ? s.user.email : undefined,
  },
  mutations: {
    set: (s, v) => s.user = v,
    update: (s, v) => s.user = updateObject(s.user, v),
    clear: (s) => s.user = null
  },
  actions: {
    async getCurrentUserData({ dispatch, commit }) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          const user = await dispatch('db/read', auth.currentUser)
          commit('set', user)
          // dispatch('DB/subscribe', auth.currentUser.uid)
          res()
        } catch (err) {
          rej(err)
        }
      })
    },
    create({ dispatch, commit }, { user, workspace }) {
      return new Promise(async (res, rej) => {
        try {
          const uid = await dispatch('fb/create', user)
          const newUser = defUser(user, { uid, workspace: workspace.id })

          await Promise.all([
            dispatch('fb/updateUserProfile', newUser),
            dispatch('fb/remember'),
            dispatch('db/create', newUser)
          ])

          commit('set', newUser)

          res(uid)
        } catch (err) {
          rej(err)
        }
      })
    },
    update({ dispatch, rootGetters }, data) {
      const user = defUser(
        rootGetters['workspace/getUserById'](data.uid),
        data
      )
      return dispatch('db/update', user)
    }

  },
  modules: {
    db,
    fb
  }
}