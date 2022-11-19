import axios from "axios";

const prod = true
const server = prod ? 'https://crm.tgtransfer.ru' : 'http://localhost:3000'

export const api = {
  user: {
    create: (data) => {
      return axios.post(server + '/api/account/create', data)
      // .then((res) => {
      //   console.log(res)
      //   console.log(res.data)
      //   Message.successMessage({code: 'auth/user-created'})
      // })
      // .catch((err) => {
      //   console.log(err.response)
      //   let code = err.response.data
      //   let message = err.response.data.message
      //   Message.errorMessage({code, message})
      // })
    },
    delete: (uid) => {
      return axios.delete(server + '/api/account/delete', {
        params: {
          uid
        }
      })
      // .then((res) => {
      //   console.log(res)
      //   console.log(res.data)
      //   Message.successMessage({code: 'auth/user-deleted'})
      // })
      // .catch((err) => {
      //   console.log(err.response)
      //   let code = err.response.data
      //   let message = err.response.data.message
      //   Message.errorMessage({code, message})
      // })
    },
    invite: (uid) => {
      return axios.get(server + '/api/message/invite', {
        params: {
          uid
        }
      })
    },
  },
  file: {
    download: (fullPath, fullName, post, start, finish, days, date) => {
      return axios({
        method: 'get', url: server + '/api/download', responseType: 'blob', params: {
          fullPath, fullName, post, start, finish, days, date
        }
      })

      // return axios.get(server + '/api/download', {
      //     responseType: 'blob', params: {
      //       fullPath, post, start, finish, days, date
      //     }
      //   }
      // )
    },

    downloadOrigin: (fullPath) => {
      return axios({
        method: 'get', url: server + '/api/download/origin', responseType: 'blob', params: {
          fullPath
        }
      })

      // return axios.get(server + '/api/download', {
      //     responseType: 'blob', params: {
      //       fullPath, post, start, finish, days, date
      //     }
      //   }
      // )
    }
  }
}