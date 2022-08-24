<template>
  <div>
    <groupTools
      v-model="groupBy"
      :groups="groups"
      @clickFilter="$emit('showFiltersBar')"
    />
    <the-timeline
      :exception="exception || []"
      :items="tree"
      :year="parseInt(year)"

      @click="(data) => $emit('click', data)"
    >
    </the-timeline>
  </div>
</template>

<script>
import TheTimeline from "@/components/ScheduleViewer/TheTimeline";
import {convertUsersToTree} from "@/plugins/utils";
import {posts, tasks, teams} from "@/mixins/ComputedData";
import GroupTools from "@/components/ScheduleViewer/GroupTools";

export default {
  name: "TimelineView",
  components: {GroupTools, TheTimeline},
  mixins: [teams, tasks, posts],
  props: {
    vacations: {},
    year: {
      type: [String, Number]
    },
    exception: {
      type: Array
    }
  },
  data: () => ({
    hideEmptyGroups: true,
    groupBy: null,
    groups: [
      {value: 'tasks', text: 'Задачам'},
      {value: 'posts', text: 'Должноcтям'},
      {value: 'teams', text: 'Командам'}
    ],
  }),
  computed: {
    tree() {
      const {vacations, groupBy, hideEmptyGroups} = this
      const users = [...this.groupVacationsByUser(Object.values(vacations))]
      let tree = [...convertUsersToTree(users, groupBy, this.getHeaders(groupBy))]

      if (hideEmptyGroups && groupBy) {
        tree = tree.filter(node => node.children && node.children.length)
      }

      return tree
    },
  },
  methods: {
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
    }
  }
}
</script>