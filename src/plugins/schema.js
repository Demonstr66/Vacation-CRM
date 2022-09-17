import {dateToFileFormat} from "@/plugins/utils";

const moment = require('moment')


export const templateFileData = {
  fullName: {test: 'Иванов Иван Иванович', description: '', title: 'ФИО'},
  post: {test: 'Менеджер по продажам', description: '', title: 'Должность'},
  date: {test: () => dateToFileFormat(moment()), description: '', title: 'Дата подписания'},
  start: {
    test: () => dateToFileFormat(moment().add(5, 'days')),
    description: '',
    title: 'Дата начала отпуска'
  },
  finish: {
    test: () => dateToFileFormat(moment().add(10, 'days')),
    description: '',
    title: 'Дата конца отпуска'
  },
  days: {test: '6', description: '', title: 'Дней отпуска'},
}

export function defWorkspace(...data) {
  let res = {
    id: '',
    title: '',
    domain: '',
    owner: '',
    privacy: '',
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

export function dataToGenerateFile(...data) {
  let res = {
    fullName: '',
    post: '',
    date: '',
    start: '',
    finish: '',
    days: '',
  }


  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }

  if (!!res.start) res.start = dateToFileFormat(res.start)
  if (!!res.finish) res.finish = dateToFileFormat(res.finish)
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
