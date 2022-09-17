import {StructureItem} from "@/plugins/servises/StructureItem";
import {Base} from "@/plugins/servises/Base";
import {User} from "@/plugins/servises/User";

export class Team extends StructureItem {

  static create(data, silent = false) {
    const method = 'teams/create'
    const message = 'Команда создана'

    return super.create(data, method, message, silent)
  }

  static update(data, silent = false) {
    const method = 'teams/update'
    const message = 'Команда обновлена'

    return super.update(data, method, message, silent)
  }

  static delete(id, deleteChildren) {
    const method = 'teams/delete'
    const message = deleteChildren ? 'Команды удалены' : 'Команда удалена'
    const teamIndexes = Team.getTeamChildren(id)

    if (deleteChildren) {
      teamIndexes.map(id => super.delete(id, method, '', true))
      super.delete(id, method, message, false)
    } else {
      const teams = Team.getAll()
      const currentTeam = teams.find(t => t.id === id)
      const parent = currentTeam.parent

      teamIndexes.map(tIndex => {
        let team = teams.find(t => t.id === tIndex)
        if (team.parent === id) {
          team.parent = parent
          Team.update(team, true)
        }
      })

      super.delete(id, method, message)
    }
  }

  static getTeamChildren(id) {
    const teams = Team.getAll()

    let children = []
    const f = (parent) => {
      teams.map(team => {
        if (team.parent === parent) {
          children.push(team.id)
          f(team.id)
        }
      })
    }

    f(id)
    return children
  }

  static getAll() {
    return super.getAll('teams/get')
  }

  static getTitle(id) {
    return super.getTitle(id, Team.getAll())
  }

  static schema = {
    id: '',
    title: '',
    leaderId: '',
    parent: ''
  }

  static normalize(...args) {
    return Base.normalize(Team.schema, args);
  }

  static getSubTeams(team) {
    if (!team) return []

    return []
  }

  static getTeamWhereLeader(uid) {
    const teams = Team.getAll()
    return teams.filter(team => team.leaderId === uid).map(team => team.id)
  }
}