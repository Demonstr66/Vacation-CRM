const {getAuth} = require("firebase-admin/auth");
const {getUserDataBy} = require("./FB/DB");
const createError = require('http-errors');

async function isAccountExist(uid) {
  try {
    return !!await getAuth().getUser(uid)
  } catch (e) {
    throw createError(404, e)
  }
}

async function createUser(wid, data) {
  try {
    const dbData = await getUserDataBy(wid, 'email', data.email)

    if (dbData) {
      Object.assign(data, dbData)
    }

    return getAuth().createUser(data)
  } catch (e) {
    throw e
  }
}

async function accountCreateHandler(req, res, next) {
  const {email, password} = req.body
  if (!email) throw createError(400)
  let data = {email}
  if (password) data.password = password

  req.createdUser = await createUser(req.wid, data)
  next()
}

async function accountDeleteHandler(req, res, next) {
  const {uid} = req.query
  if (!uid) throw createError(400)
  if (!req.user) throw createError(401)
  if (!req.permission) throw createError(403)

  if (!await isAccountExist(uid)) throw createError(404)

  const canDelete = req.permission.manageUsers.delete

  if (!canDelete && req.user.uid !== uid) throw createError(403)

  await getAuth().deleteUser(uid)

  res.json('User deleted')
}

async function accountSetClaims(req, res, next) {
  const uid = req.createdUser.uid
  const workspace = req.wid

  await getAuth().setCustomUserClaims(uid, {workspace})

  res.json(req.createdUser)
}


module.exports = {
  accountCreateHandler,
  accountDeleteHandler,
  accountSetClaims
}