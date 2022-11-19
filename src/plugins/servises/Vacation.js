import {Base} from "@/plugins/servises/Base";
import {dataToGenerateFile} from "@/plugins/schema";
import store from "@/store";
import {api} from "@/plugins/api";
import FileDownload from "js-file-download";

const moment = require('moment')

export class Vacation extends Base {
  static statuses = {
    0: {id: 0, label: 'Черновик', color: 'secondary', icon: 'mdi-pencil', private: true},
    1: {id: 1, label: 'Ожидает утверждения', color: 'warning', icon: 'mdi-help'},
    2: {id: 2, label: 'Утверждено', color: 'success', icon: 'mdi-check'},
    99: {id: 99, label: 'Отклонено', color: 'error', icon: 'mdi-close'},
  }

  static get modelName() {
    return 'Vacation'
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

  isSending() {
    return this.status === 1
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
}