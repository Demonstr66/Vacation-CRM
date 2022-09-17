import {excelToArray, groupArrayByHeaders, parseHeaders, parseItems} from "@/plugins/utils";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";
import {User} from "@/plugins/servises/User";
import {Message} from "@/plugins/servises/Message";

export class IImport {

  static users = {
    fields: [{model: 'email', title: 'E-mail', required: true, unique: true}, {
      model: 'fullName', title: 'ФИО', required: true
    }, {model: 'post', title: 'Должность'}, {model: 'team', title: 'Команда'},], upload: (file) => {
      let fields = [], users = [], teams = [], posts = []
      return new Promise((res, rej) => {
        excelToArray(file)
          .then(data => {
            const headers = parseHeaders(data, IImport.users.fields)
            fields = headers
            data.shift()
            return {headers, data}
          })
          .then(({headers, data}) => groupArrayByHeaders(data, headers))
          .then(data => {
            let res = parseItems(data, 'team', Team.getAll())
            teams = res.items
            users = res.users

            res = parseItems(users, 'post', Post.getAll())
            posts = res.items
            users = res.users

            const existUsers = User.getAll()
            users = users.filter(user => existUsers
              .every(existUser => existUser.email !== user.email))

            return data
          })
          .then(() => {
            res({users, teams, posts, fields})
          })
          .catch(err => {
            rej(err)
          })
      })
    }, save: (users, teams, posts) => {
      return new Promise((res, rej) => {
        Promise.all(teams.map(title => Team.create({title}, true)))
          .then((keys) => {
            users = users.map(user => {
              if (!user.team) return user
              let teamIndex = teams.findIndex(team => team === user.team)
              if (teamIndex !== -1) {
                user.team = keys[teamIndex]
              }
              return user
            })
          })
          .then(() => {
            return Promise.all(posts.map(title => Post.create({title}, true)))
          })
          .then((keys) => {
            users = users.map(user => {
              if (!user.post) return user
              let postIndex = posts.findIndex(post => post === user.post)
              if (postIndex !== -1) {
                user.post = keys[postIndex]
              }
              return user
            })
          })
          .then(() => {
            return Promise.all(users.map(data => {
              const user = new User(data)
              return user.create(true)
            }))
          })
          .then(() => {
            Message.successMessage('Данные импортированы')
            res()
          })
          .catch((err) => {
            Message.errorMessage(err)
            rej(err)
          })
      })
    }
  }
}