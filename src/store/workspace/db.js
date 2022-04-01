import { getDatabase, ref, set } from "firebase/database";
import { defWorkspace } from "../../plugins/schema";

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
    read({ }, data) {

    },
    update({ }, data) {

    },
    delete({ }, data) {

    }
  }
}
