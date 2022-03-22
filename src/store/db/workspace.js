import { getDatabase, ref, set, child, get } from "firebase/database";
import { defWorkspace } from "../../plugins/schema";

export default {
  state: () => ({
    workspace: null
  }),
  getters: {
    getWorkspace: (s) => s.workspace
  },
  mutations: {
    setWorkspace: (s, v) => s.workspace = v,
    updateWorkpace: (s, v) => {
      s.workspace = updateObject(workspace, v)
    }
  },
  actions: {
    createWorkspace({ }, payload) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        let workspace = defWorkspace(payload)

        set(ref(db, 'workspaces/' + workspace.id), workspace).then(
          res(workspace.id)
        ).catch(err => rej(err))

        res()
      })
    },
    updateWorkspace({ }, payload) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        let workspace = defWorkspace(payload)

        set(ref(db, 'workspaces/' + workspace.id), workspace).then(
          res(workspace.id)
        ).catch(err => rej(err))

        res()
      })
    },
    getWorkspace({ }, id) {
      const dbRef = ref(getDatabase());

      return new Promise((res, rej) => {
        get(child(dbRef, `workspaces/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            res(snapshot.val())
          } else {
            rej({ message: "Пространства с id = " + id + " по запросу не найдено" });
          }
        }).catch((error) => {
          rej(error)
        });
      })
    },
    getUserWorkspace({ }, uid) {
      const dbRef = ref(getDatabase());

      return new Promise((res, rej) => {
        get(child(dbRef, `u2w/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            res(snapshot.val())
          } else {
            rej({ message: "Данных по запросу не найдено" + uid });
          }
        }).catch((error) => {
          rej(error)
        });
      })
    },
    addUserToWorkspace({ }, { uid, wid }) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        set(ref(db, 'u2w/' + uid), wid).then(
          res()
        ).catch(err => rej(err))

      })
    },
    fetchWorkspaceInfo({ dispatch, commit }, uid) {
      return new Promise((res, rej) => {
        dispatch('getUserWorkspace', uid).then(val => {
          commit('setWorkspace', val)
          res()
        }).catch(err => rej(err))
      })
    }
  }
}





