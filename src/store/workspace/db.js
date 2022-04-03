import { getDatabase, ref, set, get, child } from "firebase/database";
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
    update({ }, data) {

    },
    delete({ }, data) {

    },
    test({ rootGetters }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const wid = rootGetters['workspace/get'].id
          const teams = [1, 2, 3].map(id => defTeam({ id, title: 'Team ' + id }))
          const tasks = [1, 2, 3].map(id => defTask({ id, title: 'Task ' + id }))
          const posts = ['Тимлидер', 'Старший специалист по обработке данных', 'Специалист по обработке данных'].map((title, index) => defPost({ id: index, title }))

          await set(ref(db, 'workspaces/' + wid + '/teams'), teams)
          await set(ref(db, 'workspaces/' + wid + '/tasks'), tasks)
          await set(ref(db, 'workspaces/' + wid + '/posts'), posts)

          res()
        } catch (e) {
          rej(e)
        }
      })
    }
  }
}
