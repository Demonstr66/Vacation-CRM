import {Team} from "@/plugins/servises/Team";
import {AbilityBuilder} from "@casl/ability";

export class Roles {
  static roles = {
    0: {id: 0, type: 'user', text: 'Пользователи'},
    1: {id: 1, type: 'leader', text: 'Лидеры'},
    2: {id: 2, type: 'admin', text: 'Администраторы'},
    3: {id: 3, type: 'owner', text: 'Владелец'},
  }
  static defaultPermissions = {
    0: {
      type: 'user',
      manageWorkspace: false,
      manageStructure: false,
      updateUserRole: false,

      manageUsers: {
        create: false,
        delete: false,
        updateTeam: false,

        update: 'none',
        vacations: 'none',
      },
      manageSchedules: {
        create: false,
        update: false,
        delete: false,
        activate: false,
        deactivate: false,
        approve: false,
        cancel: false,
      },
      manageVacations: {
        cancel: false,
        resolve: 'none',
      }
    },
    1: {
      type: 'leader',
      manageWorkspace: false,
      manageStructure: false,
      updateUserRole: false,

      manageUsers: {
        create: false,
        delete: false,
        updateTeam: false,
        update: 'subTeams',
        vacations: 'subTeams',
      },
      manageSchedules: {
        create: false,
        update: false,
        delete: false,
        activate: false,
        deactivate: false,
        approve: false,
        cancel: false,
      },
      manageVacations: {
        cancel: false,
        resolve: 'subTeams',
      }
    },
    2: {
      type: 'admin',
      manageWorkspace: false,
      manageStructure: true,
      updateUserRole: false,
      manageUsers: {
        create: true,
        delete: true,
        updateTeam: true,
        update: 'all',
        vacations: 'all',
      },
      manageSchedules: {
        create: true,
        update: true,
        delete: true,
        activate: false,
        deactivate: false,
        approve: false,
        cancel: false,
      },
      manageVacations: {
        cancel: false,
        resolve: 'all',
      }
    },
    3: {
      type: 'owner',
      manageWorkspace: true,
      manageStructure: true,
      updateUserRole: true,

      manageUsers: {
        create: true,
        delete: true,
        updateTeam: true,
        update: 'all',
        vacations: 'all',
      },
      manageSchedules: {
        create: true,
        update: true,
        delete: true,
        activate: true,
        deactivate: true,
        approve: true,
        cancel: true,
      },
      manageVacations: {
        cancel: true,
        resolve: 'all',
      }
    },
  }

  static getRoleId(type) {
    const role = Object.values(Roles.roles).find(role => role.type === type)
    return role ? role.id : 0
  }

  static getRoleType(id) {
    const role = Roles.roles[id]
    return role ? role.type : Roles.roles[0].type
  }

  static defineAbilitiesFor(user, permission) {
    // const userRoleType = user.role
    // const userRole = Object.values(Roles.roles).find(role => role.type === userRoleType)
    // const userRoleId = userRole && userRole.id || 0

    // return Roles.#applyRuleToUser(user, rules[userRoleId])
    return Roles.#applyRuleToUser(user, permission)
  }

  static #applyRuleToUser(user, rule) {
    const {can, cannot, rules} = new AbilityBuilder()
    const headOfTeams = Team.getTeamWhereLeader(user.uid) || user.team
    let subTeams = []
    headOfTeams.map(team => {
      subTeams.push(team)
      subTeams.push(...Team.getTeamChildren(team))
    })

    console.log('headOfTeams', headOfTeams)


    cannot('manage', 'all')
    can('read', 'all')

    can(['updatePersonalData', 'manageVacations', 'delete'], 'User', {uid: user.uid})

    if (rule.manageWorkspace) {
      can('manage', 'Workspace')
    }

    if (rule.manageStructure) {
      can('manage', ['Team', 'Post', 'Task'])
    }

    if (rule.updateUserRole) {
      can('updateUserRole', 'User')
      cannot('updateUserRole', 'User', {role: 'owner'})
    }

    if (rule.manageUsers.create) {
      can('create', 'User')
    }
    if (rule.manageUsers.delete) {
      can('delete', 'User')
    }
    if (rule.manageUsers.updateTeam) {
      can('updateTeam', 'User')
    }


    switch (rule.manageUsers.update) {
      case 'all':
        can(['updatePersonalData', 'updateAccountData'], 'User');
        break;
      case 'subTeams':
        subTeams.map(team => {
          can(['updatePersonalData', 'updateAccountData'], 'User', {team})
        });
        break;
      case 'team':
        headOfTeams.map(team => {
          can(['updatePersonalData', 'updateAccountData'], 'User', {team})
        });
        break;
    }

    switch (rule.manageUsers.vacations) {
      case 'all':
        can('manageVacations', 'User');
        break;
      case 'subTeams':
        subTeams.map(team => {
          can('manageVacations', 'User', {team})
        });
        break;
      case 'team':
        can('manageVacations', 'User', {team: user.team});
        headOfTeams.map(team => {
          can('manageVacations', 'User', {team})
        });
        break;
    }


    for (let key in rule.manageSchedules) {
      if (rule.manageSchedules[key]) can(key, 'Schedule')
    }


    if (rule.manageVacations.cancel) {
      can('cancel', 'Vacation')
    }

    switch (rule.manageVacations.resolve) {
      case 'all':
        can(['approve', 'reject'], 'Vacation');
        break;
      case 'subTeams':
        subTeams.map(team => {
          can(['approve', 'reject'], 'Vacation', {team})
        });
        break;
      case 'team':
        headOfTeams.map(team => {
          can(['approve', 'reject'], 'Vacation', {team})
        });
        break;
    }

    return rules
  }
}