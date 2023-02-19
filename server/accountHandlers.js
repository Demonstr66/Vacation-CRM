const {getAuth} = require("firebase-admin/auth");
const {getUserDataBy} = require("./FB/DB");
const createError = require('http-errors');

function isAccountExist(uid) {
  return getAuth().getUser(uid)
}

function setWorkspaceClaims(wid, uid) {
  return getAuth().setCustomUserClaims(uid, {workspace: wid})
}

async function createAccount(wid, data) {
  if (data.email) {
    let dataFromDB = await getUserDataBy(wid, 'email', data.email)
    Object.assign(data, dataFromDB)
  }

  return getAuth().createUser(data)
}

async function createAccountHandler(req, res, next) {
  const {email, password} = req.body
  if (!email) throw createError(400, 'Invalid parameters: Email required')

  let data = {email}
  if (password) data.password = password
  req.createdUser = await createUser(req.wid, data)
  next()
}

async function setClaimHandler(req, res, next) {
  const uid = req.createdUser.uid
  const wid = req.wid

  if (!uid || !wid) throw createError(400, 'Invalid parameters: Wrong requested data')

  await setWorkspaceClaims(wid, uid)

  next()
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
  if (!email) throw createError(400, 'invalid parameters: Email not found')
  let data = {email}
  if (password) data.password = password

  req.createdUser = await createUser(req.wid, data)
  next()
}

async function accountDeleteHandler(req, res, next) {
  const {uid} = req.query
  if (!uid) throw createError(400, 'Неверный запрос: email не найден')
  if (!req.user) throw createError(401, 'Запрещено: не авторизован')
  if (!req.permission) throw createError(403, 'Запрещено: права не определены')

  if (!await isAccountExist(uid)) throw createError(404, 'Запрашиваемый аккаунт не найден')

  const canDelete = req.permission.manageUsers.delete

  if (!canDelete && req.user.uid !== uid) throw createError(403, 'Запрещено: не достаточно прав')

  await getAuth().deleteUser(uid)

  res.json('User deleted')
}

async function accountSetClaims(req, res, next) {
  const uid = req.createdUser.uid
  const workspace = req.wid

  await getAuth().setCustomUserClaims(uid, {workspace})

  res.json(req.createdUser)
}


// module.exports = {
//   accountCreateHandler,
//   accountDeleteHandler,
//   accountSetClaims,
//   createUser
// }

module.exports = {
  isAccountExist,
  setWorkspaceClaims,
  createAccount,
  createAccountHandler,
  setClaimHandler,

  accountCreateHandler,
  accountDeleteHandler,
  accountSetClaims,
  createUser
}