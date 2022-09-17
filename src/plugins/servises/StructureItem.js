import {Base} from "@/plugins/servises/Base";
import store from "@/store";

export class StructureItem {

  static create(data, method, message = 'Данные сохранены', silent = false) {
    if (silent) {
      return Base.dispatchMethod(method, data)
    } else {
      return Base.dispatchWithMessage(method, data, message)
    }
  }

  static update(data, method, message = 'Данные обновлены', silent = false) {
    if (silent) {
      return Base.dispatchMethod(method, data)
    } else {
      return Base.dispatchWithMessage(method, data, message)
    }
  }

  static delete(id, method, message = 'Данные удалены', silent = false) {
    if (silent) {
      return Base.dispatchMethod(method, id)
    } else {
      return Base.dispatchWithMessage(method, id, message)
    }
  }

  static getAll(getter) {
    return Object.values(store.getters[getter])
  }

  static getTitle(id, items) {
    if (!id) return 'Нет'

    const item = items.find(t => t.id === id)
    return item && item.title || 'Без названия'
  }

  static normalize(schema, args = []) {
    let options = {}, res = {}
    args.map(arg => Object.assign(options, arg))

    for (let key in schema) {
      res[key] = options[key] ?? ''
    }

    return res
  }
}