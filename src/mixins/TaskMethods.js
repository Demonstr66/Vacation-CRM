import {dispatchMethods} from "@/mixins/BaseMethods";

export const TaskMethods = {
  mixins: [dispatchMethods], methods: {
    createTask(data) {
        return this.dispatchSaveData({
          method: "tasks/create",
          isNew: true,
          data,
          msg: 'Задача добавлена'
        })
    },
    updateTask(data) {
      return this.dispatchSaveData({
        method: 'tasks/update',
        isNew: false,
        data,
        msg: 'Задача обновлена'
      })
    },
    deleteTask(id) {
      return this.dispatchAllMethodsWithMessage({
        tasks: [
          {method: 'tasks/delete', data: id},
          {method: 'users/deleteTaskFromUsers', data: id}
        ],
        msg: 'Задача удалена'
      })
    }
  }
}