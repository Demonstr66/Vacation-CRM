const moment = require('moment')

export function dateDiff(start, end) {
  return moment(end).diff(moment(start), 'days') + 1
}

export const dictionary = {
  "auth/user-not-found": "Пользователь с такими данными не найден",
  "auth/wrong-password": "Пользователь с такими данными не найден",
  "auth/email-already-in-use": "Пользователь с таким email существует",
  "auth/too-many-requests": "Слишком рано, попробуйте позднее",
  "auth/operation-not-allowed": "Операция не разрешена. Попробуйсте другой email",
  "auth/weak-password": "Используйте более надёжный пароль",
  "auth/user-disabled": "Ваш аккаунт заблокирован",
  "auth/invalid-email": "Некорректный email",
  "auth/email-not-verify": "Email не подтверждён",
  "email_cofirm": "Email подтверждён",
}