import {defTask} from "@/plugins/schema";
import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";

const basePath = basePathFunction(`workspaces/{wid}/tasks`)
const test = (item, wid) => !!wid && !!item && !!item.title
const normalize = defTask

export default {
  namespaced: true,
  state: () => ({
    tasks: null,
    ready: false
  }),
  getters: {
    get: (s) => s.tasks || {},
    count: (s) => Object.values(s.tasks || {}).length,
    getTitle: (s) => (id) => s.tasks ? s.tasks[id] ? s.tasks[id].title : '' : '',
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.tasks = Object.freeze(v)
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.tasks = null
  },
  actions: {
    initialize({dispatch}) {
      return dispatch('subscribe')
    },
    onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    },
    get({}) {

    },
    create({dispatch, rootGetters, getters}, task) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(task, wid)) throw new Error('Что-то пошло не так: tasks/create -> test')
        if (!isUnique(task, Object.values(getters.get))) throw new Error('Задача уже существет')

        const path = basePath(wid)
        const key = shortUUID().new()
        const data = normalize(task, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}, id) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: tasks/delete -> test')

        const path = basePath(wid)
        const key = id

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, task) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(task, wid) || !task.id) throw new Error('Что-то пошло не так: tasks/update -> test')

        const path = basePath(wid)
        const key = task.id
        const data = normalize(task)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'tasks/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
    
    addMultiple({dispatch, rootGetters}, tasks) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!tasks) throw new Error('Что-то пошло не так: tasks/addMultiple -> !tasks')
        if (!tasks.every(task => test(task, wid))) throw new Error('Обязтельные поля не добавлены')

        let promises = tasks.map(task => {
          return dispatch('create', task)
        })

        return Promise.any(promises)
      })
    }
  },
  modules: {}
}