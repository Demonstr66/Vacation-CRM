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

export const tasks = {
  computed: {
    ...mapGetters("tasks", {tasks: 'get'}),
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