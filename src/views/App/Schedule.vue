<template>
  <div>
    <v-toolbar dense flat>
      <v-select
        v-model="groupBy"
        :items="groupItems"
        item-text="text"
        item-value="value"
      >
      </v-select>
    </v-toolbar>
    <v-progress-linear v-if="!!!schedule" indeterminate></v-progress-linear>
    <the-timeline
      v-else
      :group-by="groupBy"
      :schedule="schedule"
      :year="year"
    ></the-timeline>
  </div>
</template>

<script>
import TheCalendar from "@/components/TheCalendar";
import {allVacations, postsCount, schedules, tasksCount, teamsCount} from "@/mixins/ComputedData";
import TheTimeline from "@/components/TheTimeline"

export default {
  name: 'Schedule',
  components: {TheTimeline, TheCalendar},
  mixins: [schedules, allVacations, tasksCount, teamsCount, postsCount],
  data: () => ({
    year: 2022,
    schedule: null,
    groupBy: 'none',
    groupItems: [
      {text: 'Команда', value: 'team'},
      {text: 'Задачи', value: 'task'},
      {text: 'Должность', value: 'post'},
      {text: 'Не группировать', value: 'none'},
    ]
  }),
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) this.$router.replace({name: 'Schedules'})

      if (this.tasksCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'task')
      if (this.teamsCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'team')
      if (this.postsCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'post')
    },
    // mergeByAlex(data) {
    //   let n = data.length
    //
    //   data = data.sort((a, b) => a.start > b.start ? 1 : -1)
    //
    //   let ans = []
    //   let i = 0
    //   while (i < n) {
    //     ans.push({start: data[i].start, days: 1})
    //     let end = data[i].end
    //
    //     while (i + 1 < n &&
    //     end >= this.$moment(data[i + 1].start).subtract(1, 'days').format('YYYY-MM-DD')) {
    //       i++
    //       end = this.max(end, data[i].end)
    //     }
    //
    //     ans[ans.length - 1].end = end
    //     i += 1
    //   }
    //   return ans
    // },
    // workload(data) {
    //   let n = data.length
    //   let ans = []
    //   let points = []
    //   data.map(d => {
    //     points.push([d.start, -1])
    //     points.push([d.end, 1])
    //   })
    //   points = points.sort((a, b) => a[0] > b[0] ? 1 : -1)
    //
    //   let curr = 0
    //   for (let i = 0; i < n * 2 - 1; i++) {
    //     curr -= points[i][1]
    //     if (points[i][0] != points[i + 1][0] && curr != 0) ans.push({
    //       start: points[i][0],
    //       end: points[i + 1][0],
    //       days: curr
    //     })
    //   }
    //   return ans
    // }    ,
    // max(a, b) {
    //   return a > b ? a : b
    // }
  }
}
</script>
