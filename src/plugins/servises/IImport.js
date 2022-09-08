import {excelToArray, groupArrayByHeaders, parseHeaders, parseItems} from "@/plugins/utils";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";
import {User} from "@/plugins/servises/User";
import {Message} from "@/plugins/servises/Message";

export class IImport {

  static users = {
    fields: [{model: 'email', title: 'E-mail', required: true, unique: true}, {
      model: 'fullName',
      title: 'ФИО',
      required: true
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
      let promises = []

      if (posts) posts.map(title => promises.push[Post.create({title}, true)])
      if (teams) teams.map(title => promises.push[Team.create({title}, true)])

      return new Promise((res, rej) => {
        Promise.all(promises)
          .then(() => {
            promises = []
            if (users) users.map(data => {
              let user = new User(data)
              promises.push(user.create(true))
            })

            Promise.all(promises)
              .then(() => {
                Message.successMessage('Данные импортированы')
                res()
              })
              .catch((err) => rej(err))
          })
          .catch((err) => {
            Message.errorMessage(err)
            rej(err)
          })
      })
    }
  }

}