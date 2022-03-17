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
import { defUser, updateObject } from "../plugins/schema";
const BASE_URL = process.env.VUE_APP_API;

export default {
  state: () => ({
    user: null,
    isAuth: false
  }),
  getters: {
    isAuth: (s) => s.isAuth,
    getAppName: (s) => s.appName,
    getUser: (s) => s.user,
    getInfo: (s) => s.info,
  },
  mutations: {
    setAuth: (s, v) => s.isAuth = v,
    setUser: (s, v) => s.user = v,
    setInfo: (s, v) => s.info = v
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
                const user = defUser(data, payload.user)

                dispatch('addUserInfo', user).catch(err => {
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
    signOut({ commit }) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        signOut(auth)
          .then(() => {
            commit('setUser', null)
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

                dispatch('checkAuth')

                if (!user.emailVerified) {
                  rej({ code: 'emeil not verify', message: 'Емейл не подтверждён', u: user.uid, user })

                  return
                }

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

      if (!isAuth) return

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
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg",
        param: 'param'
      }).then(() => {
        console.log(auth.currentUser)
      }).catch((error) => {
        // An error occurred
        // ...
      });
    }
  }
}





