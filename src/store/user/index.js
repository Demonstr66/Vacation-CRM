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
          const user = await dispatch('db/read', auth.currentUser.uid)
          commit('set', user)
          // dispatch('db/subscribe', auth.currentUser.uid)
          res()
        } catch (err) {
          console.error(err)
          rej(err)
        }
      })
    },
    create({ dispatch, commit }, { user }) {
      return new Promise(async (res, rej) => {
        try {
          const uid = await dispatch('fb/create', user)
          const newUser = defUser(user, { uid })

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
    update({ dispatch }, user) {
      return dispatch('db/update', user)
    }

  },
  modules: {
    db,
    fb
  }
}