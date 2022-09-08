import {Base} from "@/plugins/servises/Base";
import {dataToGenerateFile} from "@/plugins/schema";
import store from "@/store";

const moment = require('moment')

export class Vacation extends Base {
  static statuses = {
    0: {id: 0, label: 'Черновик', color: 'secondary', icon: 'mdi-pencil', private: true},
    1: {id: 1, label: 'Ожидает подтверждения', color: 'warning', icon: 'mdi-help'},
    2: {id: 2, label: 'Утверждено', color: 'success', icon: 'mdi-check'},
    99: {id: 99, label: 'Отклонено', color: 'error', icon: 'mdi-close'},
  }

  static schema = {
    id: '',
    uid: '',
    sid: '',
    start: null,
    end: null,
    days: 0,
    approved: false,
    status: 0,
    comment: '',
    events: '',
  }

  constructor(args) {
    super({
      save: 'vacations/update',
      delete: 'vacations/delete',
      create: 'vacations/create',
    })

    Object.assign(this, Vacation.schema, args)
  }

  static normalize(...args) {
    return Base.normalize(Vacation.schema, args);
  }

  isDraft() {
    return this.status === 0
  }

  isRejected() {
    return this.status === 99
  }

  sendToApprove() {
    return this.setStatus(1, {type: 'sendToApprove'})
  }

  approve() {
    return this.setStatus(2, {type: 'approved'})
  }

  reject(comment) {
    return this.setStatus(99, {type: 'reject', comment})
  }

  cancel(comment) {
    return this.setStatus(1, {type: 'cancel', comment})
  }

  cancelSend() {
    return this.setStatus(0, {type: 'cancelApproval'})
  }

  setStatus(statusId, event) {
    this.status = statusId
    this.approved = statusId === 2
    return this.update(event)
  }

  create() {
    const {start, end, days} = this
    let event = {}
    event.start = start
    event.end = end
    event.days = days

    return super.create(this, event);
  }

  edit() {
    let status = this.status === 99 ? 0 : this.status
    return this.setStatus(status, {type: 'edit'})
  }

  update(event) {
    const {start, end, days} = this

    event.start = start
    event.end = end
    event.days = days

    return super.update(this, event);
  }

  delete() {
    return super.delete({id: this.id, sid: this.sid})
  }

  downloadApplication() {
    const {start, end, days, uid} = this
    const user = store.getters['users/getUserById'](uid)

    let post
    if (user.post) {
      post = store.getters['posts/getById'](user.post)?.title
    }

    let data = dataToGenerateFile(user, {
      post: post || "", date: moment().format('YYYY-MM-DD'), start: start, finish: end, days: days
    })

    return this.dispatchMethod('templateFile/downloadWithData', {
      fullPath: store.getters['templateFile/get'].fullPath,
      data,
      fileName: 'Заявление на очередной оплачиваемый отпуск ' + store.getters['users/getDisplayNameByUID'](uid)
    })
  }
}