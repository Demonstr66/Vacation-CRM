import { getAuth, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
const BASE_URL = process.env.VUE_APP_API;

export default {
  state: () => ({
    user: null,
    isAuth: false
  }),
  getters: {
    isAuth: (s) => s.isAuth,
    getAppName: (s) => s.appName,
    getUser: (s) => s.user
  },
  mutations: {
    setAuth: (s, v) => s.isAuth = v,
    setUser: (s, v) => s.user = v
  },
  actions: {
    createUser({ commit, dispatch }, user) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            createUserWithEmailAndPassword(auth, user.email, user.password)
              .then((userCredential) => {
                const user = userCredential.user;
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
    signOut() {
      const auth = getAuth();
      return new Promise((res, rej) => {
        signOut(auth)
          .then(() => {
            res()
          })
          .catch(e => rej(e))
      })
    },
    signInByEmailAndPassword({ dispatch }, user) {
      const auth = getAuth();

      return new Promise(async (res, rej) => {
        await setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithEmailAndPassword(auth, user.email, user.password)
              .then((userCredential) => {
                const user = userCredential.user;
                dispatch('checkAuth')
                res()
              })
              .catch(e => rej(e))
          })
      })

    },
    verifyEmail() {
      console.log(BASE_URL)
      const auth = getAuth();
      return new Promise((res, rej) => {
        sendEmailVerification(auth.currentUser, { url: BASE_URL +'/emailverify?u=' + auth.currentUser.uid })
          .then(() => {
            res()
          })
          .catch(err => rej(err))
      })
    },
    checkAuth({ commit }) {
      const auth = getAuth();

      const isAuth = auth.currentUser && auth.currentUser.emailVerified

      commit('setAuth', isAuth)
    },
    resetPassword({}, email) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        sendPasswordResetEmail(auth, email, { url: BASE_URL +'/login' })
          .then(() => {
            res()
          })
          .catch(err => {
            rej(err)
          });
      })
    }
  }
}





