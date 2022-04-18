import db from "./db"
import {getAuth} from "firebase/auth";
import {defPost, defTask, defTeam, defUser} from "../../plugins/schema";

import shortUUID from "short-uuid";
import storage from "@/store/workspace/storage";

export default {
  namespaced: true,
  state: () => ({
    workspace: null,
    users: {},
    archive: {},
    teams: null,
    tasks: null,
    posts: null
  }),
  getters: {
    get: (s) => s.workspace,
    id: (s) => s.workspace ? s.workspace.id : null,
    users: (s) => s.users,
    archive: (s) => s.archive,
    getUserById: (s) => (uid) => s.users ? s.users[uid] : null,
    getUserByIdFromArchive: (s) => (uid) => s.archive ? s.archive[uid] : null,
    teams: (s) => s.teams ? s.teams : [],
    tasks: (s) => s.tasks ? s.tasks : [],
    posts: (s) => s.posts ? s.posts : [],
  },
  mutations: {
    set: (s, v) => {
      s.teams = v.teams ? Object.values(v.teams) : []
      s.tasks = v.tasks ? Object.values(v.tasks) : []
      s.posts = v.posts ? Object.values(v.posts) : []

      s.workspace = v
    },
    setTeams: (s, v) => s.teams = v.teams,
    setTasks: (s, v) => s.tasks = v.tasks,
    setPosts: (s, v) => s.posts = v.posts,

    update: (s, v) => s.workspace = updateObject(s.workspace, v),
    clear: (s) => s.workspace = null,

    setUsers: (s, v) => {
      let users = {}, archive = {}
      for (let id in v) {
        if (v[id].archive) archive[id] = v[id]
        else users[id] = v[id]
      }

      s.users = users
      s.archive = archive
    },
    clearUsers: (s) => s.users = []
  },
  actions: {
    create({dispatch}, data) {
      return dispatch('db/create', data)
    },
    update({dispatch}, data) {
      return dispatch('db/update', data)
    },
    getInfo({dispatch, commit}) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          // const ws = await dispatch('DB/read', auth.currentUser.photoURL)
          // commit('set', ws)
          dispatch('db/subscribe', {
            path: 'workspaces/' + auth.currentUser.photoURL,
            setter: 'workspace/set'
          })

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getUsers({dispatch, commit}) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          dispatch('db/subscribe', {
            path: 'users/' + auth.currentUser.photoURL,
            setter: 'workspace/setUsers'
          })

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getFiles({dispatch, commit}) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          dispatch('storage/getAll', {
            wid: auth.currentUser.photoURL
          })

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getSchedules({dispatch}) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();

          dispatch('schedules/subscribe', {
            wid: auth.currentUser.photoURL
          }, {
            root: true
          })

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    getAllData({dispatch, commit}) {
      return new Promise(async (res, rej) => {
        try {
          Promise.all([
            dispatch('getInfo'),
            dispatch('getUsers'),
            dispatch('getFiles'),
            dispatch('getSchedules')
          ]).then(res()).catch(e => {
            rej(e)
          })
        } catch (e) {
          rej(e)
        }
      })
    },
    updateUser({dispatch, commit}, data) {
      const user = defUser(data)
      return dispatch('db/updateUser', user)
    },
    async addTeam({dispatch}, data) {
      if (!await dispatch('isUnique', {
        type: 'teams',
        data
      })) return Promise.reject(new Error('Команда с таким названием уже' +
        ' существует'))

      const team = defTeam(data)
      return dispatch('db/addTeam', team)
    },
    async addTask({dispatch}, data) {
      if (!await dispatch('isUnique', {
        type: 'tasks',
        data
      })) return Promise.reject(new Error('Задача с таким названием уже' +
        ' существует'))

      const task = defTask(data)
      return dispatch('db/addTask', task)
    },
    async addPost({dispatch}, data) {
      if (!await dispatch('isUnique', {
        type: 'posts',
        data
      })) return Promise.reject(new Error('Должность с таким названием уже' +
        ' существует'))

      const post = defPost(data)
      return dispatch('db/addPost', post)
    },
    isUnique({getters}, {type, data}) {
      return !!data.id || !getters[type].some(item => item.title == data.title)
    },
    archivingUser({getters, dispatch}, uid) {
      const user = getters.getUserById(uid)
      if (!user) return Promise.reject(new Error('Пользователь не найден'))
      if (user.archive) return Promise.reject(new Error('Пользователь уже в архиве'))

      if (user.active) dispatch('db/disableUserAccount', uid)

      return dispatch('db/archivingUser', uid)
    },
    restoreUser({getters, dispatch}, uid) {
      console.log('workspace/restoreUser')
      const user = getters.getUserByIdFromArchive(uid)
      if (!user) return Promise.reject(new Error('Пользователь не найден'))
      if (!user.archive) return Promise.reject(new Error('Недопустимое действие'))

      if (user.active) dispatch('db/enableUserAccount', uid)

      return dispatch('db/restoreUser', uid)
    },
    deleteUser({getters, dispatch}, uid) {
      const user = getters.getUserByIdFromArchive(uid)
      if (!user) return Promise.reject(new Error('Пользователь не найден'))
      if (!user.archive) return Promise.reject(new Error('Недопустимое действие'))

      if (user.active) dispatch('db/disableUserAccount', uid)

      return dispatch('db/deleteUser', uid)
    },
    addManyUsers({dispatch, getters}, users) {
      return new Promise((res, rej) => {
        try {
          let promises = []
          const workspace = getters.id;
          users.map(user => {

            let uid = shortUUID().new()
            promises.push(dispatch('user/db/create', defUser(user, {
              workspace,
              uid
            }), {root: true}))
          })

          res(Promise.all(promises))
        } catch (e) {
          rej(e)
        }
      })

    },
    addManyTeams({dispatch}, teams) {
      return new Promise((res, rej) => {
        try {
          let promises = []
          teams.map(team => {
            promises.push(dispatch('addTeam', team))
          })

          res(Promise.all(promises))
        } catch (e) {
          rej(e)
        }
      })

    },
    addManyPosts({dispatch}, posts) {
      return new Promise((res, rej) => {
        try {
          let promises = []
          posts.map(post => {
            promises.push(dispatch('addPost', post))
          })

          res(Promise.all(promises))
        } catch (e) {
          rej(e)
        }
      })

    },
    setTeamLeader({dispatch, getters}, {uid, teamId}) {
      return new Promise((res, rej) => {
        try {
          const user = getters.getUserById(uid)
          const team = getters.teams.find(t => t.id == teamId)

          if (!user) throw new Error('Пользователь не найден')
          if (!team) throw new Error('Команда не найдена')

          res(dispatch('db/addTeam', defTeam(team, {leaderId: uid})))
        } catch (e) {
          rej(e)
        }
      })
    },
    setTempTeamLeader({dispatch, getters}, {uid, teamId}) {
      return new Promise((res, rej) => {
        try {
          const user = getters.getUserById(uid)

          const team = getters.teams.find(t => t.id == teamId)

          if (!user) throw new Error('Пользователь не найден')
          if (!team) throw new Error('Команда не найдена')

          res(dispatch('db/addTeam', defTeam(team, {tempLeaderId: uid})))
        } catch (e) {
          rej(e)
        }
      })
    },
    upload({dispatch}, file) {
      console.log('upload')
      return dispatch('storage/upload', file)
    }
  },
  modules: {
    db,
    storage
  }
}