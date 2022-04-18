import {
  getDatabase, ref, set, child, get, onValue,
  off,
  push,
  update,
  remove
} from "firebase/database";
import { defWorkspace, defTeam, defTask, defPost } from "../../plugins/schema";

export default {
  namespaced: true,
  actions: {
    create({ }, data) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const workspace = defWorkspace(data)

          await set(ref(db, 'workspaces/' + data.id), workspace)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    read({ }, wid) {
      return new Promise((res, rej) => {
        try {
          const dbRef = ref(getDatabase());
          get(child(dbRef, `workspaces/${wid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              res(snapshot.val());
            } else {
              rej({ message: "Workspace not found" });
            }
          })
        } catch (e) {
          rej(e);
        }
      })
    },
    update({rootGetters }, data) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const w = rootGetters['workspace/get']

          const workspace = defWorkspace(w, data)

          await set(ref(db, 'workspaces/' + data.id), workspace)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    delete({ }, data) {

    },
    subscribe({ commit }, { path, setter }) {
      const db = getDatabase();
      const dataRef = ref(db, path);

      onValue(dataRef, (data) => {
        const res = data.val();

        commit(setter, res, { root: true })
      });
    },
    unsubscribe({ }, path) {
      const db = getDatabase();
      const wsRef = ref(db, path);
      off(wsRef)
    },
    addTeam({ dispatch }, data) {
      return dispatch('addItem', { data, path: 'teams' })
    },
    addTask({ dispatch }, data) {
      return dispatch('addItem', { data, path: 'tasks' })
    },
    addPost({ dispatch }, data) {
      return dispatch('addItem', { data, path: 'posts' })
    },
    removeTeam({ dispatch }, id) {
      return Promise.all([
        dispatch('removeItemFromAllUsers', { path: 'team', type: 'team', id }),
        dispatch('removeItem', { id, path: 'teams' })
      ])
    },
    removeTask({ dispatch }, id) {
      return Promise.all([
        dispatch('removeTaskFromAllUsers', id),
        dispatch('removeItem', { id, path: 'tasks' })
      ])
    },
    removePost({ dispatch }, id) {
      return Promise.all([
        dispatch('removeItemFromAllUsers', { path: 'post', type: 'post', id }),
        dispatch('removeItem', { id, path: 'posts' })
      ])
    },
    addItem({ rootGetters }, { data, path }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id

          const wsRef = ref(db, 'workspaces/' + wid)
          const key = data.id || push(child(wsRef, path)).key;

          data.id = key

          const updates = {};
          updates[`/${path}/` + key] = data;

          await update(wsRef, updates);
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    removeItem({ rootGetters }, { id, path }) {
      return new Promise(async (res, rej) => {
        try {
          console.log('removeItem',path,  id)
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id

          const itemRef = ref(db, 'workspaces/' + wid + `/${path}/` + id)
          remove(itemRef)
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    addTaskToUser({ rootGetters }, { uid, taskId }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const users = rootGetters['workspace/users']

          const user = rootGetters['workspace/getUserById'](uid)
          let tasks = user.tasks || []

          const usersRef = ref(db, 'users/' + wid + '/' + uid)

          if (tasks.some(x => x == taskId)) return rej({ message: 'Задача уже назначена пользователю', code: '' })

          tasks.push(taskId)

          const updates = {};
          updates[`/tasks`] = tasks;

          await update(usersRef, updates);
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    removeTaskFromUser({ rootGetters }, { uid, taskId }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const users = rootGetters['workspace/users']

          const user = rootGetters['workspace/getUserById'](uid)
          let tasks = user.tasks || []

          const usersRef = ref(db, 'users/' + wid + '/' + uid)

          if (!tasks.some(x => x == taskId)) return res()

          tasks = tasks.filter(x => x != taskId)

          const updates = {};
          updates[`/tasks`] = tasks;

          await update(usersRef, updates);
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    removeTaskFromAllUsers({ rootGetters }, id) {
      return new Promise(async (res, rej) => {
        try {
          console.log('removeTaskFromAllUsers')
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const usersRef = ref(db, 'users/' + wid)

          let users = rootGetters['workspace/users']
          const updates = {};

          users = Object.values(users).map(user => {
            if (!user.tasks) return
            if (!user.tasks.some(task => task == id)) return

            const tasks = user.tasks.filter(t => t != id)
            updates[`/${user.uid}/tasks`] = tasks;
          })
          console.log(updates)
          await update(usersRef, updates);

          res()
        } catch (err) {
          rej(err)
        }
      })
    },
    removeItemFromAllUsers({ rootGetters }, { path, type, id }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const usersRef = ref(db, 'users/' + wid)

          let users = rootGetters['workspace/users']
          const updates = {};

          users = Object.values(users).map(user => {
            if (!user[type]) return

            if (user[type] != id) return

            updates[`/${user.uid}/${path}`] = null;
          })

          await update(usersRef, updates);

          res()
        } catch (err) {
          rej(err)
        }
      })
    },

    disableUserAccount({}, uid) {
      console.log('disable account: ' + uid)
    },
    enableUserAccount({}, uid) {
      console.log('enable account: ' + uid)
    },
    archivingUser({rootGetters}, uid) {
      return new Promise(async (res, rej) => {
        try {
          console.log('archivingUser')
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const user = rootGetters['getUserById']

          await set(ref(db, `users/${wid}/${uid}/archive`), true)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    restoreUser({rootGetters}, uid) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id

          await set(ref(db, `users/${wid}/${uid}/archive`), false)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    deleteUser({rootGetters}, uid) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id

          const userRef = ref(db, `users/${wid}/${uid}/`)
          remove(userRef)
          res()
        } catch (e) {
          rej(e)
        }
      })
    }
  }
}
