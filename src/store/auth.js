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
import { getDatabase, ref, set, child, get, push, update, onValue, remove } from "firebase/database";
import { defUser, updateObject } from "../plugins/schema";
const BASE_URL = process.env.VUE_APP_API;

export default {
  state: () => ({
    user: null,
    isAuth: false,
  }),
  getters: {
    getUser: (s) => s.user,
    isAuth: (s) => s.isAuth,
  },
  mutations: {
    setAuth: (s, v) => s.isAuth = v,
    setUser: (s, v) => s.user = v,
  },
  actions: {
    createUser({ commit, dispatch }, payload) {
      const auth = getAuth();
      return new Promise(async (res, rej) => {
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            createUserWithEmailAndPassword(auth, payload.user.email, payload.user.password)
              .then((userCredential) => {
                const data = userCredential.user;
                const user = defUser(data, payload.user, { status: 'email sending' })

                dispatch('createUserInfo', user).catch(err => {
                  rej(err)
                })

                dispatch('addUserToWorkspace', { uid: user.uid, wid: payload.wid }).catch(err => {
                  rej(err)
                })

                commit('setUser', user)

                dispatch('verifyEmail')
                  .then(() => res())
                  .catch(err => {
                    rej(err)
                  })
              })
              .catch(e => rej(e))
          })
          .catch(e => rej(e))
      })

    },
    signOut({ dispatch }) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        signOut(auth)
          .then(() => {
            dispatch('clearAllPersData')
            res()
          })
          .catch(e => rej(e))
      })
    },
    signInByEmailAndPassword({ dispatch, commit }, user) {
      const auth = getAuth();

      return new Promise(async (res, rej) => {
        await setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithEmailAndPassword(auth, user.email, user.password)
              .then((userCredential) => {
                const user = userCredential.user;

                dispatch('onSignIn')

                if (!user.emailVerified) {
                  rej({ code: 'emeil not verify', message: 'Емейл не подтверждён', u: user.uid, user })

                  return
                }
                console.log(user)
                res()
              })
              .catch(e => rej(e))
          })
      })

    },
    verifyEmail() {
      const auth = getAuth();
      return new Promise((res, rej) => {
        sendEmailVerification(auth.currentUser, { url: BASE_URL + '/emailverify?u=' + auth.currentUser.uid + '&e=' + auth.currentUser.email })
          .then(() => {
            res()
          })
          .catch(err => rej(err))
      })
    },
    async checkAuth({ commit, dispatch }) {
      const auth = getAuth();

      const isAuth = auth.currentUser && auth.currentUser.emailVerified
      commit('setAuth', isAuth)
    },
    async fetchUserInfo({ commit, dispatch }) {
      const auth = getAuth();

      const info = await dispatch('getUserInfo', auth.currentUser.uid)
      let userInfo = defUser(info)
      const user = updateObject(userInfo, auth.currentUser)

      commit('setUser', user)
    },
    resetPassword({ }, email) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        sendPasswordResetEmail(auth, email, { url: BASE_URL + '/login' })
          .then(() => {
            res()
          })
          .catch(err => {
            rej(err)
          });
      })
    },
    updateUser({ }, payload) {

    },
    addUserToArchive({ }, uid) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        set(ref(db, 'archive/' + uid), true)
          .then(res())
          .catch(err => rej(err))
      })
    },
    removeUserFromArchive({ }, uid) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        remove(ref(db, 'archive/' + uid))
          .then(res())
          .catch(err => rej(err))
      })
    },
    deleteUser({ dispatch, commit }, uid) {
      return new Promise(async (res, rej) => {
        const db = getDatabase();
        commit('movePersonToArchive', uid)

        Promise.all([
          dispatch('updateUserInfo', { archive: true, uid }),
          dispatch('addUserToArchive', uid)
        ]).then(res())
          .catch(err => rej(err))
      })
    },
    restoreUser({ dispatch, commit }, uid) {
      return new Promise(async (res, rej) => {
        const db = getDatabase();
        commit('movePersonFromArchive', uid)

        Promise.all([
          dispatch('updateUserInfo', { archive: false, uid }),
          dispatch('removeUserFromArchive', uid)
        ]).then(res())
          .catch(err => rej(err))
      })
    }
  }
}





