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
      console.log('exstArr: ', existArray)
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
        console.log('arrOfExistColValues', arrOfExistColValues)
        if (!arrOfExistColValues.length) continue
        console.log('preFilter')
        items = items.filter(item => arrOfExistColValues.indexOf(item[col.model]) == -1)
        console.log('afterFilter', items)
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
        let team = teams.find(t => normalize(t.title) == titleTeam)

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
        let post = posts.find(t => normalize(t.title) == titlePost)

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
