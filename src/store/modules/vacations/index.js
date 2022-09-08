import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction} from "@/plugins/utils";
import {Vacation} from "@/plugins/servises/Vacation";

const basePath = basePathFunction(`vacations/{wid}`)
const test = (item, wid) => !!wid && !!item.sid && !!item.start && !!item.end && !!item.uid
const normalize = (...args) => Vacation.normalize(...args)

export default {
  namespaced: true, state: () => ({
    vacations: null, ready: false
  }), getters: {
    get: (s) => s.vacations || {},
    getBySid: (s) => (sid) => s.vacations ? s.vacations[sid] || [] : [],
    getBySidByUid: (s) => (sid, uid) => {
      try {
        let res = {}
        s.vacations[sid].map(vacation => {
          if (vacation.uid === uid) res[vacation.id] = vacation
        })


        return res
      } catch (e) {
        return {}
      }
    },
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
  }, mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true

      for (let schedule in v) {
        v[schedule] = Object.values(v[schedule]).map(item => new Vacation(item))
      }

      s.vacations = v
    }, setReady: (s, v) => s.ready = v, clear: (s) => s.vacations = null
  }, actions: {
    initialize({dispatch}) {
      return dispatch('subscribe')
    }, onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    }, get({}) {

    }, create({dispatch, rootGetters, getters}, vacation) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(vacation, wid)) throw new Error('Что-то пошло не так: vacations/create -> test')

        const path = basePath(wid, vacation.sid)
        const key = shortUUID().new()
        const data = normalize(vacation, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, delete({rootGetters, dispatch}, {id, sid}) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!id || !sid || !wid) throw new Error('Что-то пошло не так: vacations/delete -> test')

        const path = basePath(wid, sid)
        const key = id

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    }, update({rootGetters, dispatch}, vacation) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(vacation, wid) || !vacation.id) throw new Error('Что-то пошло не так: vacations/update -> test')

        const path = basePath(wid, vacation.sid)
        const key = vacation.id
        const data = normalize(vacation)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'vacations/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    }, unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },


    deleteAllBySid({rootGetters, dispatch}, sid) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!sid || !wid) throw new Error('Что-то пошло не так: vacations/deleteAllBySid -> test')

        const path = basePath(wid)
        const key = sid

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },

    deleteAllByUser({getters, rootGetters, dispatch}, uid) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!uid || !wid) throw new Error('Что-то пошло не так: vacations/deleteAllBySid -> test')

        const vacations = getters.get

        let promises = []

        for (let sid in vacations) {
          vacations[sid].map(vacation => {
            if (vacation.uid === uid) {
              const path = basePath(wid, sid)
              const key = vacation.id

              promises.push(dispatch('DB/delete', {path, key}, {root: true}))
            }
          })
        }

        return Promise.all(promises)
      })
    },
  }, modules: {}
}