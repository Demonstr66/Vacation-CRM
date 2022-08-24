import {defPost, defTeam} from "@/plugins/schema";
import * as XLSX from "xlsx/xlsx.mjs";
import shortUUID from "short-uuid";

const moment = require('moment')

export function dateDiff(start, end) {
  return moment(end).diff(moment(start), 'days') + 1
}

export function normalize(str) {
  return str.trim().replace(/\s\s+/g, ' ').toLowerCase()
}

export function createTeam(title) {
  return defTeam({title, id: shortUUID().new()})
}

export function createPost(title) {
  return defPost({title, id: shortUUID().new()})
}

export const dictionary = {
  "auth/user-not-found": "Пользователь с такими данными не найден",
  "auth/wrong-password": "Пользователь с такими данными не найден",
  "auth/email-already-in-use": "Пользователь с таким email существует",
  "auth/too-many-requests": "Слишком рано, попробуйте позднее",
  "auth/operation-not-allowed": "Операция не разрешена. Попробуйсте другой email",
  "auth/weak-password": "Используйте более надёжный пароль",
  "auth/user-disabled": "Ваш аккаунт заблокирован",
  "auth/invalid-email": "Некорректный email",
  "auth/email-not-verify": "Email не подтверждён",
  "email_confirm": "Email подтверждён",
  "auth/network-request-failed": "Проверьте подключение к сети"
}

export function fullToDisplayName(fio) {
  return fio
    .split(/\s+/)
    .map((w, i) => (i ? w.substring(0, 1).toUpperCase() + "." : w))
    .join(" ");
}

export function excelToArray(file) {
  return new Promise((res, rej) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {type: "binary"});
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {header: 1});
        res(data.filter(d => !d.every(x => x == undefined)))
      };

      reader.readAsBinaryString(file)
    } catch (e) {
      rej(e)
    }
  })
}

export function parseArrayData(data, fields, existArray) {
  return new Promise((res, rej) => {
    try {

      let findingHeaders = data.shift().map(x => normalize('' + x))
      let cols = {}

      for (let id in fields) {
        let field = fields[id]
        let req = !!field.required

        let colIndex = findingHeaders.findIndex(header => header == field.model.toLowerCase())

        if (colIndex == -1 && req) throw new Error('Отсутсвуют обязательные поля')

        if (colIndex == -1) continue

        cols[colIndex] = {...field}
      }

      let items = data.map(d => {
        let item = {}
        for (let id in cols) {
          let col = cols[id]
          item[col.model] = d[id]
          if (col.required && !!!d[id]) throw new Error('В некоторых строках пропущены' +
            ' обязательные поля')
        }
        return item
      })

      for (let id in cols) {
        let col = cols[id]
        if (!!!col.uniq) continue

        const arrOfColValues = items.map(item => item[col.model])
        const setOfColValues = new Set(arrOfColValues)

        if (arrOfColValues.length !== setOfColValues.size) throw new Error(`Поле "${col.title}" должно быть уникальным!`)

        const arrOfExistColValues = existArray.map(item => item[col.model])

        if (!arrOfExistColValues.length) continue

        items = items.filter(item => arrOfExistColValues.indexOf(item[col.model]) == -1)
      }


      cols = Object.values(cols)
      res({items, cols})

    } catch (e) {
      rej(e)
    }
  })
}

export function parseTeamsInArray(data, teams) {
  return new Promise((res, rej) => {
    try {
      let newTeams = []

      const users = data.map(d => {
        if (!d.team) return d

        const titleTeam = normalize(d.team)
        let team = Object.values(teams).find(t => normalize(t.title) == titleTeam)

        if (!team) team = newTeams.find(t => normalize(t.title) == titleTeam)

        if (!team) {
          team = createTeam(titleTeam)
          newTeams.push({...team})
        }
        d.team = team.id

        return d
      })

      res({users, newTeams})
    } catch (e) {
      rej(e)
    }
  })
}

export function parsePostsInArray(data, posts) {
  return new Promise((res, rej) => {
    try {
      let newPosts = []

      const users = data.map(d => {
        if (!d.post) return d

        const titlePost = normalize(d.post)
        let post = Object.values(posts).find(t => normalize(t.title) == titlePost)

        if (!post) post = newPosts.find(t => normalize(t.title) == titlePost)

        if (!post) {
          post = createPost(titlePost)
          newPosts.push({...post})
        }
        d.post = post.id

        return d
      })

      res({users, newPosts})
    } catch (e) {
      rej(e)
    }
  })
}

export function isprXML(xmlfile) {
  // //почистить шаблон до правильного вида переменных {permennaya}
  var re = /({.*?})/sg;
  var re2 = /(<.*?>)/g;
  let result = xmlfile.match(re) || [];

  result.forEach(element => {
    var newel = element.replace(re2, "");
    xmlfile = xmlfile.replace(element, newel);
  });
  return xmlfile;
}

export function basePathFunction(base) {
  return function (wid, ...child) {
    let path = base.replaceAll('{wid}', wid)
    if (child.length) path += '/' + child.join('/')
    return path
  }
}

export function isUnique(item, items, key = 'title', uniqKey = 'id') {
  return !items.some(i => i[key] === item[key] && i[uniqKey] !== item[uniqKey])
}

export function generateTestDataForTemplate() {

}

