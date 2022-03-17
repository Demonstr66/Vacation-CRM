export function defUser(...data) {
  let res = {
    uid: '',
    email: '',
    displayName: '',
    emailVerified: '',
    fullName: '',
    post: '',
    tabId: '',
  }

  if (data) {
    data.map(d => {
      for (let item in res) {
        if (d[item]) res[item] = d[item]
      }
    })

  }

  return res
}

export function defWorkspace(...data) {
  let res = {
    id: '',
    name: '',
    teams: [],
    posts: [],
  }

  if (data) {
    data.map(d => {
      for (let item in res) {
        if (d[item]) res[item] = d[item]
      }
    })

  }

  return res
}

export function defTeam() {
  return {
    id: '',
    name: ''
  }
}

export function updateObject(obj1, obj2) {
  let obj = {}
  for (let item in obj1) {
    obj[item] = obj1[item]
    if (obj2[item]) obj[item] = obj2[item]
  }
  return obj
}
