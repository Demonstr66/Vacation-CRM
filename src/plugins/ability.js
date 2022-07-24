import {defineAbility, defineAbilityFor} from '@casl/ability';

export default defineAbility((can, cannot) => {
  cannot('create', 'User')
  can('read', 'User')
  can('update', 'User')
  cannot('delete', 'User')

  cannot('create', 'Team')
  can('read', 'Team')
  cannot('update', 'Team')
  cannot('delete', 'Team')

  cannot('create', 'Task')
  can('read', 'Task')
  cannot('update', 'Task')
  cannot('delete', 'Task')

  cannot('create', 'Post')
  can('read', 'Post')
  cannot('update', 'Post')
  cannot('delete', 'Post')

  cannot('create', 'Schedule')
  can('read', 'Schedule')
  cannot('update', 'Schedule')
  cannot('delete', 'Schedule')

  can('create', 'Vacation')
  can('read', 'Vacation')
  cannot('delete', 'Vacation')
  cannot('update', 'Vacation')
});
