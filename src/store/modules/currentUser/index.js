import {asyncTryDecorator, basePathFunction} from "@/plugins/utils";
import {getAuth} from "firebase/auth";
import {User} from "@/plugins/servises/User";

const basePath = basePathFunction(`users/{wid}`)
const test = (item, wid) => !!wid && !!item && !!item.fullName && !!item.email
const normalize = (...args) => User.normalize(...args)

export default {
  namespaced: true, state: () => ({
    user: null, ready: false
  }),
  getters: {
    get: (s) => s.user ? {...s.user} : {},
    uid: (s) => s.user ? s.user.uid : null,
    role: (s) => s.user ? s.user.role : null,
    email: (s) => s.user ? s.user.email : null,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.user = new User(v)
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.user = null
  },
  actions: {
    initialize({dispatch, getters}) {
      return dispatch('subscribe').then(() => {
        let user = getters['get']
        user.lastVisitAt = Date.now()
        return dispatch('update', user)
      })
    }, onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    }, create({dispatch, commit}, {user, wid}) {
      return new Promise(async (res, rej) => {
        try {
          if (!test(user, wid)) throw new Error('Что-то пошло не так: currentUser/create -> test')

          const userCredential = await dispatch('FB/createAccount', user, {root: true})

          const uid = userCredential.user.uid

          const path = basePath(wid)
          const key = uid
          const data = normalize(user, {uid, workspace: wid})

          dispatch('FB/updateAccountInfo', data, {root: true})
          commit('set', data)
          dispatch('DB/set', {path, key, data}, {root: true})

          res(uid)
        } catch (e) {
          rej(e)
        }
      })
    }, update({dispatch, rootGetters, getters}, user) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(user, wid) || !user.uid) throw new Error('Что-то пошло не так:' + ' currentUser/update -> test')

        const path = basePath(wid)
        const key = user.uid
        const data = normalize(user)

        return Promise.all([dispatch('DB/set', {
          path, key, data
        }, {root: true}), dispatch('FB/updateAccountInfo', {data}, {root: true})])
      })
    }, subscribe({rootGetters, dispatch, getters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid, getAuth().currentUser.uid)
      const setter = 'currentUser/set'
      const dispatcher = 'currentUser/setActiveState'

      return dispatch('DB/subscribe', {path, setter, dispatcher}, {root: true})
    }, unsubscribe({dispatch, rootGetters, getters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid, getters.uid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    setActiveState({dispatch, getters}, data) {
      const user = data ? {...data} : data
      if (user.active || !getAuth().currentUser || !getAuth().currentUser.emailVerified) return

      user.active = true
      user.emailVerified = true

      return dispatch('update', user)
    }

  }
}