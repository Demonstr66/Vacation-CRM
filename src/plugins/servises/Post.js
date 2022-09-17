import {StructureItem} from "@/plugins/servises/StructureItem";
import {Base} from "@/plugins/servises/Base";

export class Post extends StructureItem {

  static create(data, silent = false) {
    const method = 'posts/create'
    const message = 'Должность создана'

    return super.create(data, method, message, silent)
  }

  static update(data, silent = false) {
    const method = 'posts/update'
    const message = 'Должность обновлена'

    return super.update(data, method, message, silent)
  }

  static delete(id, silent = false) {
    const method = 'posts/delete'
    const message = 'Должность удалена'

    return super.delete(id, method, message, silent)
  }

  static getAll() {
    return super.getAll('posts/get')
  }

  static getTitle(id) {
    return super.getTitle(id, Post.getAll())
  }

  static schema = {
    id: '',
    title: ''
  }

  static normalize(...args) {
    return Base.normalize(Post.schema, args);
  }
}