export const getShortDayLabel = {
  filters: {
    getShortDayLabel(val) {
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

const prepareUserKey = (key => {
  return [key, key.replace('user', '').toLowerCase()]
})

export const CUSTOM_USER_FILTER = {
  methods: {
    CUSTOM_USER_FILTER(value, search, user) {
      const filters = JSON.parse(search || "")

      let filterKeys = Object.keys(filters).filter(f => filters[f] !== null)
      if (!filterKeys.length) {
        return true
      }
      let preparedKeys = filterKeys.map(prepareUserKey)
      return preparedKeys.every(([origKey, key]) => {
        if (Array.isArray(user[key])) {
          return user[key].indexOf(filters[origKey]) !== -1
        } else {
          return user[key] === filters[origKey]
        }
      })
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
const truncate = (val, n) => {
  if (!val) {
    return
  }
  const maxLength = n
  if (val.length <= maxLength) {
    return val
  }

  const reverseArr = val.split('').reverse()
  const format = reverseArr.slice(0, reverseArr.indexOf('.') + 4).reverse().join('')

  const name = val.slice(0, maxLength - (format.length + 3))

  return name + '...' + format
}
export const truncate30 = {
  filters: {
    truncate30(val) {
      return truncate(val, 30)
    }
  }
}