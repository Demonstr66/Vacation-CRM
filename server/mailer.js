const {getAuth} = require("firebase-admin/auth");
const {BASE_URL, emailAuth} = require("./config");
const createError = require('http-errors');
const fs = require("fs");
const handlebars = require("handlebars");
const {appData} = require("./appConfig");
const {getData, getUserDataBy} = require("./FB/DB");
const nodemailer = require("nodemailer");

async function getInviteLink(email) {
  return getAuth().generateSignInWithEmailLink(email, {
    url: BASE_URL + '/loginlink'
  })
}

const transporter = nodemailer.createTransport({
  // service: 'Gmail', auth: emailAuth
  host: "10.159.32.136",
  port: 25,
});

async function getSubTeams(wid, id) {
  return new Promise(async (res, rej) => {
    const teams = await getData(`workspaces/${wid}/teams`)
    if (!teams || !teams[id]) rej('team-not-found')

    let children = []
    const f = (parent) => {
      teams.map(team => {
        if (team.parent === parent) {
          children.push(team.id)
          f(team.id)
        }
      })
    }

    f(id)
    res(children)
  })
}

async function getTeamWhereLeader(wid, uid) {
  return new Promise(async (res, rej) => {
    const teams = await getData(`workspaces/${wid}/teams`)
    res(Object.valus(teams).filter(team => team.leaderId === uid).map(team => team.id))
  })
}

function sendTest() {
  try {
    let mailOptions = {
      from: 'Vacation CRM', to: 'dmitriy.filippov@ipsos.com', subject: 'test', html: '<b>Привет</b>'
    }

    return new Promise((res, rej) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          rej(error);
        } else {
          res(info.response);
        }
      })
    })

  } catch (e) {
    console.log(e)
  }
}

function sendEmail(email, subject, html, replacements, attachment) {
  console.log('sendEmail')
  try {
    const filePath = html
    console.log('sendEmail 1')
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    console.log('sendEmail 1.1')
    const template = handlebars.compile(source);

    console.log('sendEmail 2')
    replacements.appName = appData.name
    replacements.appLink = appData.link
    const htmlToSend = template(replacements);
    console.log('sendEmail 3')
    let mailOptions = {
      from: 'Vacation CRM', to: email, subject, html: htmlToSend, attachments: []
    }

    if (attachment) {
      mailOptions.attachments.push({
        filename: 'Заявление.docx', content: attachment
      })
    }

    return new Promise((res, rej) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          rej(error);
        } else {
          res(info.response);
        }
      })
    })

  } catch (e) {
    console.log(e)
  }
}

async function inviteHandler(req, res, next) {
  const {uid} = req.query
  if (!uid || !req.user) throw createError(400)

  const user = await getUserDataBy(req.wid, 'uid', uid)
  if (!user) throw createError(404)

  const permission = req.permission
  const val = permission.manageUsers.update

  if (val !== 'all') {
    if (val === 'none') throw createError(403, 'access-denied')

    const headOfTeams = await getTeamWhereLeader(req.wid, req.user.uid) || user.team
    let subTeams = []
    headOfTeams.map(async (team) => {
      subTeams.push(team)
      teams = await getSubTeams(req.wid, team)
      subTeams.push(...teams)
    })

    if (val === 'team') {
      if (!user.team || !headOfTeams.includes[user.team]) throw createError(403, 'access-denied')
    }
    if (val === 'subTeams') {
      if (!user.team || !subTeams.includes[user.team]) throw createError(403, 'access-denied')
    }
  }

  const link = await getInviteLink(user.email)
  const replacements = {
    name: user.displayName, link, by: req.user.displayName
  }

  await sendEmail(user.email, 'Приглашение', './template.html', replacements)
  res.json('email-sending')
}

module.exports = {
  inviteHandler,
  sendTest
}