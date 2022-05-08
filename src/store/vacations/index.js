import {defVacation} from "@/plugins/schema";
import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction} from "@/plugins/utils";

const basePath = basePathFunction(`vacations/{wid}`)
const test = (item, wid) => !!wid && !!item.sid && !!item && !!item.start && !!item.end && !!item.uid
const normalize = defVacation

export default {
  namespaced: true,
  state: () => ({
    vacations: null,
    ready: false
  }),
  getters: {
    get: (s) => s.vacations || {},
    getBySid: (s) => (sid) => s.vacations ? s.vacations[sid] : {},
    getByUid: (s) => (uid) => {
      if (!s.vacations) return {}
      let res = {}
      for (let sid in s.vacations) {
        let v = s.vacations[sid]
        for (let id in v) {
          if (v[id].uid === uid) {
            if (!res[sid]) res[sid] = {}
            res[sid][id] = v[id]
          }
        }
      }

      return res
    },
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.vacations = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.vacations = null
  },
  actions: {
    initialize({dispatch}) {
      dispatch('subscribe')
    },
    onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    },
    get({}) {

    },
    create({dispatch, rootGetters, getters}, vacation) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(vacation, wid)) throw new Error('Что-то пошло не так: vacations/create -> test')

        const path = basePath(wid, vacation.sid)
        const key = shortUUID().new()
        const data = normalize(vacation, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}, vacation) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']
        if (!vacation.id || !wid) throw new Error('Что-то пошло не так: vacations/delete -> test')

        const path = basePath(wid, vacation.sid)
        const key = vacation.id

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, vacation) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(vacation, wid) || !vacation.id) throw new Error('Что-то пошло не так: vacations/update -> test')

        const path = basePath(wid, vacation.sid)
        const key = vacation.id
        const data = normalize(vacation)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)
      const setter = 'vacations/set'

      dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },


    deleteAllBySid({rootGetters, dispatch}, sid) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']
        if (!sid || !wid) throw new Error('Что-то пошло не так: vacations/deleteAllBySid -> test')

        const path = basePath(wid)
        const key = sid

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
  },
  modules: {}
}