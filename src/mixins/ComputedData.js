import {mapGetters} from "vuex";
import Tools from "@/plugins/tools";

export const appReady = {
  computed: {
    ...mapGetters("app", {appReady: 'isReady'}),
  }
}
export const workspace = {
  computed: {
    ...mapGetters("workspace", {workspace: 'get'}),
  }
}

export const templateFile = {
  computed: {
    ...mapGetters("templateFile", {templateFile: 'get'}),
  }
}

export const teams = {
  computed: {
    ...mapGetters("teams", {teams: 'get'}),
  }
}
export const teamsCount = {
  computed: {
    ...mapGetters("teams", {teamsCount: 'count'}),
  }
}

export const tasks = {
  computed: {
    ...mapGetters("tasks", {tasks: 'get'}),
  }
}
export const tasksCount = {
  computed: {
    ...mapGetters("tasks", {tasksCount: 'count'}),
  }
}

export const schedules = {
  computed: {
    ...mapGetters("schedules", {schedules: 'get'}),
  }
}

export const posts = {
  computed: {
    ...mapGetters("posts", {posts: 'get'}),
  }
}
export const postsCount = {
  computed: {
    ...mapGetters("posts", {postsCount: 'count'}),
  }
}


export const messages = {
  computed: {
    ...mapGetters(["messages"]),
  }
}

export const user = {
  computed: {
    ...mapGetters("currentUser", {user: 'get'}),
  }
}


export const users = {
  computed: {
    ...mapGetters("users", {users: 'get'}),
  }
}

export const archive = {
  computed: {
    ...mapGetters("users", {'archive': 'getArchive'}),
  }
}

export const domain = {
  computed: {
    ...mapGetters('workspace', ['domain']),
  }
}

export const currentUID = {
  computed: {
    ...mapGetters("currentUser", {
      currentUID: "uid"
    }),
  }
}
export const WID = {
  computed: {
    ...mapGetters("app", {
      WID: "getWID"
    }),
  }
}

export const FBEmail = {
  computed: {
    ...mapGetters("FB", {
      FBEmail: "email"
    }),
  }
}

export const myVacations = {
  mixins: [currentUID],
  computed: {
    ...mapGetters("vacations", ['getByUid']),
    myVacations() {
      return this.getByUid(this.currentUID)
    }
  }
}
export const getShortUserNameByUID = {
  computed: {
    ...mapGetters("users", ['getDisplayNameByUID'])
  },
  methods: {
    getShortUserNameByUID(uid) {
      return this.getDisplayNameByUID(uid)
    }
  }
}
export const allVacations = {
  computed: {
    ...mapGetters("vacations", {'allVacations': 'get'})
  }
}
export const vacationsBySid = {
  computed: {
    ...mapGetters("vacations", {'vacationsBySid': 'getBySid'})
  }
}

export const getChiefOf = {
  methods: {
    getChiefOf(uid) {
      let res = []
      let lvl = 0
      const user = this.$store.getters['users/getUserById'](uid)
      const teams = this.$store.getters['teams/get']
      const team = user.team ? teams[user.team] : null

      if (team) {
        if (team.leaderId !== uid) {
          res.push({lvl, uid: team.leaderId})
        }

        while (team.parent) {
          lvl++
          let nextTeam = teams[team.parent]
          if (nextTeam.leaderId !== uid) {
            res.push({lvl, uid: nextTeam.leaderId})
          }
        }
      }

      return res
    }
  }
}

export const updateQuery = {
  methods: {
    updateQuery(key, val) {
      const route = this.$route
      const path = route.path
      const query = Object.assign({}, route.query, {})

      if (!val) {
        if (query.hasOwnProperty(key)) {
          delete query[key]
        }
      } else {
        query[key] = val
      }

      if (!Tools.isEqual(query, route.query)) {
        this.$router.replace({path, query})
      }
    },
  }
}

export const calendar = {
  computed: {
    calendar() {
      let currDay = this.$moment(`${this.year}-01-01`)
      let days = []
      let months = {}

      while (currDay.get('year') === this.year) {
        days.push(this.$moment(currDay))

        const m = currDay.get('month')
        if (!months[m]) {
          months[m] = {
            title: currDay.format('MMMM'),
            days: 0
          }
        }
        months[m].days += 1

        currDay.add(1, 'days')
      }

      days = days.map(r => ({
        dayNumber: r.format('DD'),
        date: r.format('YYYY-MM-DD'),
        endOfMonth: r.get('month') !== this.$moment(r).add(1, 'days').get('month'),
        endOfYear: r.get('year') !== this.$moment(r).add(1, 'days').get('year'),
        weekend: r.day() == 6 || r.day() == 0,
        workday: this.schedule.exception.workdays.indexOf(r.format('YYYY-MM-DD')) != -1,
        holiday: this.schedule.exception.holidays.indexOf(r.format('YYYY-MM-DD')) != -1,
        today: r.format('YYYY-MM-DD') === this.$moment().format('YYYY-MM-DD')
      }))

      return {days, months: Object.values(months)}
    }
  },
}

export const vacationStatuses = {
  data: () => ({
    vacationStatuses: {
      0: {title: 'Черновик', color: 'secondary', icon: 'mdi-pencil'},
      1: {title: 'Ожидает подтверждения', color: 'warning', icon: 'mdi-help'},
      2: {title: 'Утверждено', color: 'success', icon: 'mdi-check'},
      99: {title: 'Отклонено', color: 'error', icon: 'mdi-close'},
    }
  })
}