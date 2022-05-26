import {mapGetters, mapState} from "vuex";

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

export const appName = {
  computed: {
    ...mapGetters({'appName': "getAppName"}),
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

export const domen = {
  computed: {
    ...mapState({
      domen: function (state) {
        try {
          return state.workspace.workspace.domen || '';
        } catch (e) {
          return ''
        }
      }
    }),
  }
}

export const currentUID = {
  computed: {
    ...mapGetters("currentUser", {
      currentUID: "uid"
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

export const allVacations = {
  computed: {
    ...mapGetters("vacations", {'allVacations': 'get'})
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
        if (!months[m]) months[m] = {
          title: currDay.format('MMMM'),
          days: 0
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
    vacationStatuses: Object.freeze({
      0: 'Черновик',
      1: 'Ожидает подтверждения',
      2: 'Утверждено',
      3: 'Отклонено'
    })
  })
}