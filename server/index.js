const express = require('express');
const winston = require('winston');
const cors = require('cors');
const createError = require('http-errors');
const {initializeApp} = require('firebase-admin/app');
const admin = require("firebase-admin");
const serviceAccount = require("./setting.json");
const {getAuth} = require("firebase-admin/auth");
const nodemailer = require('nodemailer');
const {emailAuth} = require("./config");
const fs = require("fs");
const handlebars = require("handlebars");
const {appData} = require("./appConfig");

const app = express();
const PORT = 3000

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const logger = winston.createLogger();
const errFiles = new winston.transports.File({filename: 'error.log', level: 'error'})
const files = new winston.transports.File({filename: 'combined.log'})

logger.clear().add(files, {'timestamp': true}).add(errFiles, {'timestamp': true})


initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vacationcrm-d3ff2-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: 'gs://vacationcrm-d3ff2.appspot.com'
});
const {getTemplateFile, replacement, download} = require("./download");
const {getUserDataBy, getPermission, getUser, getData} = require("./FB/DB");
const {
  accountCreateHandler, accountDeleteHandler, accountSetClaims, createUser, createAccountHandler,
  setClaimHandler
} = require("./accountHandlers");
const {inviteHandler, sendTest} = require("./mailer");

const db = admin.database()


const schedule = require('node-schedule');
const {checkVacations} = require("./checkNearVacation");


function updateUser(uid, data) {
  return getAuth().updateUser(uid, data)
}


app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

app.use(asyncHandler(async (req, res, next) => {
  const {uid, wid} = req.headers

  if (!wid) throw createError(401, 'Invalid parameters')

  req.wid = wid

  if (uid) {
    req.user = await getUser(uid)
    req.userData = await getUserDataBy(wid, 'uid', uid)
    req.permission = await getPermission(wid, req.userData.role)
  }

  logger.info(`time: ${Date.now()}; uid: ${uid}, url: ${req._parsedUrl.pathname}, query: ${JSON.stringify(req.query || {})}`)

  next()
}))

async function check(req, res, next) {
  const {uid} = req.query
  const user = await getUser(uid)

  if (!user) {
    let {email} = await getUserDataBy(req.wid, 'uid', uid)
    await createUser(req.wid, {email, uid})
    await getAuth().setCustomUserClaims(uid, {workspace: req.wid})
  }

  next()
}

async function createAccount(workspace, email) {

}

app.get('/api/download/', asyncHandler(getTemplateFile), asyncHandler(replacement), asyncHandler(download))

app.get('/api/download/origin', asyncHandler(getTemplateFile), asyncHandler(download))

app.post('/api/account/create',
  asyncHandler(createAccountHandler),
  asyncHandler(setClaimHandler),
  asyncHandler(async (req, res, next) => {
    res.json(req.createdUser)
  })
)

app.delete('/api/account/delete', asyncHandler(accountDeleteHandler))

app.get('/api/message/invite', asyncHandler(check), asyncHandler(inviteHandler))


app.use((req, res, next) => {
  next(createError(404))
})

app.use((error, req, res, next) => {
  logger.error({error, req})
  let message = error.errorInfo ? error.errorInfo.code : error
  res.status(error.status || 500)
  res.json(message)
})

app.listen(PORT, () => {
  console.log('listen port ' + PORT + ' at: ' + Date.now() / 1000)
  logger.info('listen port ' + PORT + ' at: ' + Date.now() / 1000)
});