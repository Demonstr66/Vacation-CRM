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
  state: () => ({}),
  getters: {},
  mutations: {},
  actions: {
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
    remember({}) {
      const auth = getAuth();
      return setPersistence(auth, browserLocalPersistence)
    },
    sessionRemember({}) {
      const auth = getAuth();
      console.log('session')
      return setPersistence(auth, browserSessionPersistence)
    }
  }
}