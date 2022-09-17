import {Base} from "@/plugins/servises/Base";
import store from "@/store";
import {Roles} from "@/plugins/servises/Roles";
import {Team} from "@/plugins/servises/Team";

const moment = require('moment')

export class User extends Base {
  static statuses = {
    0: {id: 0, label: 'Создан', color: 'secondary', icon: 'mdi-pencil', private: true},
    1: {id: 1, label: 'Письмо отправлено', color: 'warning', icon: 'mdi-help'},
    2: {id: 2, label: 'Зарегистрирован', color: 'success', icon: 'mdi-check'},
    3: {id: 3, label: 'Заблокирован', color: 'success', icon: 'mdi-check'},
  }
  static schema = {
    uid: '',
    email: '',
    emailVerified: false,
    active: false,
    status: 0,
    role: 'user',
    disabled: false,

    lastVisitAt: "",

    fullName: '',
    displayName: '',

    workspace: '',
    post: '',
    tasks: '',
    team: '',

    events: '',
  }
  Task = {
    add: (id, silent = false) => {
      if (this.tasks && this.tasks.includes(id)) return
      if (!this.tasks) this.tasks = []

      this.tasks.push(id)
      this.update({type: 'addTask'}, silent, 'Задача назначена')
    },
    remove: (id, silent = false) => {
      if (!this.tasks || !this.tasks.includes(id)) return

      this.tasks = this.tasks.filter(task => task !== id)

      this.update({type: 'removeTask'}, silent, 'Задача снята')
    }
  }

  constructor(args) {
    super({
      save: 'users/update',
      delete: 'users/delete',
      create: 'users/create',
    })

    Object.assign(this, User.schema, args)
  }

  static get modelName() {
    return 'User'
  }

  static determinateLeaders() {
    const teams = Object.values(Team.getAll())
    let leaders = teams
      .map(team => team.leaderId)
      .filter(id => !!id)

    const leaderId = Roles.getRoleId('leader')
    const userId = Roles.getRoleId('user')

    const users = User.getAll()
    users.forEach(user => {
      const roleId = Roles.getRoleId(user.role)
      if (roleId <= leaderId) {
        const currentRoleId = leaders.includes(user.uid) ? leaderId : userId
        if (currentRoleId !== roleId) {
          user.setRole(Roles.getRoleType(currentRoleId))
        }
      }
    })
  }

  static normalize(...args) {
    return Base.normalize(User.schema, args);
  }

  static getAll() {
    //<Array>
    return Object.values(store.getters['users/get'])
  }

  // sendToApprove() {
  //   return this.setStatus(1, {type: 'sendToApprove'})
  // }
  //
  // approve() {
  //   return this.setStatus(2, {type: 'approved'})
  // }
  //
  // reject(comment) {
  //   return this.setStatus(99, {type: 'reject', comment})
  // }
  //
  // cancel(comment) {
  //   return this.setStatus(1, {type: 'cancel', comment})
  // }
  //
  // cancelSend() {
  //   return this.setStatus(0, {type: 'cancelApproval'})
  // }


  // setStatus(statusId, event) {
  //   this.status = statusId
  //   this.approved = statusId === 2
  //   return this.update(event)
  // }

  static fullToShortName(fullName) {
    return fullName
      .split(/\s+/)
      .map((w, i) => (i ? w.substring(0, 1).toUpperCase() + "." : w))
      .join(" ");
  }

  setRole(role) {
    this.role = role
    this.update({}, true)
  }

  create(silent = false) {
    const {team, post, tasks, fullName, role} = this

    if (!this.displayName) this.displayName = User.fullToShortName(this.fullName)

    return super.create(this, {team, post, tasks, fullName, role}, 'Пользователь создан', silent);
  }

  update(event = {}, silent = false, message = 'Данные пользователя обновлены') {
    const {team, post, tasks, fullName, role} = this

    Object.assign(event, {team, post, tasks, fullName, role})

    return super.update(this, event, message, silent);
  }

  delete() {
    return super.delete(this.uid, 'Пользователь удалён')
  }

}