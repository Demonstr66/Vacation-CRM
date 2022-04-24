import {defTeam} from "@/plugins/schema";
import shortUUID from "short-uuid";
import {asyncTryDecorator, basePathFunction, isUnique} from "@/plugins/utils";

const basePath = basePathFunction(`workspaces/{wid}/teams`)
const test = (item, wid) => !!wid && !!item  && !!item.title
const normalize = defTeam

export default {
  namespaced: true,
  state: () => ({
    teams: null,
    ready: false
  }),
  getters: {
    get: (s) => s.teams || {},
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.teams = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.teams = null
  },
  actions: {
    get({}) {

    },
    create({dispatch, rootGetters, getters}, team) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(team, wid)) throw new Error('Что-то пошло не так: teams/create -> test')
        if (!isUnique(team, Object.values(getters.get))) throw new Error('Команда уже существет')

        const path = basePath(wid)
        const key = shortUUID().new()
        const data = normalize(team, {id: key})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}, id) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']
        if (!id || !wid) throw new Error('Что-то пошло не так: teams/delete -> test')

        const path = basePath(wid)
        const key = id

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, team) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['getWID']

        if (!test(team, wid) || !team.id) throw new Error('Что-то пошло не так: teams/update ->' +
          ' test')

        const path = basePath(wid)
        const key = team.id
        const data = normalize(team)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)
      const setter = 'teams/set'

      dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['getWID']
      const path = basePath(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
  }
}