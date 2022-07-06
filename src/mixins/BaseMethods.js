import {messageHelper} from "@/mixins/MessageMethods";

export const dispatchMethods = {
  mixins: [messageHelper],
  methods: {
    dispatchSaveData({method, isNew = true, data, msg}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //isNew <Boolean>;
      //data <Any>;
      //msg <String>; Default = isNew ? "Данные сохранены" : "Данные обновлены";
      if (msg === undefined) msg = isNew ? "Данные сохранены" : "Данные обновлены"
      return this.dispatchMethodWithMessage({method, data, msg})
    },
    dispatchDeleteData({method, data, msg}) {
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //data <Any>;
      //msg <String>: Default = Данные удалены;
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

    dispatchAllMethodsWithMessage({tasks, msg}) {
      //tasks <Array> [<Object>: method, data]
      //method <String>: метод из корня vuex. Метод должен возвращать Promise;
      //data <Any>;
      //msg <String>;
      let promises = []
      tasks.map(task => {
        promises.push(this.$store.dispatch(task.method, task.data))
      })
      return Promise.all(promises)
        .then(response => {
          this.successMessage(msg)
          return Promise.resolve(response)
        })
        .catch(err => {
          this.errorMessage(err)
          return Promise.reject(err)
        })
    },
  }
}