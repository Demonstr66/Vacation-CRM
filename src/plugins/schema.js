import {dateToFileFormat} from "@/plugins/utils";
const moment = require('moment')

export function defUser(...data) {
  let res = {
    uid: '',
    email: '',
    emailVerified: false,
    displayName: '',
    fullName: '',
    templateName: '',
    post: null,
    tasks: [],
    team: null,
    workspace: '',
    role: 'user',
    active: false,
    archive: false
  }
  //roles 'currentUser' < 'leader' < 'admin' < 'owner'


  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export const templateFileData = {
  fullName: { test: 'Иванов Иван Иванович', description: '', title: 'ФИО'},
  post: { test: 'Менеджер по продажам', description: '' , title: 'Должность'},
  date: { test: () => dateToFileFormat(moment()), description: '' , title: 'Дата подписания'},
  start: { test: () => dateToFileFormat(moment().add(5, 'days')), description: '' , title: 'Дата начала отпуска'},
  finish: { test: () => dateToFileFormat(moment().add(10, 'days')), description: '' , title: 'Дата конца отпуска'},
  days: { test: '6', description: '' , title: 'Дней отпуска'},
}

export function defWorkspace(...data) {
  let res = {
    id: '',
    title: '',
    domain: '',
    owner: '',
    tasks: [],
    posts: [],
    teams: []
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defSchedule(...data) {
  let res = {
    id: '',
    title: '',
    startDate: '',
    endDate: '',
    year: '',
    isActive: false,
    activation: {
      timestamp: null,
      by: null
    },
    exception: []
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defTask(...data) {
  let res = {
    id: '',
    title: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defPost(...data) {
  let res = {
    id: '',
    title: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defTeam(...data) {
  let res = {
    id: '',
    title: '',
    leaderId: '',
    parent: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defVacation(...data) {
  let res = {
    id: '',
    uid: '',
    sid: '',
    //True - если отпуск фактический, и не совпадает с заявлением
    actually: false,
    start: null,
    end: null,
    days: 0,
    approved: false,
    createdAt: null,

    //[0: draft, 1: requireApproval, 2: approved, 3: rejected]
    status: 0,
    statusChangeByUid: null,
    statusChangeAt: null,
    comment: null,
    history: null,
    isCurrent: true
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function dataToGenerateFile(...data) {
  let res = {
    fullName: '',
    post: '',
    date: '',
    vstart: '',
    vend: '',
    vdays: '',
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }

  if (!!res.vstart) res.vstart = dateToFileFormat(res.vstart)
  if (!!res.vend) res.vend = dateToFileFormat(res.vend)
  if (!!res.date) res.date = dateToFileFormat(res.date)

  return res
}

export function updateObject(obj1, obj2) {
  let obj = {}
  for (let item in obj1) {
    obj[item] = obj1[item]
    if (obj2[item] !== undefined) obj[item] = obj2[item]
  }
  return obj
}
