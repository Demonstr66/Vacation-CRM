import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";
import {Schedule} from "@/plugins/servises/Schedule";

const basePath = basePathFunction(`schedules/{wid}`)
const test = (item, wid) => !!wid && !!item && !!item.year && !!item.title
const normalize = Schedule.normalize

export default {
  namespaced: true, state: () => ({
    schedules: null, ready: false
  }), getters: {
    get: (s) => s.schedules || {},
    getById: (s) => (id) => s.schedules && s.schedules[id] || null,
    isReady: (s) => s.ready
  }, mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      for (let sid in v) {
        v[sid] = new Schedule(v[sid])
      }
      s.schedules = v
    }, setReady: (s, v) => s.ready = v, clear: (s) => s.schedules = null
  }, actions: {
    initialize({dispatch}) {
      return dispatch('subscribe')
    }, onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    }, get({}) {

    }, create({dispatch, rootGetters, getters}, schedule) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(schedule, wid)) throw new Error('Что-то пошло не так: schedules/create -> test')
        if (!isUnique(schedule, Object.values(getters.get))) throw new Error('График уже существет')

        const path = basePath(wid)
        const key = shortUUID().new()
        const data = normalize({...schedule, id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, delete({rootGetters, dispatch}, {id}) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: schedules/delete -> test')

        const path = basePath(wid)
        const key = id

        dispatch('vacations/deleteAllBySid', id, {root: true})
        return dispatch('DB/delete', {path, key}, {root: true})
      })
    }, update({rootGetters, dispatch, getters}, schedule) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(schedule, wid) || !schedule.id) throw new Error('Что-то пошло не так: schedules/update -> test')
        if (!isUnique(schedule, Object.values(getters.get))) throw new Error('График уже существет')

        const path = basePath(wid)
        const key = schedule.id
        const data = normalize(schedule)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'schedules/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    }, unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
  }
}