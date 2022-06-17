import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  updateProfile
} from "firebase/auth";

export default {
  namespaced: true,
  data: {
    user: null,
  },
  getters: {
    get: (s) => s.user,
    email: (s) => s.user ? s.user.email : null
  },
  mutations: {
    set: (s, v) => s.user = Object.freeze({...v}),
    clear: (s) => s.user = null
  },
  actions: {
    onLogOut({commit}) {
      commit('clear')
    },
    enableAccount() {
    },
    disableAccount() {
    },
    createAccount({}, {email, password}) {
      const auth = getAuth();
      return createUserWithEmailAndPassword(auth, email, password)
    },
    updateAccountInfo({}, {displayName, workspace}) {
      const auth = getAuth();

      return updateProfile(auth.currentUser, {
        displayName,
        photoURL: workspace
      })
    },
    remember({}, {remember}) {
      const pram = remember ? browserLocalPersistence : browserSessionPersistence
      const auth = getAuth();
      return setPersistence(auth, pram)
    },
  }
}