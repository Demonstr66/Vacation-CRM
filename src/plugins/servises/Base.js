import store from "@/store";
import {Message} from "@/plugins/servises/Message";

const moment = require('moment')


export class Base {

  constructor(methods) {
    this.createMethod = methods.create
    this.saveMethod = methods.save
    this.deleteMethod = methods.delete
  }

  toString() {
    return JSON.stringify(this)
  }

  create(data, event = {}, message = 'Данные сохранены', silent = false) {
    if (!data.events) data.events = []

    event.type = 'create'
    event.at = moment().toISOString()
    event.by = store.getters['currentUser/uid']
    data.events.push(event)

    if (silent) return Base.dispatchMethod(this.createMethod, data)
    return Base.dispatchWithMessage(this.createMethod, data, message)
  }

  delete(data, message = 'Данные удалены', silent = false) {
    if (silent) return Base.dispatchMethod(this.deleteMethod, data)
    return Base.dispatchWithMessage(this.deleteMethod, data, message)
  }

  update(data, event = {}, message = 'Данные обновлены', silent = false) {
    if (!data.events) data.events = []

    event.at = moment().toISOString()
    event.by = store.getters['currentUser/uid'] || ""
    data.events.push(event)

    if (silent) return Base.dispatchMethod(this.saveMethod, data)
    return Base.dispatchWithMessage(this.saveMethod, data, message)
  }

  static dispatchWithMessage(method, data, message) {
    return new Promise((res, rej) => {
      store.dispatch(method, data)
        .then(response => {
          Message.successMessage(message)
          res(response)
        })
        .catch(err => {
          Message.errorMessage(err)
          rej(err)
        })
    })
  }

  static dispatchMethod(method, data) {
    //method <String>: метод из корня vuex. Метод должен возвращать Promise;
    //data <Any>;
    return store.dispatch(method, data)
  }

  static normalize(schema, args = []) {
    let options = {}, res = {}
    args.map(arg => Object.assign(options, arg))

    for (let key in schema) {
      res[key] = options[key]
    }

    return res
  }

}