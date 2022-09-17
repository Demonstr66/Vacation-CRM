import {Base} from "@/plugins/servises/Base";

export class Schedule extends Base {
  static statuses = {
    0: {label: 'Черновик', color: 'secondary', icon: 'mdi-pencil'},
    1: {label: 'На заполнении', color: 'warning', icon: 'mdi-help'},
    2: {label: 'Утверждено', color: 'success', icon: 'mdi-check'},
  }
  static schema = {
    id: '',
    title: '',
    startDate: '',
    endDate: '',
    year: '',
    status: 0,
    exception: '',
    events: '',
    isDraft: false,
    isActive: false,
    isApprove: false
  }

  constructor(args) {
    super({
      save: 'schedules/update', delete: 'schedules/delete', create: 'schedules/create',
    })

    Object.assign(this, Schedule.schema, args)

    this.isDraft = this.status === 0
    this.isActive = this.status === 1
    this.isApprove = this.status === 2

  }

  static normalize(...args) {
    return Base.normalize(Schedule.schema, args);
  }

  // isDraft() {
  //   return this.status === 0
  // }
  //
  // isActive() {
  //   return this.status === 1
  // }
  //
  // isApproved() {
  //   return this.status === 2
  // }

  activate() {
    return this.setStatus(1, {type: 'sendToFill'})
  }

  deactivate(comment = '') {
    return this.setStatus(0, {type: 'cancel', comment})
  }

  approve() {
    return this.setStatus(2, {type: 'activate'})
  }

  cancel() {
    return this.setStatus(1, {type: 'deactivate'})
  }


  setStatus(statusId, event) {
    return this.update(event, {status: statusId})
  }

  create(data) {
    const {year} = this
    let event = {type: 'create'}
    event.year = year
    let currentItem = Schedule.normalize(this)

    if (data !== undefined) {
      Object.assign(currentItem, data)
    }

    return super.create(currentItem, event);
  }

  update(event, data) {
    const {year} = this

    event.year = year

    let currentItem = Schedule.normalize(this)

    if (data !== undefined) {
      Object.assign(currentItem, data)
    }

    return super.update(currentItem, event);
  }

  delete() {
    return super.delete({id: this.id})
  }


}