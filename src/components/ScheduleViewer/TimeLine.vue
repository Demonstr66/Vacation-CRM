<template>
  <div>
    <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
    <div v-else>
      <div v-if="isNoItems">
        Не добавлен ни один отпуск
      </div>
      <div v-else>
        <TheTimelineBase
          :tree="tree"
          :schedule="schedule"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {posts, tasks, teams} from "@/mixins/ComputedData";
import TheTimelineBase from "@/components/ScheduleViewer/TheTimelineBase";
import {convertUsersToTree} from "@/plugins/utils";

export default {
  name: "TimeLine",
  components: {TheTimelineBase},
  mixins: [teams, tasks, posts],
  props: {
    groupBy: {
      type: String,
      default: 'none'
    },
    sortBy: {
      type: String,
      default: 'none'
    },
    schedule: {}
  },
  data: () => ({
    isLoading: false,
    isNoItems: false,
    hideEmptyGroups: true,
    vacations: [],
    users: [],
    rows: [],
    tree: []
  }),
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      const scheduleId = this.$route.params.id
      const vacations = this.$store.getters['vacations/getBySid'](scheduleId)

      if (!vacations) return this.isNoItems = true

      this.isNoItems = false
      this.vacations = Object.values(vacations)
      this.users = [...this.groupVacationsByUser(this.vacations)]
      this.tree = [...convertUsersToTree(this.users, this.groupBy, this.getHeaders(this.groupBy))]

    },
    groupVacationsByUser(vacations) {
      let users = {}
      vacations.map(v => {
        if (!users[v.uid]) {
          users[v.uid] = {
            uid: v.uid,
            user: {...this.$store.getters['users/getUserById'](v.uid)},
            events: []
          }
          users[v.uid].title = users[v.uid].user.displayName
        }
        users[v.uid].events.push({...v})
      })

      return Object.values(users)
    },
    getHeaders(groupBy) {
      if (['tasks', 'teams', 'posts'].indexOf(groupBy) !== -1) return Object.values(this[groupBy])

      return null
    },
  },
  watch: {
    groupBy() {
      this.tree = [...convertUsersToTree(this.users, this.groupBy, this.getHeaders(this.groupBy))]
    }
  }

}
</script>
