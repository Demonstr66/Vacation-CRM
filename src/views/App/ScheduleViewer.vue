<template>
  <div>
    <v-progress-linear v-if="!schedule" indeterminate></v-progress-linear>
    <div v-else>
      <div class="d-flex">
        <div class="headline ml-2 info--text">
          {{ schedule.title }}
        </div>
        <v-spacer/>
      </div>
      <div class="mt-2">
        <v-divider></v-divider>
        <div class="d-flex px-3">
          <span>Вид: </span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <a
                class="px-1"
                v-bind="attrs"
                v-on="on"
              >
                {{ selectedViewerTitle }}
              </a>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in viewerTypes"
                :key="index"
                :to="{name: item.to}"
                link
                @click="viewer = item.value"
              >
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <span>Группировать: </span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <a
                class="px-1"
                v-bind="attrs"
                v-on="on"
              >
                {{ selectedGroupByTitle }}
              </a>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in groupItems"
                :key="index"
                link
              >
                <v-list-item-title
                  @click="groupBy = item.value"
                >
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-divider></v-divider>
      </div>
    </div>
    <keep-alive>
      <router-view v-if="!!schedule" :group-by="groupBy" :schedule="schedule"/>
    </keep-alive>
  </div>
</template>

<script>
import TheCalendar from "@/components/TheCalendar";
import {
  allVacations,
  appReady,
  postsCount,
  schedules,
  tasksCount,
  teamsCount
} from "@/mixins/ComputedData";

export default {
  name: 'ScheduleViewer',
  components: {TheCalendar},
  mixins: [schedules, allVacations, tasksCount, teamsCount, postsCount, appReady],
  data: () => ({
    schedule: null,
    groupBy: 'none',
    viewer: 'list',
    viewerTypes: [
      {text: 'Список', value: 'list', to: 'Viewer1'},
      {text: 'Таймлайн', value: 'tl', to: 'Viewer2'},
      {text: 'Календарь', value: 'fullCalendar', to: 'Viewer3'},
    ],
    groupItems: [
      {text: 'Команда', value: 'teams'},
      {text: 'Задачи', value: 'tasks'},
      {text: 'Должность', value: 'posts'},
      {text: 'Не группировать', value: 'none'},
    ]
  }),
  created() {
    if (this.appReady) this.initialize()
    let routeName = this.$route.name
    let viewer = this.viewerTypes.find(v => v.to === routeName)
    if (viewer) this.viewer = viewer.value
  },
  computed: {
    selectedViewerTitle() {
      const type = this.viewer
      const types = this.viewerTypes

      return types.find(x => x.value === type).text
    },
    selectedGroupByTitle() {
      const type = this.groupBy
      const types = this.groupItems

      return types.find(x => x.value === type).text
    }
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) this.$router.push({name: 'Schedules'})

      if (this.tasksCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'tasks')
      if (this.teamsCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'teams')
      if (this.postsCount === 0) this.groupItems = this.groupItems.filter(g => g.value !== 'posts')
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
  },
  watch: {
    appReady() {
      this.initialize()
    }
  }
}
</script>
