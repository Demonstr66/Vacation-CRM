import {AbilityBuilder} from "@casl/ability";

function defineRulesForOwner(user, privacy) {
  const {can, cannot, rules} = new AbilityBuilder();

  can('manage', 'all')

  return rules
}

function defineRulesForAdmin(user, privacy) {
  const {can, cannot, rules} = new AbilityBuilder()
  const {manageUsers, manageVacations, manageWS} = privacy['admins']

  can('read', 'all')

  can(manageUsers, 'User')
  can('manage', 'User', {uid: user.uid})

  if (manageVacations) {
    can('manage', 'Vacation', {team: user.team})
  } else {
    can('manage', 'Vacation', {uid: user.uid})
  }

  if (manageWS) {
    can('manage', 'Workspace', {id: user.workspace})
  }

  return rules
}

function defineRulesForLeader(user, privacy) {
  const {can, cannot, rules} = new AbilityBuilder()
  const {manageUsers, manageVacations, manageWS, visibility} = privacy['leaders']

  can('read', 'all')

  can(manageUsers, 'User')
  can('manage', 'User', {uid: user.uid})

  if (manageVacations) {
    can('manage', 'Vacation', {team: user.team})
  } else {
    can('manage', 'Vacation', {uid: user.uid})
  }

  if (manageWS) {
    can('manage', 'Workspace', {id: user.workspace})
  }

  return rules

}

function defineRulesForUser(user, privacy) {
  const {can, cannot, rules} = new AbilityBuilder()
  const {manageUsers, manageVacations, manageWS} = privacy['users']

  can('read', 'all')

  can(manageUsers, 'User')
  // can('manage', 'User', {uid: user.uid})

  if (manageVacations && manageVacations.length) {
    can('manage', 'Vacation', {team: user.team})
  } else {
    cannot('manage', 'Vacation')
    can('manage', 'Vacation', {uid: user.uid})
  }

  if (manageWS) {
    can('manage', 'Workspace', {id: user.workspace})
  }

  cannot('mange', 'Task')
  cannot('mange', 'Post')
  cannot('mange', 'Team')

  return rules

}

export default function defineAbilitiesFor(user, privacy) {
  const {can, cannot, rules} = new AbilityBuilder();
  const opt = JSON.parse(privacy)
  console.log(opt)
  if (!user) {
    cannot('manage', 'all')
  }

  switch (user.role) {
    case "owner":
      return defineRulesForOwner(user, opt);

    // case "owner": return defineRulesForOwner(user, opt);
    case "admin":
      return defineRulesForOwner(user, opt);
    case "leader":
      return defineRulesForOwner(user, opt);
    case "user":
      return defineRulesForOwner(user, opt);
  }

  // if (user.active) {cannot('create', 'User')
  //   can('read', 'User')
  //   can('update', 'User')
  //   cannot('delete', 'User')
  //
  //   cannot('create', 'Team')
  //   can('read', 'Team')
  //   cannot('update', 'Team')
  //   cannot('delete', 'Team')
  //
  //   cannot('create', 'Task')
  //   can('read', 'Task')
  //   cannot('update', 'Task')
  //   cannot('delete', 'Task')
  //
  //   cannot('create', 'Post')
  //   can('read', 'Post')
  //   cannot('update', 'Post')
  //   cannot('delete', 'Post')
  //
  //   cannot('create', 'Schedule')
  //   can('read', 'Schedule')
  //   cannot('update', 'Schedule')
  //   cannot('delete', 'Schedule')
  //
  //   can('create', 'Vacation')
  //   can('read', 'Vacation')
  //   cannot('delete', 'Vacation')
  //   cannot('update', 'Vacation')
  // }

};