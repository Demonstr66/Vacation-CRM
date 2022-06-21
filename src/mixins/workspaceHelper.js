import {messageHelper} from "@/mixins/messageHelper";
import {defUser} from "../plugins/schema.js";
import {dataMethods} from "@/mixins/dataHelper";
import {dispatchMethods} from "@/mixins/BaseMethods";
import {WID} from "@/mixins/ComputedData";

const short = require("short-uuid");

export const taskMethods = {
  mixins: [messageHelper, dispatchMethods],
  methods: {
    saveTask(isNew, data) {
      const method = isNew ? "tasks/create" : 'tasks/update';

      return this.dispatchSaveData({
        method,
        isNew,
        data,
        msg: isNew ? 'Задача добавлена' : 'Задача обновлена'
      })
    },
    deleteTask(id) {
      return this.dispatchMethod({
        method: 'tasks/delete',
        data: id
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'users/deleteTaskFromUsers',
            data: id
          })
        })
        .then((res) => {
          this.successMessage('Задача удалена')
        })
        .catch((err) => {
          this.errorMessage(err)
        })
    }
  }
}

export const teamMethods = {
  mixins: [messageHelper, dispatchMethods],
  methods: {
    saveTeam(isNew, data) {
      const method = isNew ? "teams/create" : 'teams/update';

      return this.dispatchSaveData({
        method,
        isNew,
        data,
        msg: isNew ? 'Команда добавлена' : 'Команда обновлена'
      })
    },
    silentSaveTeam(isNew, data) {
      const method = isNew ? "teams/create" : 'teams/update';

      return this.dispatchMethod({
        method,
        data
      })
    },
    deleteTeam(id) {
      return this.dispatchMethod({
        method: 'teams/delete',
        data: id
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'users/deleteTeamFromUsers',
            data: id
          })
        })
        .then((res) => {
          this.successMessage('Команда удалена')
        })
        .catch((err) => {
          this.errorMessage(err)
        })
    }
  }
}

export const postMethods = {
  mixins: [messageHelper, dispatchMethods],
  methods: {
    savePost(isNew, data) {
      const method = isNew ? "posts/create" : 'posts/update';

      return this.dispatchSaveData({
        method,
        isNew,
        data,
        msg: isNew ? 'Должность добавлена' : 'Должность обновлена'
      })
    },
    deletePost(id) {
      return this.dispatchMethod({
        method: 'posts/delete',
        data: id
      })
        .then((res) => {
          return this.dispatchMethod({
            method: 'users/deletePostFromUsers',
            data: id
          })
        })
        .then((res) => {
          this.successMessage('Должность удалена')
        })
        .catch((err) => {
          this.errorMessage(err)
        })
    }
  }
}

export const userData = {
  mixins: [dataMethods, dispatchMethods, WID],
  methods: {
    saveUser(isNew, user) {
      const method = isNew ? "users/create" : "users/update"

      return this.dispatchSaveData({
        method,
        isNew,
        data: user
      })
    },
    moveUserToArchive(uid) {
      return this.dispatchMethodWithMessage({
        method: 'users/moveUserToArchive',
        data: uid,
        msg: "Пользователь перемещён в архив"
      })
    },
    restoreUserFromArchive(uid) {
      return this.dispatchMethodWithMessage({
        method: 'users/restoreUser',
        data: uid,
        msg: "Пользователь восстановлен"
      })
    },
    deleteUser(uid) {
      return this.mixDeleteData({
        method: 'users/delete',
        data: uid,
        msg: "Пользователь удалён"
      })
    },
    mixSetTeamLeader({uid, teamId}) {
      return this.mixSaveData({
        saveMethod: 'workspace/setTeamLeader',
        isNew: false,
        data: {uid, teamId}
      })
    },
    mixSetTeamTempLeader({uid, data}) {
      data.map(teamId => {
        this.mixSaveData({
          saveMethod: 'workspace/setTempTeamLeader',
          isNew: false,
          data: {uid, teamId}
        })
      })
    }
  }
}

export const workspaceMethods = {
  mixins: [dataMethods, messageHelper],
  methods: {
    mixSaveWorkspace(isNew, data) {
      const saveMethod = isNew ? '' : "workspace/update";

      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixUploadFile(file) {
      return this.mixSaveData({saveMethod: 'templateFile/upload', isNew: true, data: file})
        .then(() => this.$store.dispatch('templateFile/get'))
    },
    mixDownloadFile(file) {
      return this.$store.dispatch('templateFile/download', file)
        .catch(err => {
          this.mixError(err)
        })
    },
    mixDeleteFile(file) {
      return this.mixDeleteData({
        delMethod: 'templateFile/delete', id: file.fullPath, msg: 'Файл' +
          ' удалён'
      })
        .then(() => this.$store.dispatch('templateFile/get'))
    }
  }
}

export const vacationMethods = {
  mixins: [dataMethods],
  methods: {
    mixSaveVacation(isNew, data) {
      let saveMethod = isNew ? "vacations/create" : 'vacations/update';
      console.log('mixSaveVacation', data)
      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixDeleteVacation(vacation) {
      let delMethod = "vacations/delete";

      return this.mixDeleteData({delMethod, id: vacation})
    }
  }
}


