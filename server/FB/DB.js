const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth");

const db = admin.database()
const roles = ['user', 'leader', 'admin', 'owner']

async function getData(path) {
  const ref = db.ref(path)
  const snapshot = await ref.once("value")

  return snapshot && snapshot.val()
}


async function getUserDataBy(wid, key, val) {
  try {
    const users = await getData("users/" + wid)
    if (!users) return null

    return Object.values(users).find(user => {
      return user[key].toLowerCase() === val.toLowerCase()
    })
  } catch (e) {
    throw e
  }
}

async function getPermission(wid, role) {
  try {
    const roleId = roles.findIndex(r => r === role) || 0
    return await getData(`workspaces/${wid}/permissions/${roleId}`)
  } catch (e) {
    throw e
  }
}

function getUser(uid) {
  return new Promise((res, rej) => {
    getAuth().getUser(uid)
      .then((user) => {
        res(user)
      })
      .catch((err) => {
        if (err.errorInfo.code === 'auth/user-not-found') {
          console.log(err.errorInfo.code)
          res(false)
        } else {
          rej(err)
        }
      })
  })
}

module.exports = {
  getData,
  getUserDataBy,
  getPermission,
  getUser
}