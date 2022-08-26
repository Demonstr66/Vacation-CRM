import {Base} from "@/plugins/Base";
import {dataToGenerateFile} from "@/plugins/schema";
import store from "@/store";
import {Vacation} from "@/plugins/Vacation";

const moment = require('moment')

export class Schedule extends Base {
  static statuses = {
    0: {label: 'Черновик', color: 'secondary', icon: 'mdi-pencil'},
    1: {label: 'Доступен для редактирования', color: 'warning', icon: 'mdi-help'},
    2: {label: 'Утверждено', color: 'success', icon: 'mdi-check'},
  }

  id = ''
  title = ''

  startDate = ''
  endDate = ''
  year = ''

  status = 0
  isActive = false

  exception = []
  events = []

  constructor(args) {
    super({
      save: 'schedules/update',
      delete: 'schedules/delete',
      create: 'schedules/create',
    })
    Object.assign(this, args)
  }

  isDraft() {
    return this.status === 0
  }

  sendToFill() {
    return this.setStatus(1, {type: 'sendToFill'})
  }

  cancelFill(comment) {
    return this.setStatus(0, {type: 'cancel', comment})
  }

  activate() {
    return this.setStatus(2, {type: 'activate'})
  }

  deactivate() {
    return this.setStatus(1, {type: 'deactivate'})
  }


  setStatus(statusId, event) {
    this.status = statusId
    this.isActive = statusId === 2
    return this.update(event)
  }

  create() {
    const {year} = this
    let event = {type: 'create'}
    event.year = year

    return super.create(this, event);
  }

  update(event) {
    const {year} = this

    event.year = year

    return super.update(this, event);
  }

  delete() {
    return super.delete({id: this.id})
  }


}