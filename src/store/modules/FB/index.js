import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
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
    singInWithLink({}, {email}) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
              res(result)
            })
            .catch((error) => {
              rej(error)
            });
        }
      })
    },
    async getAuthMethod({rootGetters}) {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, rootGetters['currentUser/email'])

      if (signInMethods.indexOf(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
        return 'Email'
      }
      if (signInMethods.indexOf(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) !== -1) {
        return 'Link'
      }
    },
    async reAuth({rootGetters}) {
      try {
        const credential = EmailAuthProvider.credentialWithLink(
          rootGetters['currentUser/email'], window.location.href);

        const auth = getAuth();
        return await reauthenticateWithCredential(auth.currentUser, credential)
      } catch (e) {
        console.error(e)
      }
    }
  }
}