import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  inMemoryPersistence,
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
      console.log('browserLocalPersistence')
      const auth = getAuth();
      return setPersistence(auth, browserLocalPersistence)
    },
    sessionRemember({}) {
      console.log('browserSessionPersistence')
      const auth = getAuth();
      console.log('session')
      return setPersistence(auth, browserSessionPersistence)
    }
  }
}