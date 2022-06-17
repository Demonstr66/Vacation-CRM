import {dispatchMethods} from '@/mixins/BaseMethods';
import {messageHelper} from "@/mixins/messageHelper";

export const resetPassword = {
  mixins: [dispatchMethods], methods: {
    resetPassword(email) {
      return this.dispatchMethodWithMessage({
        method: 'auth/resetPassword',
        data: email,
        msg: 'На указанный email отправлено письмо для восстановления'
      })
    },
  },
}

export const logIn = {
  mixins: [dispatchMethods], methods: {
    sendEmailVerify() {
      return this.dispatchMethod({
        method: 'auth/sendEmailVerify'
      })
        .catch((err) => {
          this.errorMessage(err)
        })
    }, logIn(data) {
      return this.dispatchMethod({
        method: 'FB/remember', data
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'auth/logIn', data,
          })
        })
        .then((res) => {
          this.successMessage('Вы вошли в аккаунт')
          this.$router.push({name: 'Home'})
        })
        .catch((err) => {
          this.errorMessage(err)

          if (err && err.code && err.code === 'auth/email-not-verify') this.sendEmailVerify()
        })
    }
  }
}

export const signOut = {
  mixins: [dispatchMethods], methods: {
    signOut() {
      return this.dispatchMethod({
        method: 'auth/singOut'
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'clearModulesData'
          })
        })
        .then((res) => {
          return this.dispatchMethod({
            method: 'app/setLogoutState'
          })
        })
        .then((res) => {
          this.successMessage('Вы вышли из аккаунта')
          this.$router.push({name: 'Login'})
        })
        .catch((err) => {
          this.errorMessage(err)
        })
    }
  },
}

export const register = {
  mixins: [dispatchMethods, messageHelper], methods: {
    register(data) {
      return this.dispatchMethod({
        method: 'auth/register', data
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'auth/sendEmailVerify', data: res,
          })
        })
        .then((res) => {
          this.successMessage('Вы зарегистрировались')
        })
        .catch((err) => {
          this.errorMessage(err)
        })
    }
  }
}