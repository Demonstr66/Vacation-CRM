import {defUser} from "@/plugins/schema";
import {asyncTryDecorator, basePathFunction} from "@/plugins/utils";
import {getAuth} from "firebase/auth";

const basePath = basePathFunction(`users/{wid}`)
const test = (item, wid) => !!wid && !!item && !!item.fullName && !!item.email
const normalize = defUser

export default {
  namespaced: true,
  state: () => ({
    user: null,
    ready: false
  }),
  getters: {
    get: (s) => s.user || {},
    uid: (s) => s.user ? s.user.uid : null,
    email: (s) => s.user ? s.user.email : null,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.user = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.user = null
  },
  actions: {
    create({dispatch, commit}, {user, wid}) {
      // return asyncTryDecorator(async () => {
      //   if (!test(user, wid)) throw new Error('Что-то пошло не так: currentUser/create -> test')
      //
      //   const userCredential = await dispatch('FB/createAccount', user, {root: true})
      //   const uid = userCredential.user.uid
      //
      //   const path = basePath(wid)
      //   const key = uid
      //   const data = normalize(user, {uid, workspace: wid})
      //
      //   dispatch('FB/updateAccountInfo', data, {root: true})
      //   commit('set', data)
      //
      //   return dispatch('DB/set', {path, key, data}, {root: true})
      // })

      return new Promise(async(res, rej) => {
        try {
          if (!test(user, wid)) throw new Error('Что-то пошло не так: currentUser/create -> test')
console.log('before')
          const userCredential = await dispatch('FB/createAccount', user, {root: true})
          console.log('after')
          const uid = userCredential.user.uid

          const path = basePath(wid)
          const key = uid
          const data = normalize(user, {uid, workspace: wid})

          dispatch('FB/updateAccountInfo', data, {root: true})
          commit('set', data)
          dispatch('DB/set', {path, key, data}, {root: true})

          res()
        }catch (e) {
          console.log('sory i`m here')
          rej(e)
        }
      })
    },
    update({dispatch, rootGetters, getters}, user) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(user, wid) || !user.uid) throw new Error('Что-то пошло не так:' +
          ' currentUser/update -> test')

        const path = basePath(wid)
        const key = user.uid
        const data = normalize(user)

        return Promise.all([
          dispatch('DB/set', {path, key, data}, {root: true}),
          dispatch('FB/updateAccountInfo', {data}, {root: true})
        ])
      })
    },
    subscribe({rootGetters, dispatch, getters}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid, getAuth().currentUser.uid)
      const setter = 'currentUser/set'
      const dispatcher = 'currentUser/setActiveState'

      dispatch('DB/subscribe', {path, setter, dispatcher}, {root: true})
    },
    unsubscribe({dispatch, rootGetters, getters}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid, getters.uid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    setActiveState({dispatch, getters}, user) {
      if (user.active || !getAuth().currentUser || !getAuth().currentUser.emailVerified) return

      user.active = true
      user.emailVerified = true

      return dispatch('update', user)
    }

  }
}