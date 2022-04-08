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
        teams: (s) => s.workspace ? s.workspace.teams ? s.workspace.teams : [] : []
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
        addTeam({dispatch, getters}, data) {
            if (!!!data.id && getters.teams.some(team => team.title == data.title)) {
                return new Promise((res, rej) => rej(new Error('Команда с таким названием уже соществует!')))
            }

            console.log('i`m here')
            const team = defTeam(data)
            return dispatch('db/addTeam', team)
        },
        addTask({dispatch}, data) {
            const task = defTask(data)
            return dispatch('db/addTask', task)
        },
        addPost({dispatch}, data) {
            const post = defPost(data)
            return dispatch('db/addPost', post)
        }
    },
    modules: {
        db
    }
}