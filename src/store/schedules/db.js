import {child, get, getDatabase, ref, set} from "firebase/database";
import {defWorkspace} from "../../plugins/schema";

export default {
  namespaced: true,
  actions: {
    create({}, data) {
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
    read({}, wid) {
      return new Promise((res, rej) => {
        try {
          const dbRef = ref(getDatabase());
          get(child(dbRef, `workspaces/${wid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              res(snapshot.val());
            } else {
              rej({message: "Workspace not found"});
            }
          })
        } catch (e) {
          rej(e);
        }
      })
    },
    update({rootGetters}, data) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const w = rootGetters['workspace/get']
          console.log(w)
          console.log(data)
          const workspace = defWorkspace(w, data)

          await set(ref(db, 'workspaces/' + data.id), workspace)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    delete({}, data) {

    },
  }
}
