import db from "./db"
import {getAuth} from "firebase/auth";
import {defTask, defTeam, defUser, defPost} from "../../plugins/schema";

export default {
    namespaced: true,
    state: () => ({
        workspace: null,
        users: {}
    }),
    getters: {
        get: (s) => s.workspace,
        id: (s) => s.workspace ? s.workspace.id : null,
        users: (s) => s.users,
        getUserById: (s) => (uid) => s.users ? s.users[uid] : null,
        teams: (s) => s.workspace ? s.workspace.teams ? s.workspace.teams : [] : [],
        tasks: (s) => s.workspace ? s.workspace.tasks ? s.workspace.tasks : [] : [],
        posts: (s) => s.workspace ? s.workspace.posts ? s.workspace.posts : [] : [],
    },
    mutations: {
        set: (s, v) => {
            if (v.teams) v.teams = Object.values(v.teams)
            if (v.tasks) v.tasks = Object.values(v.tasks)
            if (v.posts) v.posts = Object.values(v.posts)

            s.workspace = v
        },
        update: (s, v) => s.workspace = updateObject(s.workspace, v),
        clear: (s) => s.workspace = null,

        setUsers: (s, v) => {
            s.users = v
        },
        clearUsers: (s) => s.users = []
    },
    actions: {
        create({dispatch}, data) {
            return dispatch('db/create', data)
        },
        getInfo({dispatch, commit}) {
            return new Promise(async (res, rej) => {
                try {
                    const auth = getAuth();
                    // const ws = await dispatch('db/read', auth.currentUser.photoURL)
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
        getAllData({dispatch, commit}) {
            return new Promise(async (res, rej) => {
                try {
                    Promise.all([
                        dispatch('getInfo'),
                        dispatch('getUsers')
                    ]).then(res())
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
        }
    },
    modules: {
        db
    }
}