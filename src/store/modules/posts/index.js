import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";
import {Post} from "@/plugins/servises/Post";

const basePath = basePathFunction(`workspaces/{wid}/posts`)
const test = (item, wid) => !!wid && !!item && !!item.title
const normalize = Post.normalize

export default {
  namespaced: true,
  state: () => ({
    posts: null,
    ready: false
  }),
  getters: {
    get: (s) => s.posts || {},
    getById: (s) => (id) => s.posts[id],
    count: (s) => Object.values(s.posts || {}).length,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.posts = Object.freeze(v)
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.posts = null
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
    create({dispatch, rootGetters, getters}, post) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(post, wid)) throw new Error('Что-то пошло не так: posts/create -> test')
        if (!isUnique(post, Object.values(getters.get))) throw new Error('Должность уже существет')

        const path = basePath(wid)
        const key = post.id || shortUUID().new()
        const data = normalize(post, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}, id) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: posts/delete -> test')

        const path = basePath(wid)
        const key = id

        dispatch('users/deletePostFromUsers', key, {root: true})
        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch, getters}, post) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(post, wid) || !post.id) throw new Error('Что-то пошло не так: posts/update -> test')
        if (!isUnique(post, Object.values(getters.get))) throw new Error('Должность уже существет')

        const path = basePath(wid)
        const key = post.id
        const data = normalize(post)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'posts/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    addMultiple({dispatch, rootGetters}, posts) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
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