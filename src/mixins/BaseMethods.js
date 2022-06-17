import {messageHelper} from "@/mixins/messageHelper";

export const dispatchMethods = {
  mixins: [messageHelper],
  methods: {
    dispatchSaveData({method, isNew = true, data, msg}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //isNew <Boolean>;
      //data <Any>;
      //msg <String>;
      if (msg === undefined) msg = isNew ? "Данные сохранены" : "Данные обновлены"
      return this.dispatchMethodWithMessage({method, data, msg})
    },
    dispatchDeleteData({method, data, msg}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //data <Any>;
      //msg <String>;
      if (msg === undefined) msg = "Данные удалены"
      return this.dispatchMethodWithMessage({method, data, msg})
    },
    dispatchMethodWithMessage({method, data, msg}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //data <Any>;
      //msg <String>;
      return this.$store.dispatch(method, data)
        .then(response => {
          this.successMessage(msg)
          return Promise.resolve(response)
        })
        .catch(err => {
          this.errorMessage(err)
          return Promise.reject(err)
        })
    },
    dispatchMethod({method, data}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //data <Any>;
      return this.$store.dispatch(method, data)
    },

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