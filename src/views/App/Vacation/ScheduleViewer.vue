<template>
  <div>
    <app-base-sheet class="d-flex flex-column justify-center">
      <span class="display-1 ml-2">{{ schedule && schedule.title }}</span>
      <div
          :class="schedule && schedule.isApprove ? 'error--text' : 'info--text'"
          class="caption ml-1"
          v-text="schedule && schedule.isApprove
                  ? 'Редактирование не доступно'
                  : 'Доступно для редактирования'"
      >
      </div>
    </app-base-sheet>
    <app-base-sheet>
      <v-tabs
          v-model="activeTab"
      >
        <v-tab
            v-for="view in viewers"
            :key="view.id"
        >
          {{ view.name }}
        </v-tab>
      </v-tabs>
    </app-base-sheet>
    <v-progress-linear v-if="!schedule" indeterminate></v-progress-linear>
    <!--      <v-tab-item-->
    <!--        v-for="view in viewers"-->
    <!--        :key="view.id"-->
    <!--      >-->
    <!--    <v-tabs-items v-model="activeTab" style="background: inherit">-->
    <app-block-with-right-navbar v-else>
      <template v-slot:main>
        <app-base-sheet>
          <router-view
              :exception="schedule.exception"
              :vacations="vacations"
              :filters="filtersFunctions"

              :year="schedule.year"
          />
        </app-base-sheet>
      </template>
      <template v-slot:navbar>
        <app-base-sheet>
          <v-card-title class="justify-center">Фильтры</v-card-title>
          <v-select
              v-model="filters.status.value"
              :items="statuses"
              class="mt-8"
              dense
              hide-details
              item-text="label"
              item-value="id"
              label="Статус"
          />
          <v-select
              v-model="filters.team.value"
              :items="teams"
              class="mt-8"
              dense
              hide-details
              item-text="title"
              item-value="id"
              label="Команда"
          />
          <v-select
              v-model="filters.post.value"
              :items="posts"
              item-text="title"
              item-value="id"
              class="mt-8"
              dense
              hide-details
              label="Должность"
          />
          <v-select
              v-model="filters.task.value"
              :items="tasks"
              item-text="title"
              item-value="id"
              class="mt-8"
              dense
              hide-details
              label="Задача"
          />
          <v-btn
              block
              class="mt-2"
              color="secondary"
              left
              small
              text
              @click="reset"
          >
            сброс
          </v-btn>
        </app-base-sheet>
      </template>
    </app-block-with-right-navbar>
    <!--      </v-tab-item>-->
    <!--    </v-tabs-items>-->

    <app-popup
        ref="rejectPopup"
        show-comment
    >
      Отпуск будет отклонён. Продолжить?
    </app-popup>
    <app-popup
        ref="approvePopup"
    >
      Утвердить отпуск?
    </app-popup>
    <app-popup
        ref="cancelPopup"
        show-comment
    >
      Отозвать решение?
    </app-popup>
  </div>
</template>

<script>
import {appReady, schedules} from "@/mixins/ComputedData";
import AppBlockWithRightNavbar from "@/components/UI/app-block-with-sidebar";
import AppPopup from "@/components/AppPopup";
import TimelineView from "@/components/ScheduleViewer/TimelineView";
import ListView from "@/components/ScheduleViewer/ListView";
import AppBaseSheet from "@/components/UI/app-base-sheet";
import {Vacation} from "@/plugins/servises/Vacation";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";
import {Task} from "@/plugins/servises/Task";

const allItem = {label: 'Все', title: 'Все', id: -1}
const noneItem = {label: 'Нет', title: 'Нет', id: 0}
export default {
  name: 'ScheduleViewer',
  components: {
    AppPopup, AppBlockWithRightNavbar, AppBaseSheet
  },
  mixins: [schedules, appReady],
  data() {
    return {
      activeTab: 0,
      schedule: null,
      filters: {
        status: {
          value: -1,
          handler: (item, val, user) => item.status === val
        },
        team: {
          value: -1,
          handler: (item, val, user) => user.team === val || val === 0 && !user.team


        },
        post: {
          value: -1,
          handler: (item, val, user) => user.post === val || val === 0 && !user.post


        },
        task: {
          value: -1,
          handler: (item, val, user) =>
              user.tasks && user.tasks.includes(val) ||
              (val === 0 && (!user.tasks || !user.tasks.length))

        },
      },
      viewers: [
        {id: 0, name: 'Список', route: 'Viewer1', component: 'ListView'},
        {id: 1, name: 'Таймлайн', route: 'Viewer2', component: 'TimelineView'},
        // {text: 'Календарь', value: 'fullCalendar', to: 'Viewer3'},
      ],
      statuses: [
        allItem,
        ...Object.values(Vacation.statuses).filter(s => !s.private)
      ]
    }
  },
  created() {
    if (this.appReady) {
      this.initialize()
    }

    const name = this.$route.name
    const id = this.viewers.findIndex(view => view.route === name)
    if (this.activeTab !== id) {
      this.activeTab = id
    }
  },
  computed: {
    teams() {
      return [
        allItem,
        ...Team.getAll(),
        noneItem
      ]
    },
    posts() {
      return [
        allItem,
        ...Post.getAll(),
        noneItem
      ]
    },
    tasks() {
      return [
        allItem,
        ...Task.getAll(),
        noneItem
      ]
    },
    filtersFunctions() {
      const {filters} = this

      const functions = Object.values(filters).filter(filter => filter.value !== -1)

      return functions.map(filter => {
        return (item, uid) => {
          const user = this.$store.getters['users/getUserById'](uid || item.uid)
          return filter.handler(item, filter.value, user)
        }
      })
    },
    vacations() {
      const scheduleId = this.$route.params.id

      let vacations = Object.values(this.$store.getters['vacations/getBySid'](scheduleId))

      vacations = vacations.map(vacation => {
        let user = this.$store.getters['users/getUserById'](vacation.uid)
        vacation.team = user.team
        vacation.post = user.post
        return vacation
      })

      vacations = vacations.filter(vacation => !vacation.isDraft())

      return vacations
    }
  },
  provide() {
    return {
      approveVacation: this.onApprove,
      rejectVacation: this.onReject,
      cancelVacation: this.onCancel,
    }
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) {
        this.$router.push({name: 'Schedules'})
      }
    },
    async onReject(id) {
      let result = await this.$refs.rejectPopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).reject(result.comment)
      }
    },
    async onApprove(id) {
      let result = await this.$refs.approvePopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).approve()
      }
    },
    async onCancel(id) {
      let result = await this.$refs.cancelPopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).cancel(result.comment)
      }
    },
    reset() {
      for (let key in this.filters) {
        this.filters[key].value = -1
      }
    }
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
    },
    activeTab(id) {
      const name = this.viewers[id].route
      if (this.$route.name !== name) {
        this.$router.replace({name})
      }
    },
  }
}
</script>
