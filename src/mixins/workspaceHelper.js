import {messageHelper} from "@/mixins/messageHelper";
import {defUser} from "../plugins/schema.js";
import {dataMethods} from "@/mixins/dataHelper";

const short = require("short-uuid");


const taskMethods = {
  mixins: [dataMethods],
  methods: {
    mixSaveTask(isNew, data) {
      let saveMethod = isNew ? "tasks/create" : 'tasks/update';

      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixDeleteTask(id) {
      let delMethod = "tasks/delete";

      return this.mixDeleteData({delMethod, id})
    }
  }
}

const teamMethods = {
  mixins: [dataMethods],
  methods: {
    mixSaveTeam(isNew, data) {
      let saveMethod = isNew ? "teams/create" : 'teams/update';

      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixDeleteTeam(id) {
      let delMethod = "teams/delete";

      return this.mixDeleteData({delMethod, id})
    }
  }
}

const postMethods = {
  mixins: [dataMethods],
  methods: {
    mixSavePost(isNew, data) {
      let saveMethod = isNew ? "posts/create" : 'posts/update';

      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixDeletePost(id) {
      let delMethod = "posts/delete";

      return this.mixDeleteData({delMethod, id})
    }
  }
}

const userData = {
  mixins: [dataMethods],
  methods: {
    mixSaveUserDataToDb(isNew, user) {
      let saveMethod = isNew ? "users/create" : "users/update";
      let workspace = this.$store.getters["getWID"];
      let uid = isNew ? short().new() : user.uid;
      let data = defUser(user, {uid, workspace});

      return this.mixSaveData({saveMethod, data, isNew})
    },
    mixMoveUserToArchive(uid) {
      return this.mixDeleteData({
        delMethod: 'users/moveUserToArchive',
        id: uid,
        msg: "Пользователь перемещён в архив"
      })
    },
    mixRestoreUserFromArchive(uid) {
      console.log('mixRestoreUserFromArchive')
      return this.mixDeleteData({
        delMethod: 'users/restoreUser',
        id: uid,
        msg: "Пользователь восстановлен"
      })
    },
    mixDeleteUser(uid) {
      return this.mixDeleteData({
        delMethod: 'users/delete',
        id: uid,
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

const workspaceMethods = {
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

const vacationMethods = {
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

export {userData, taskMethods, teamMethods, postMethods, workspaceMethods, vacationMethods}

