import db from './db'
import {defSchedule} from "@/plugins/schema";
import shortUUID from "short-uuid";

export default {
  namespaced: true,
  state: () => ({
    schedules: null,
    ready: false
  }),
  getters: {
    get: (s) => s.schedules || [],
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.schedules = v
    },
    setReady: (s, v) => s.ready = v,
  },
  actions: {
    get({}) {

    },
    add({dispatch, rootGetters}, schedule) {
      const wid = rootGetters['workspace/get'].id

      if (!schedule || !schedule.name || !schedule.year || !wid) return Promise.reject(
        new Error('Что-то пошло не так'))

      const path = `schedules/${wid}`
      const key = shortUUID().new()
      const data = defSchedule(schedule, {id: key})

      return dispatch('DB/set', {path, key, data}, {root: true})
    },
    delete({rootGetters, dispatch}, id) {
      const wid = rootGetters['workspace/get'].id
      if (!id || !wid) return Promise.reject(new Error('Что-то пошло не так'))

      const path = `schedules/${wid}`
      const key = id

      return dispatch('DB/delete', {path, key}, {root: true})
    },
    update({rootGetters, dispatch}, schedule) {
      const wid = rootGetters['workspace/get'].id

      if (!schedule || !wid) return Promise.reject(new Error('Что-то пошло не так'))

      const path = `schedules/${wid}`
      const key = schedule.id
      const data = defSchedule(schedule)

      return dispatch('DB/set', {path, key, data}, {root: true})
    },
    subscribe({rootGetters, dispatch}, {wid}) {
      const path = `schedules/${wid}`
      const setter = 'schedules/set'

      dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['workspace/get'].id
      const path = `schedules/${wid}`

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
  },
  modules: {
    db
  }
}