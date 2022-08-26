import store from "@/store";

const moment = require('moment')

function IMessage(opt) {
  let msg = {
    text: '',
    code: null,
    type: 'info'
  }

  if (typeof opt === 'string') {
    msg.text = opt
  } else if (opt instanceof Error) {
    msg.text = opt.message
    msg.code = opt.code
    msg.type = opt.type
  } else if (opt instanceof Object) {
    msg.text = opt.message || opt.text
    msg.code = opt.code
    msg.type = opt.type
  }

  return msg
}

export class Base {
  constructor(methods) {
    this.createMethod = methods.create
    this.saveMethod = methods.save
    this.deleteMethod = methods.delete
  }

  toString() {
    return JSON.stringify(this)
  }

  create(data, event = {}) {
    if (!data.events) data.events = []

    event.type = 'create'
    event.at = moment().toISOString()
    event.by = store.getters['currentUser/uid']
    data.events.push(event)

    return this.dispatchWithMessage(this.createMethod, data, 'Данные сохранены')
  }

  delete(data) {
    return this.dispatchWithMessage(this.deleteMethod, data, 'Данные удалены')
  }

  update(data, event = {}) {
    if (!data.events) data.events = []

    event.at = moment().toISOString()
    event.by = store.getters['currentUser/uid']
    data.events.push(event)

    return this.dispatchWithMessage(this.saveMethod, data, 'Данные обновлены')
  }

  dispatchWithMessage(method, data, message) {
    return store.dispatch(method, data)
      .then(response => {
        this.successMessage(message)
        return Promise.resolve(response)
      })
      .catch(err => {
        this.errorMessage(err)
        return Promise.reject(err)
      })
  }

  dispatchMethod(method, data) {
    //method <String>: метод из корня vuex. Метод должен возвращать Promise;
    //data <Any>;
    return store.dispatch(method, data)
  }

  baseMessage(msg) {
    const data = IMessage(msg)
    store.dispatch("setMessage", data);
  }

  successMessage(msg) {
    const data = IMessage(msg)
    data.type = 'success'
    this.baseMessage(data)
  }

  errorMessage(msg) {
    const data = IMessage(msg)
    data.type = 'error'
    this.baseMessage(data)
  }
}