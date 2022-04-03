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
import { getDatabase, ref, set } from "firebase/database";
import { defUser } from "../../plugins/schema";

export default {
  namespaced: true,
  actions: {
    create({ }, { email, password }) {
      const auth = getAuth();
      return new Promise((res, rej) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            res(user.uid)
          })
          .catch(err => rej(err))
      })
    },
    async remember({ }) {
      const auth = getAuth();
      return setPersistence(auth, browserLocalPersistence)
    },
    updateUserProfile({ }, { emailVerified, disabled, displayName,photoURL, workspace }) {
      const auth = getAuth();

      return updateProfile(auth.currentUser, {
        emailVerified,
        displayName,
        disabled,
        photoURL: workspace || photoURL
      })
    },
    delete({ }, data) {

    }
  }
}
