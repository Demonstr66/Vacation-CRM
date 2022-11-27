const createError = require('http-errors');
const {getStorage} = require("firebase-admin/storage");
const createReport = require("docx-templates");


const bucket = getStorage().bucket()

function getFileWithData(template, data) {
  return createReport.createReport({
    template,
    data,
  });
}

// async function download(req, res, next) {
//   try {
//     const {fullPath, post, start, finish, days, date} = req.query
//     if (!fullPath || !req.userData || post === undefined || !start || !finish || !days || !date)
//       throw createError(400, 'Invalid parameters')
//
//     const contents = await bucket.file(fullPath).download()
//     const template = contents[0]
//     if (!template) throw createError(404, 'template-not-found')
//
//
//     const buffer = await getFileWithData(template, {
//       ...req.userData,
//       ...req.query
//     })
//
//     const type = fullPath.split('.').reverse()[0]
//
//     const fileName = `Template.${type}`
//     let fileType
//     switch (type) {
//       case 'docx':
//         fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
//         break;
//       case 'doc':
//         fileType = 'application/msword';
//         break;
//     }
//
//     res.writeHead(200, {
//       'Content-Disposition': `attachment; filename="${fileName}"`, 'Content-Type': fileType,
//     })
//
//     const download = Buffer.from(buffer, 'base64')
//     res.end(download)
//   } catch (e) {
//     next({code: 501, e})
//   }
// }


async function getTemplateFile(req, res, next) {
  const {fullPath} = req.query
  if (!fullPath) throw createError(400)

  const contents = await bucket.file(fullPath).download()
  const template = contents[0]
  if (!template) throw createError(404, 'template-not-found')

  const type = fullPath.split('.').reverse()[0]
  req.file = {
    template,
    type
  }
  next()
}

async function replacement(req, res, next) {
  const {fullName, post, start, finish, days, date} = req.query
  if (!fullName || post === undefined || !start || !finish || !days || !date)
    throw createError(400)

  const template = req.file.template

  req.file.buffer = await getFileWithData(template, {
    ...req.query
  })
  next()
}

async function download(req, res, next) {
  const type = req.file.type

  const fileName = `Template.${type}`
  let fileType
  switch (type) {
    case 'docx':
      fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'doc':
      fileType = 'application/msword';
      break;
  }

  res.writeHead(200, {
    'Content-Disposition': `attachment; filename="${fileName}"`, 'Content-Type': fileType,
  })
  const buffer = req.file.buffer || req.file.template
  const download = Buffer.from(buffer, 'base64')
  res.end(download)
}

module.exports = {
  getTemplateFile,
  replacement,
  download,
  getFileWithData
}