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

const axios = require('axios');
const BASE_URL = process.env.VUE_APP_API;

export default {
  state: () => ({
    isAuth: false,
    isEmailVerified: false,
    isLogining: false
  }),
  getters: {
    isAuth: (s) => s.isAuth,
    isEmailVerified: (s) => s.isEmailVerified,
    isLogging: (s) => s.isLogining,
  },
  mutations: {
    setAuth: (s, v) => s.isAuth = v,
    setEmailVerified: (s, v) => s.isEmailVerified = v,
    setLogging: (s, v) => s.isLogining = v,
  },
  actions: {
    onRegisterHandler({ dispatch }, { user, workspace }) {
      return new Promise(async (res, rej) => {
        try {

          const uid = await dispatch('user/create', { user, workspace })
          if (workspace.isNew) await dispatch('workspace/create', workspace)

          await dispatch('sendEmailVerify', user)
          axios.get('https://crm.tgtransfer.ru/user/set/permission/base',
              {
                params: {
                  u: uid
                }
              })

          res()
        } catch (err) {
          rej(err)
        }
      })
    },
    async onSignInHandler({ dispatch }, { email, password }) {
      return new Promise(async (res, rej) => {
        try {
          const user = await dispatch('loginByEmailAndPassword', { email, password })

          if (!user.emailVerified) {
            dispatch('signOut')
            rej({ code: 'auth/email-not-verify', email: user.email })
          }

          dispatch('user/getCurrentUserData').then((r) => {
            dispatch('user/db/setAsActive')
            dispatch('workspace/getAllData')
          }
          )

          dispatch('user/fb/remember')
          res()
        } catch (err) {
          rej(err)
        }
      })
    },
    async loginByEmailAndPassword({ }, { email, password }) {
      return new Promise(async (res, rej) => {
        try {
          const auth = getAuth();
          signInWithEmailAndPassword(auth, email, password)
            .then(data => res(data.user))
            .catch(err => rej(err))
        } catch (err) {
          rej(err)
        }
      })
    },
    sendEmailVerify({ }, { email }) {
      const auth = getAuth();
      return sendEmailVerification(auth.currentUser, { url: BASE_URL + '/login?msg=email_cofirm' })
    },
    signOut({ dispatch }) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        signOut(auth)
          .then(() => {
            res()
          })
          .catch(e => rej(e))
      })
    },
    setAuthState({ commit, dispatch }) {
      const auth = getAuth();
      const isAuth = !!auth.currentUser
      const isEmailVerified = isAuth && auth.currentUser.emailVerified
      const isLogining = isAuth && isEmailVerified

      commit('setAuth', isAuth)
      commit('setEmailVerified', isEmailVerified)
      commit('setLogging', isLogining)

      return isLogining
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





