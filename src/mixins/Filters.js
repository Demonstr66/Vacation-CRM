export const makeWeekDay = {
  filters: {
    makeWeekDay(val) {
      const weekDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return weekDay[new Date(val).getDay()]
    }
  }
}

export const normalizeDate = {
  filters: {
    normalizeDate(val) {
      return val.split('-').reverse().join('.')
    }
  }
}

export const lowerCase = {
  filters: {
    lowerCase(val) {
      return val.toLowerCase()
    }
  }
}