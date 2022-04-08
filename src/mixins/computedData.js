import { mapState, mapGetters } from "vuex";

export const teams = {
  computed: {
    ...mapGetters("workspace", ['teams']),
  }
}
export const tasks = {
  computed: {
    ...mapGetters("workspace", ['tasks']),
  }
}

export const posts = {
  computed: {
    ...mapGetters("workspace", ['posts']),
  }
}

export const users = {
  computed: {
    ...mapGetters("workspace", ['users']),
  }
}
export const domen = {
  computed: {
    ...mapState({
      domen: function(state) {
        try {
          return state.workspace.workspace.domen || '';
        } catch(e) {
          return ''
        }
      }
    }),
  }
}