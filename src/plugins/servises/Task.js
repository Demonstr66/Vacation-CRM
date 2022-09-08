import {StructureItem} from "@/plugins/servises/StructureItem";

export class Task extends StructureItem {

  static create(data, silent = false) {
    const method = 'tasks/create'
    const message = 'Задача создана'

    return super.create(data, method, message, silent)
  }

  static update(data, silent = false) {
    const method = 'tasks/update'
    const message = 'Задача обновлена'

    return super.update(data, method, message, silent)
  }

  static delete(id, silent = false) {
    const method = 'tasks/delete'
    const message = 'Задача удалена'

    return super.delete(id, method, message, silent)
  }

  static getAll() {
    return super.getAll('tasks/get')
  }

  static getTitle(id) {
    return super.getTitle(id, Task.getAll())
  }
}