export function dateToFileFormat(val, format = '"DD" piping YYYYг.') {
  //форматирвоание даты для заявления
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',]
  const date = moment(val)
  const month = date.get('month')
  return date.format(format).replace('piping', months[month])
}

export async function asyncTryDecorator(callback) {
  try {
    return await callback()
  } catch (e) {
    return Promise.reject(e)
  }
}


export async function loadDisDates(year) {
  return new Promise(async (res, rej) => {
    try {
      const api = require('isdayoff')()
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      const stateDays = await api.period({
        start: new Date(startDate),
        end: new Date(endDate)
      })

      let exceptions = []

      let day = moment(new Date(startDate))
      stateDays.map((state) => {
        let type
        if (!!state && day.weekday() !== 5 && day.weekday() !== 6)
          type = 'holiday'

        if (!!!state && (day.weekday() === 5 || day.weekday() === 6))
          type = 'workday'

        if (!!type) exceptions.push({
          type,
          date: moment(day).format('YYYY-MM-DD')
        })

        day.add(1, 'days')
      })

      res(exceptions)
    } catch (e) {
      rej([])
    }
  })
}


export function sortDateAsc(a, b) {
  return a.start > b.start ? 1 : -1
}

export function mergeEvents(events) {
  if (!events || !events.length) return []

  let allDaysInEvents = {}
  events.map(e => {
    let day = moment(e.start)
    const end = moment(e.end)

    while (day <= end) {
      const key = day.format('YYYY-MM-DD')
      if (!allDaysInEvents[key]) allDaysInEvents[key] = {total: 0, vacations: []}
      allDaysInEvents[key].total += 1
      allDaysInEvents[key].vacations.push(e.id)

      day.add(1, 'days')
    }
  })

  const sortDays = Object.keys(allDaysInEvents).sort()

  let mergeEvents = []
  let start, end, curr, currDays

  sortDays.map(day => {
    if (start) {
      if (curr.format('YYYY-MM-DD') == day) {
        end = day
        currDays.push(allDaysInEvents[day])
        curr.add(1, 'days')
        return
      }
      mergeEvents.push({start, end, days: currDays})
      curr = undefined
      start = undefined
      end = undefined
    }

    if (!start) {
      start = day
      end = day
      currDays = []
      currDays.push(allDaysInEvents[day])
      curr = moment(day)
      curr.add(1, 'days')
      return
    }
  })

  mergeEvents.push({start, end, days: currDays})

  return mergeEvents
}

export function convertUsersToTree(users, groupBy, headers, hideEmptyGroups) {
  if (!headers) return users

  const key = getKey(groupBy)
  let tree = [...headers]

  tree = tree.map(node => {
    let children = users.filter(v => v.user[key] && v.user[key].indexOf(node.id) !== -1)
    let events = []
    node.children = children.map(c => {
      c.title = c.user.displayName;
      c.events = c.events.sort(sortDateAsc)
      c.groupId = node.id

      events.push(...c.events)
      return {...c}
    })

    node.isHeader = true
    node.events = events
    node.events = mergeEvents(node.events)
    return node
  })
  return tree
}

export function getKey(groupBy) {
  switch (groupBy) {
    case 'tasks':
      return 'tasks'
    case 'teams':
      return 'team'
    case 'posts':
      return 'post'
  }
}

export function getCalendarAttributes({holidays, workdays, currentUserVacations, usersVacations, levels, isActually}) {
  const uid = this.uid
  const user = {...this.$store.getters['users/getUserById'](uid)}
  let exceptionAttr = [
    {
      key: 'weekends',
      dates: {
        weekdays: [1, 7]
      }
    },
    {
      key: 'holidays',
      dates: holidays.map(d => new Date(d.date))
    },
    {
      key: 'workdays',
      dates: workdays.map(d => new Date(d.date))
    },
  ]


  let normalizedUsersVacations = usersVacations.map(v => {
    v.lvl = []

    const vacationOwner = this.$store.getters['users/getUserById'](v.uid)
    v.displayName = vacationOwner.displayName


    if (!!vacationOwner.team && vacationOwner.team === user.team)
      v.lvl.push(this.levels.find(lvl => lvl.key === 'team')['id'])

    if (!user.tasks || user.tasks.length === 0) return v
    if (!vacationOwner.tasks || vacationOwner.tasks.length === 0) return v

    v.tasks = []
    user.tasks.map(taskId => {
      const task = vacationOwner.tasks.find(t => t == taskId)
      if (!task) return

      v.lvl.push(this.levels.find(lvl => lvl.key === 'task')['id'])
      v.tasks.push(
        this.$store.getters['tasks/getTitle'](taskId)
      )
    })

    return v
  }).filter(v => v.lvl.length !== 0)

  let normalizedLevels = this.levels.map(level => {
    level.dates = []
    const temp = normalizedUsersVacations.filter(v => v.lvl.some(lvl => lvl === level.id))
    temp.map(v => level.dates.push({start: new Date(v.start), end: new Date(v.end)}))
    return level
  })

  this.attributes = [
    //Отпуска коллег
    ...normalizedLevels.map(({id, dates}) => ({
      key: `vacation-${id}`,
      dates: dates,
    })),

    //Мои отпуска
    ...this.currentUserVacations
      .filter(v => v.actually === isActually)
      .map(v => {
        return {
          key: `currentUserVacation-${v.id}`,
          dates: {
            start: v.start,
            end: v.end
          }
        }
      }),
  ]

  return attributes
}
