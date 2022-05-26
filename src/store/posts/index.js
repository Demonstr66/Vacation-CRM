import {defPost} from "@/plugins/schema";
import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";

const basePath = basePathFunction(`workspaces/{wid}/posts`)
const test = (item, wid) => !!wid && !!item && !!item.title
const normalize = defPost

export default {
  namespaced: true,
  state: () => ({
    posts: null,
    ready: false
  }),
  getters: {
    get: (s) => s.posts || {},
    count: (s) => Object.values(s.posts).length,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.posts = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.posts = null
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
    create({dispatch, rootGetters, getters}, post) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(post, wid)) throw new Error('Что-то пошло не так: posts/create -> test')
        if (!isUnique(post, Object.values(getters.get))) throw new Error('Должность уже существет')

        const path = basePath(wid)
        const key = shortUUID().new()
        const data = normalize(post, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}, id) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: posts/delete -> test')

        const path = basePath(wid)
        const key = id

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, post) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(post, wid) || !post.id) throw new Error('Что-то пошло не так: posts/update -> test')

        const path = basePath(wid)
        const key = post.id
        const data = normalize(post)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)
      const setter = 'posts/set'

      dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    addMultiple({dispatch, rootGetters}, posts) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']
        if (!posts) throw new Error('Что-то пошло не так: posts/addMultiple -> !posts')
        if (!posts.every(post => test(post, wid))) throw new Error('Обязтельные поля не добавлены')

        let promises = posts.map(post => {
          return dispatch('create', post)
        })

        return Promise.any(promises)
      })
    }
  },
  modules: {}
}