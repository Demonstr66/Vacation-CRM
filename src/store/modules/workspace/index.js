import {asyncTryDecorator, basePathFunction} from "@/plugins/utils";
import {defWorkspace} from "@/plugins/schema";
import {Workspace} from "@/plugins/servises/Workspace";

const basePath = basePathFunction(`workspaces`)
const test = (item, wid) => !!wid && !!item
const normalize = Workspace.normalize

export default {
  namespaced: true,
  state: () => ({
    workspace: null,
    ready: false
  }),
  getters: {
    get: (s) => s.workspace || {},
    permissions: (s) => s.workspace ? s.workspace.permissions : {},
    isReady: (s) => s.ready,
    domain: (s) => s.workspace.domain
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true

      s.workspace = new Workspace(v)
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.workspace = null
  },
  actions: {
    initialize({dispatch}) {
      return dispatch('subscribe')
    },
    onLogOut({dispatch, commit}) {
      dispatch('unsubscribe')
      commit('clear')
    },
    create({dispatch, rootGetters, getters}, {wid, owner}) {
      return asyncTryDecorator(() => {
        // const wid = rootGetters['app/getWID']

        if (!wid) throw new Error('Что-то пошло не так: workspace/create -> !wid')

        const defaultSetting = '{"admins":{"visibility":0,"manageUsers":[],"manageVacations":false,"manageWS":false},"leaders":{"visibility":0,"manageUsers":[],"manageVacations":false,"manageWS":false},"users":{"visibility":0,"manageUsers":[],"manageVacations":[],"manageWS":[]}}'

        const path = basePath(wid)
        const key = wid
        const data = normalize({id: key, owner, privacy: defaultSetting})

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    delete({rootGetters, dispatch}) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']
        if (!wid) throw new Error('Что-то пошло не так: workspace/create -> !wid')

        const path = basePath(wid)
        const key = wid

        return dispatch('DB/delete', {path, key}, {root: true})
      })
    },
    update({rootGetters, dispatch}, workspace) {
      return asyncTryDecorator(() => {
        const wid = rootGetters['app/getWID']

        if (!test(workspace, wid) || !workspace.id) throw new Error('Что-то пошло не так:' +
          ' workspace/update -> test')

        const path = basePath(wid)
        const key = workspace.id
        const data = normalize(workspace)

        return dispatch('DB/set', {path, key, data}, {root: true})
      })
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid, wid)
      const setter = 'workspace/set'

      return dispatch('DB/subscribe', {path, setter}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePath(wid, wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
  },
}