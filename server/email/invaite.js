const {appData} = require("../appConfig");
const template = (name, by, login, password, appLink, appName) => `<html lang="ru"><head><meta charset="UTF-8"><style>body{text-indent:16px;font-size:14px}.main{padding:4px;border:1px solid #ccc;border-radius:4px;min-width:80%}a{color:#1976d2;font-weight:700}a:hover{color:#458ace;text-decoration:underline}</style></head><body><div classname="main"><h3>Здравствуйте, ${name}!</h3><p>${by} пригласил в приложение<a href="${appLink}">${appName}</a></p><div><b>Логин:</b>${login}</div><div><b>Пароль:</b>${password}</div></div></body></html>`


module.exports.invite = (name, by, login, password) => template(name, by, login, password, appData.link, appData.name)