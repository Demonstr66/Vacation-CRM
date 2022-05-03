import {messageHelper} from "@/mixins/messageHelper";

export const dataMethods = {
  mixins: [messageHelper],
  methods: {
    mixSaveData({saveMethod, isNew, data}) {
      console.log('mixSaveData')
      return this.$store.dispatch(saveMethod, data)
        .then(() => this.mixSuccess(isNew
          ? "Данные сохранены"
          : "Данные обновлены"))
        .catch((err) => this.mixError(err));
    },
    mixDeleteData({delMethod, id, msg = "Данные удалены"}) {
      console.log('mixDeleteData')
      return this.$store.dispatch(delMethod, id)
        .then(() => this.mixSuccess(msg))
        .catch((err) => this.mixError(err));
    },

    asyncDispatchWithMessage({method, data, msg}) {
      return this.$store.dispatch(method, data)
        .then((res) => {

          console.log('asyncDispatchWithMessage -> then: ', res)
          this.mixMessage({
            type: res ? res.type ? res.type : 'success' : 'success',
            text: res ? res.text ? res.text : msg : msg
          })
        })
        .catch((err) => this.mixError(err));
    },
    asyncDispatch({method, data}) {
      return this.$store.dispatch(method, data)
        .catch((err) => this.mixError(err));
    },
    asyncCallbackWithMessage({method, data, msg}) {
      return method(data)
        .then(() => this.mixSuccess(msg))
        .catch((err) => this.mixError(err));
    },
    asyncCallback({callback, data}) {
      return new Promise(async (res, rej) => {
        try {
          await callback(data)
          res()
        } catch (e) {
          this.mixError(e.message)
          rej(e)
        }
      })
    },

    promiseMessages({promise, msg}) {
      return promise
        .then(() => this.mixSuccess(msg))
        .catch((err) => this.mixError(err));
    },
  }
}

export const getUserNameById = {
  methods: {
    getUserNameById(uid) {
      const user = this.$store.getters['workspace/getUserById'](uid)
      return user ? user.fullName ? user.fullName : '' : ''
    }
  }
}

export const copyToClipboard = {
  mixins: [messageHelper],
  data: () => ({
    copiedSuccessful: false
  }),
  methods: {
    copyToClipboard(text) {
      return navigator.clipboard.writeText(text)
        .then(() => {
          this.copiedSuccessful = true
          setTimeout(() => {
            this.copiedSuccessful = false
          }, 3000)
        })
        .catch((err) => {
          this.mixError(err)
        })
    }
  }
}