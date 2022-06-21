import shortUUID from "short-uuid";
import {defUser} from "@/plugins/schema";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";

const basePath = basePathFunction(`users/{wid}`)
const test = (item, wid) => !!wid && !!item && !!item.fullName && !!item.email
const normalize = defUser


export default {
  namespaced: true,
  state: () => ({
    users: null,
    archive: null,
    ready: false
  }),
  getters: {
    get: (s) => s.users || {},
    getArchive: (s) => s.archive,
    getUserById: (s) => (uid) => s.users ? s.users[uid] : null,
    getUserByIdFromArchive: (s) => (uid) => s.archive ? s.archive[uid] : null,
    getDisplayNameByUID: (s) => (uid) => s.users ? s.users[uid] ? s.users[uid].displayName : '' : '',
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      let users = {}, archive = {}
      for (let id in v) {
        if (v[id].archive) archive[id] = v[id]
        else users[id] = v[id]
      }

      s.users = Object.freeze(users)
      s.archive = Object.freeze(archive)
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => {
      s.users = null
      s.archive = null
    }
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
    create({dispatch, rootGetters, getters}, user) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(user, wid)) throw new Error('Что-то пошло не так: users/create -> test')
        if (!isUnique(user, [...Object.values(getters.get), ...Object.values(getters.getArchive)], 'email')) {
          throw new Error('Email уже использован')
        }

        const path = basePath(wid)
        const key = shortUUID().new()
        const data = normalize(user, {uid: key, workspace: wid})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch, getters}, uid) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!uid || !wid) throw new Error('Что-то пошло не так: users/delete -> test')

        const user = getters.getUserByIdFromArchive(uid)
        if (!user) throw new Error('Пользователь не найден')

        const path = basePath(wid)
        const key = uid

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, user) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(user, wid) || !user.uid) throw new Error('Что-то пошло не так: users/update -> test')

        const path = basePath(wid)
        const key = user.uid
        const data = normalize(user)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'users/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    moveUserToArchive({getters, dispatch}, uid) {
      return asyncTryDecorator(async () => {
        if (!uid) throw new Error('UID не может быть пустым')

        const user = getters.getUserById(uid)
        if (!user) throw new Error('Пользователь не найден')
        if (user.archive) throw new Error('Пользователь уже в архиве')

        if (user.active) await dispatch('FB/disableAccount', uid)

        user.archive = true

        return dispatch('update', user)
      })
    },
    restoreUser({getters, dispatch}, uid) {
      return asyncTryDecorator(async () => {
        if (!uid) throw new Error('UID не может быть пустым')

        const user = getters.getUserByIdFromArchive(uid)
        if (!user) throw new Error('Пользователь не найден')
        if (!user.archive) throw new Error('Пользователь не в архиве')

        if (user.active) await dispatch('FB/enableAccount', uid, {root: true})

        user.archive = false

        return dispatch('update', user)
      })
    },
    addMultiple({dispatch, rootGetters}, users) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!users) throw new Error('Что-то пошло не так: users/addMultiple -> !users')
        if (!users.every(user => test(user, wid))) throw new Error('Обязтельные поля не добавлены')

        let promises = users.map(user => {
          return dispatch('create', user)
        })

        return Promise.any(promises)
      })
    },

    addTaskToUser({dispatch, getters}, {uid, id}) {
      return asyncTryDecorator(() => {
        if (!uid || !id) throw new Error('Что то пошло не так: users/deleteTaskFromUser')
        let user = getters.getUserById(uid)
        if (!user) throw new Error('Пользователь не найден')

        if (!user.tasks) user.tasks = []

        user.tasks.push(id)
        return dispatch('update', user)
      })
    },
    deleteTaskFromUser({dispatch, getters}, {uid, id}) {
      return asyncTryDecorator(() => {
        if (!uid || !id) throw new Error('Что то пошло не так: users/deleteTaskFromUser')
        const user = getters.getUserById(uid)
        if (!user) throw new Error('Пользователь не найден')

        user.tasks = user.tasks.filter(task => task !== id)
        return dispatch('update', user)
      })
    },

    deleteTeamFromUsers({dispatch}, id) {
      return dispatch('deleteSingleItemFromUsers', {type: 'team', id})
    },
    deletePostFromUsers({dispatch}, id) {
      return dispatch('deleteSingleItemFromUsers', {type: 'post', id})
    },
    deleteTaskFromUsers({dispatch}, id) {
      return dispatch('deleteItemFromArrayItemsFromUsers', {type: 'tasks', id})
    },
    deleteSingleItemFromUsers({rootGetters, dispatch}, {type, id}) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!id || !type || !wid) throw new Error('Что-то пошло не так: users/deleteSingleItemFromUsers -> !id || !type || !wid')

        let users = rootGetters['users/get']
        let promises = []

        Object.values(users).map(user => {
          if (!user[type] || user[type] !== id) return

          const path = basePath(wid, user.uid)
          const key = type

          promises.push(dispatch('DB/delete', {path, key}, {root: true}))
        })

        return Promise.all(promises)
      })
    },
    deleteItemFromArrayItemsFromUsers({rootGetters, dispatch}, {type, id}) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!id || !type || !wid) throw new Error('Что-то пошло не так: users/deleteItemFromArrayItemsFromUsers -> !id || !type || !wid')

        let users = rootGetters['users/get']
        let promises = []

        Object.values(users).map(user => {
          if (!user[type]) return

          const idx = user[type].findIndex(item => item === id)

          if (idx === -1) return

          let data = user[type]
          data.splice(idx, 1)

          const path = basePath(wid, user.uid)
          const key = type

          promises.push(dispatch('DB/set', {path, key, data}, {root: true}))
        })

        return Promise.all(promises)
      })
    },
  }
}