import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";
import {Team} from "@/plugins/servises/Team";

const basePath = basePathFunction(`workspaces/{wid}/teams`)
const test = (item, wid) => !!wid && !!item && !!item.title
const normalize = Team.normalize

export default {
  namespaced: true, state: () => ({
    teams: null, ready: false
  }), getters: {
    get: (s) => s.teams || {},
    count: (s) => Object.values(s.teams || {}).length,
    isReady: (s) => s.ready
  }, mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.teams = Object.freeze(v)
    }, setReady: (s, v) => s.ready = v, clear: (s) => s.teams = null
  }, actions: {
    initialize({dispatch}) {
      return dispatch('subscribe')
    }, onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    }, create({dispatch, rootGetters, getters}, team) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(team, wid)) throw new Error('Что-то пошло не так: teams/create -> test')
        if (!isUnique(team, Object.values(getters.get))) throw new Error('Команда уже существет')

        const path = basePath(wid)
        const key = team.id || shortUUID().new()
        const data = normalize(team, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, delete({rootGetters, dispatch}, id) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: teams/delete -> test')

        const path = basePath(wid)
        const key = id

        dispatch('users/deleteTeamFromUsers', key, {root: true})
        return dispatch('DB/delete', {path, key}, {root: true})
      })
    }, update({rootGetters, dispatch, getters}, team) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(team, wid) || !team.id) throw new Error('Что-то пошло не так: teams/update ->' + ' test')
        if (!isUnique(team, Object.values(getters.get))) throw new Error('Команда уже существет')

        const path = basePath(wid)
        const key = team.id
        const data = normalize(team)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    }, subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)
      const setter = 'teams/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    }, unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },

    addMultiple({dispatch, rootGetters}, teams) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!teams) throw new Error('Что-то пошло не так: teams/addMultiple -> !teams')
        if (!teams.every(team => test(team, wid))) throw new Error('Обязтельные поля не добавлены')

        let promises = teams.map(team => {
          return dispatch('create', team)
        })

        return Promise.any(promises)
      })
    }
  },
}