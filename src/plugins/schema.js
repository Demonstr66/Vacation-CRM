export function defUser(...data) {
  let res = {
    uid: '',
    email: '',
    emailVerified: false,
    displayName: '',
    fullName: '',
    parent: '',
    post: null,
    tasks: [],
    team: null,
    workspace: '',
    role: 'user',
    active: false,
    archive: false
  }
  //roles 'currentUser' < 'leader' < 'admin' < 'owner'


  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defWorkspace(...data) {
  let res = {
    id: '',
    name: '',
    domen: '',
    owner: '',
    tasks: [],
    posts: [],
    teams: []
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defSchedule(...data) {
  let res = {
    id: '',
    title: '',
    startDate: '',
    endDate: '',
    year: '',
    isTemp: true,
    isActive: false
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defTask(...data) {
  let res = {
    id: '',
    title: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defPost(...data) {
  let res = {
    id: '',
    title: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function defTeam(...data) {
  let res = {
    id: '',
    title: '',
    leaderId: '',
    tempLeaderId: ''
  }

  if (data) {
    data.map(d => {
      res = updateObject(res, d)
    })
  }
  return res
}

export function updateObject(obj1, obj2) {
  let obj = {}
  for (let item in obj1) {
    obj[item] = obj1[item]
    if (obj2[item] !== undefined) obj[item] = obj2[item]
  }
  return obj
}
