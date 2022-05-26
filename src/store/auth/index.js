import {asyncTryDecorator} from "@/plugins/utils";
import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import router from "@/router";

const BASE_URL = process.env.VUE_APP_API;

export default {
  namespaced: true,
  state: () => ({
    isAuth: false
  }),
  getters: {
    isAuth: (s) => s.isAuth,
  },
  mutations: {
    setAuth: (s, v) => s.isAuth = v,
  },
  actions: {
    register({dispatch}, {user, workspace}) {
      return new Promise(async (res, rej) => {
        try {
          await dispatch('currentUser/create', {user, wid: workspace.id}, {root: true})
          if (workspace.isNew) dispatch('workspace/create', workspace.id, {root: true})

          router.replace({name: 'EmailSending'})
          res()
        } catch (e) {
          console.log('now here')
          rej(e)
        }
      })
    },
    singIn({dispatch}, {email, password}) {
      return asyncTryDecorator(async () => {
        const auth = getAuth();
        const data = await signInWithEmailAndPassword(auth, email, password)
        console.log('singIn: ', data)

        if (!data.user.emailVerified) return Promise.resolve({
          type: 'warning',
          text: 'Email не подтверждён'
        })

        return Promise.resolve('success')
      })
    },
    singOut({}) {
      const auth = getAuth();
      return signOut(auth)
    },
    sendEmailVerify(redirect = true) {
      console.log('send email')
      const auth = getAuth();
      return sendEmailVerification(auth.currentUser, {
        url: BASE_URL + '/login?msg=email_confirm'
      }).then(() => {
        if (redirect) router.push({name: 'EmailSending', query: {e: auth.currentUser.email}}).catch(() => {
        });
      })
    },
    resetPassword({}, email) {
      const auth = getAuth();
      return sendPasswordResetEmail(auth, email, {url: BASE_URL + '/login'})
    },
  }
}