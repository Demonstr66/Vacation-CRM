import { getDatabase, ref, set, child, get, onValue, off } from "firebase/database";
import { defUser } from "../../plugins/schema";
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

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
        } catch (err) { rej(err) }
      })
    },
    delete({ }, data) {

    },
    setAsActive({ rootGetters, dispatch }) {
      console.log('setAsActive')
      // return Promise.resolve()
      const user = rootGetters['user/get']
      console.log(user)
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
    subscribe({ commit }, uid) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + uid);

      onValue(userRef, (data) => {
        const user = data.val();
        commit('user/set', user, { root: true })
      });
    },
    unsubscribe({ }, uid) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + uid);
      off(userRef)
    }
  }
}
