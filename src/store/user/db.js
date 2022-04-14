import { getDatabase, ref, set, child, get, onValue, off } from "firebase/database";
import { defUser } from "../../plugins/schema";

export default {
  namespaced: true,
  actions: {
    create({ }, data) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const user = defUser(data)

          await set(ref(db, `users/${user.workspace}/${user.uid}`), user)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    read({ }, { uid, photoURL }) {
      return new Promise((res, rej) => {
        try {
          const dbRef = ref(getDatabase());
          get(child(dbRef, `users/${photoURL}/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              res(snapshot.val());
            } else {
              rej({ message: "User not found" });
            }
          })
        } catch (err) {
          rej(err);
        }
      })
    },
    update({ }, user) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();

          await set(ref(db, `users/${user.workspace}/${user.uid}`), user)
          res()
        } catch (err) { rej(err) }
      })
    },
    delete({ }, data) {

    },
    setAsActive({ rootGetters, dispatch }) {
      const user = rootGetters['user/get']
      
      if (user.active) return Promise.resolve()
      user.active = true
      user.emailVerified = true

      return dispatch('update', user)
    },
    bindToWorkspace({ }, { uid, wid }) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          await set(ref(db, 'usersWorkspace/' + uid), wid)

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
  }
}
