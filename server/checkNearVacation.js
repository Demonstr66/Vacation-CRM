const firstNotify = 7
const secondNotify = 3
const {sendEmail} = require("./mailer");
const {getUserDataBy} = require("./FB/DB");
const {getStorage} = require("firebase-admin/storage");
const createReport = require("docx-templates");
const {getFileWithData} = require("./download");
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',]

const bucket = getStorage().bucket()

function dateDiff(date1, date2) {
    return Math.ceil((date2 - date1) / (24 * 60 * 60 * 1000))
}

function checkVacations(wid, vacations) {
    for(let vid in vacations) {
        let v = vacations[vid]
        if (v.status != 2) continue

        checkVacation(wid, v)
    }
}

function checkVacation(wid, vacation) {
    let startDate = new Date(vacation.start)
    let diff = dateDiff(new Date(), startDate)

    if (diff == firstNotify) {
        sendNotify(wid, firstNotify, vacation)
    } else if (diff == secondNotify) {
        sendNotify(wid, secondNotify, vacation)
    } else {
        return
    }
}

async function sendNotify(wid, days, vacation) {
    console.log('try Send email')
    const user = await getUserDataBy(wid, 'uid', vacation.uid)
    const replacements = {
        name: user.displayName, start: vacation.start, end: vacation.end
    }
    const contents = await bucket.file('temp/' + wid + '/Образец.docx').download()
    const template = contents[0]

    const data = await getFileWithData(template, {
        fullName: user.fullName,
        post: '',
        date: getFormatDate(new Date()),
        start : getFormatDate(vacation.start),
        finish : getFormatDate(vacation.end),
        days: vacation.days,
    })

    await sendEmail(user.email, 'Уведомление о приближающемся отпуске', './notification.html', replacements, data)

    console.log('send successful!')
}

function getFormatDate(date) {
    return '"' + new Date(date).getDate() + '" ' + months[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear()
}

module.exports = {
    checkVacations,
}