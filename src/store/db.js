import { getDatabase, ref, set, child, get } from "firebase/database";
import { defUser, defWorkspace } from "../plugins/schema";

export default {
  state: () => ({
  }),
  getters: {
  },
  mutations: {
  },
  actions: {
    addUserInfo({ }, payload) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        let user = defUser(payload)

        set(ref(db, 'users/' + payload.uid), user).then(
          res()
        ).catch(err => rej(err))

        res()
      })
    },
    getUserInfo({ dispatch }, uid) {
      const dbRef = ref(getDatabase());

      return new Promise((res, rej) => {
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let user = snapshot.val()

            dispatch('getUserWorkspace', uid).then((val) => {
              user.workspace = val

              res(user)
            })

          } else {
            rej({ message: "Данных по запросу не найдено" });
          }
        }).catch((error) => {
          rej(error)
        });
      })
    },
    addWorkspace({ }, payload) {
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
            rej({ message: "Данных по запросу не найдено" });
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
            rej({ message: "Данных по запросу не найдено" });
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
    }
  }
}





