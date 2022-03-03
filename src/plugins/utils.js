const moment = require('moment')

export function dateDiff(start, end) {
  return moment(end).diff(moment(start), 'days') + 1
}