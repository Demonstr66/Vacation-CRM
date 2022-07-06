import {dispatchMethods} from "@/mixins/BaseMethods";

export const TeamMethods = {
  mixins: [dispatchMethods],
  methods: {
    createTeam(data) {
      return this.dispatchSaveData({
        method: 'teams/create',
        isNew: true,
        data,
        msg: 'Команда добавлена'
      })
    },
    updateTeam(data) {
      return this.dispatchSaveData({
        method: 'teams/update',
        isNew: false,
        data,
        msg: 'Команда обновлена'
      })
    },
    silentUpdateTeam(data) {
      return this.dispatchMethod({
        method: 'teams/update',
        data
      })
    },
    deleteTeam(id) {
      return this.dispatchAllMethodsWithMessage({
        tasks: [
          {method: 'teams/delete', data: id},
          {method: 'users/deleteTeamFromUsers', data: id}
        ],
        msg: 'Команда удалена'
      })
    }
  }
}