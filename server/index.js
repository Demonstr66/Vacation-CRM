const express = require('express');
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


const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (e) {
    next(createError(e))
  }
}

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vacationcrm-d3ff2-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: 'gs://vacationcrm-d3ff2.appspot.com'
});
const {getTemplateFile, replacement, download} = require("./download");
const {getUserDataBy, getPermission, getUser, getData} = require("./FB/DB");
const {
  accountCreateHandler, accountDeleteHandler, accountSetClaims, createUser
} = require("./accountHedlers");
const {inviteHandler, sendTest} = require("./mailer");

const db = admin.database()


const schedule = require('node-schedule');
const {checkVacations} = require("./checkNearVacation");

// const job = schedule.scheduleJob('* * * * *', async function () {
//   console.log('run checker')
//   // const workspaces = await getData('workspaces')
//   //
//   // for(let wid in workspaces) {
//   //   const schedules = await getData('schedules/' + wid)
//   //
//   //   for(let sid in schedules) {
//   //     if (schedules[sid].status != 2) continue
//   //
//   //     const vacations = await getData('vacations/' + wid + '/' + sid)
//   //
//   //     checkVacations(wid, vacations)
//   //   }
//   // }
// });


function updateUser(uid, data) {
  return getAuth().updateUser(uid, data)
}


app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

// app.get('/api/test', async (req, res, next) => {
//   // await sendTest()
//   const workspaces = await getData('workspaces')
//
//   for(let workspace in workspaces) {
//     const users = await getData('users/' + workspace)
//
//     for(let uid in users) {
//       try {
//         await getAuth().setCustomUserClaims(uid, {workspace})
//         console.log('uid: ' + uid +' completed')
//       }catch (e) {
//         console.log('err on uid: ' + uid, e)
//       }
//     }
//   }
//
//   res.json('ok')
// })

app.use(asyncHandler(async (req, res, next) => {
  const {uid, wid} = req.headers

  if (!wid) throw createError(401, 'Invalid parameters')

  req.wid = wid

  if (uid) {
    req.user = await getUser(uid)
    req.userData = await getUserDataBy(wid, 'uid', uid)
    req.permission = await getPermission(wid, req.userData.role)
  }

  next()
}))

async function check(req, res, next) {
  const {uid} = req.query
  const user = await getUser(uid)
  console.log('user: ' + user)

  if (!user) {
    console.log('uid: ' + uid)
    let {email} = await getUserDataBy(req.wid, 'uid', uid)
    console.log('email: ' + email)
    await createUser(req.wid, {email, uid})
    await getAuth().setCustomUserClaims(uid, {workspace: req.uid})
  }

  next()
}

app.get('/api/download/', asyncHandler(getTemplateFile), asyncHandler(replacement), asyncHandler(download))

app.get('/api/download/origin', asyncHandler(getTemplateFile), asyncHandler(download))

app.post('/api/account/create', asyncHandler(accountCreateHandler), asyncHandler(accountSetClaims))

app.delete('/api/account/delete', asyncHandler(accountDeleteHandler))

app.get('/api/message/invite', asyncHandler(check), asyncHandler(inviteHandler))

// app.get('/api/message/vacation', async (req, res, next) => {
//   const {uid} = req.query
//   if (!uid) return next(createError(403, 'invalid-parameters'))
//
//   const user = await getUserByUid(uid)
//
//   if (!user) return next(createError(404, 'user-not-found'))
//   const contents = await bucket.file('temp/aC3BSzQxJjCZiC4WcrR1dq/ОБРАЗЕЦ.docx').download()
//
//   sendEmail(user, vacationEmail, contents[0])
//     .then((data) => {
//       res.json(data)
//     })
//     .catch((err) => next(createError(err)))
// });
//
// app.get('/api/user/set/claims', async (req, res, next) => {
//   const {uid, w} = req.query
//
//   if (!uid || !w) return next(createError(403, 'invalid parameters'))
//
//   const user = await getUserByUid(uid)
//
//   if (!user) next(createError(404, 'user-not-found'))
//
//   await getAuth().setCustomUserClaims(uid, {workspace: w})
//   const data = await getUserByUid(uid)
//   res.json(data)
// });
// app.get('/api/user/test', async (req, res, next) => {
//   const {email} = req.query
//   if (!email) return next(createError(403, 'invalid-parameters'))
//
//   // const user = await getUserByUid(uid)
//
//   // if (!user) return next(createError(404, 'user-not-found'))
//   // const useremail = user.email;
//   getAuth()
//     .generateSignInWithEmailLink(email, {
//       handleCodeInApp: true,
//       url: 'http://localhost:8080/loginlink'
//     })
//     .then((link) => {
//       // Construct email verification template, embed the link and send
//       // using custom SMTP server.
//       return res.json(link);
//     })
//     .catch((error) => {
//       // Some error occurred.
//       return next(createError(400, error));
//     });
// });

app.use((req, res, next) => {
  next(createError(404))
})

app.use((error, req, res, next) => {
  console.log('i`m handler error')
  console.log(error)
  let message = error.errorInfo ? error.errorInfo.code : error
  res.status(error.status || 500)
  res.json(message)
})

app.listen(PORT, () => {
  console.log('listen port ' + PORT + ' at: ' + Date.now() / 1000)
});