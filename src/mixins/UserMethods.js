import {dispatchMethods} from "@/mixins/BaseMethods";

export const UserMethods = {
  mixins: [dispatchMethods],
  methods: {
    createUser(data) {
      return this.dispatchSaveData({
        method: "users/create",
        isNew: true,
        data
      })
    },
    updateUser(data) {
      return this.dispatchSaveData({
        method: "users/update",
        isNew: false,
        data
      })
    },
    silentUpdateUser(data) {
      return this.dispatchMethod({
        method: "users/update",
        data
      })
    },
    deleteUser(uid) {
      return this.dispatchDeleteData({
        method: 'users/delete',
        data: uid,
        msg: "Пользователь удалён"
      })
    },


    archiveUser(uid) {
      return this.dispatchMethodWithMessage({
        method: 'users/moveUserToArchive',
        data: uid,
        msg: "Пользователь перемещён в архив"
      })
    },
    restoreUser(uid) {
      return this.dispatchMethodWithMessage({
        method: 'users/restoreUser',
        data: uid,
        msg: "Пользователь восстановлен"
      })
    },
  }
}