import {dataMethods} from "@/mixins/dataHelper";

export const accountMethods = {
  mixins: [dataMethods],
  methods: {
    mixSignOut() {
      return this.asyncDispatchWithMessage({
        method: 'logOut',
        data: null,
        msg: 'Вы вышли из аккаунта'
      })
    },
    mixSignIn(data) {
      return this.asyncDispatchWithMessage({
        method: 'logIn',
        data,
        msg: 'Вы вошли в аккаунт'
      })
    },
    mixRegisterUser(data) {
      return this.asyncDispatch({
        method: 'auth/register',
        data
      })
    }
  }
}
