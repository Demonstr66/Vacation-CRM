import {asyncTryDecorator} from "@/plugins/utils";
import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {Workspace} from "@/plugins/servises/Workspace";

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
    onLogOut({commit, dispatch}) {
      commit('setAuth', false)
      dispatch('singOut')
    },
    register({dispatch}, {user, workspace}) {
      return new Promise(async (res, rej) => {
        try {
          if (!workspace.isNew) await dispatch('checkWorkspaceExisting', workspace)

          const uid = await dispatch('currentUser/create', {user, wid: workspace.id}, {root: true})
          if (workspace.isNew) {
            const ws = new Workspace({
              id: workspace.id,
              owner: uid
            })

            ws.create()
          }

          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    logIn({dispatch}, {email, password}) {
      return asyncTryDecorator(async () => {
        const auth = getAuth();
        const data = await signInWithEmailAndPassword(auth, email, password)

        if (!data.user.emailVerified) throw {code: 'auth/email-not-verify'}

        return Promise.resolve('success')
      })
    },
    singOut({}) {
      const auth = getAuth();
      return signOut(auth)
    },
    sendEmailVerify() {
      const auth = getAuth();
      return sendEmailVerification(auth.currentUser, {
        url: BASE_URL + '/login?msg=email_confirm'
      })
    },
    resetPassword({}, email) {
      const auth = getAuth();
      return sendPasswordResetEmail(auth, email, {url: BASE_URL + '/login'})
    },
    checkWorkspaceExisting({dispatch}, {id}) {
      return new Promise(async (res, rej) => {
        try {
          let result = await dispatch('DB/checkExiting', {
            path: 'workspaces',
            key: id
          }, {root: true})

          if (!result) throw new Error('Пространство не найдено. Проверьте код')
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
  }
}