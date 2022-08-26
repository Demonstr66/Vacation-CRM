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
      <v-tabs v-model="activeTab">
        <v-tab
          v-for="(item, index) in viewers"
          :key="index"
          :to="{name: item.to}"
        >
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </div>


    <app-block-with-right-navbar
      :showBar.sync="showFiltersBar"
    >
      <template v-slot:main>
        <keep-alive>
          <router-view
            v-if="!!schedule"
            :exception="schedule.exception"
            :vacations="vacations"

            :year="schedule.year"

            @click="ask"

            @showFiltersBar="showFiltersBar = true"
          />
        </keep-alive>
      </template>
      <template v-slot:navbar>
        <v-card>
          <v-card-title>Фильтры</v-card-title>
          <v-card-text>
            <v-radio-group
              v-model="filters.type"
              label="Тип"
            >
              <v-radio
                v-for="(type, idx) in types"
                :key="idx"
                :label="type.text"
                :value="type.value"
              ></v-radio>
            </v-radio-group>
            <v-radio-group
              v-model="filters.status"
              label="Статус"
            >
              <v-radio
                v-for="(status, idx) in statuses"
                :key="idx"
                :label="status.text"
                :value="status.value"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </template>
    </app-block-with-right-navbar>

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
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";
import AppPopup from "@/components/AppPopup";

export default {
  name: 'ScheduleViewer',
  components: {AppPopup, AppBlockWithRightNavbar},
  mixins: [schedules, appReady],
  data: () => ({
    showFiltersBar: false,
    activeTab: null,

    schedule: null,
    filters: {
      type: 'all',
      status: 'all'
    },

    viewers: [
      {text: 'Список', value: 'list', to: 'Viewer1'},
      {text: 'Таймлайн', value: 'tl', to: 'Viewer2'},
      // {text: 'Календарь', value: 'fullCalendar', to: 'Viewer3'},
    ],
    types: [
      {text: 'Все', value: 'all'},
      {text: 'По заявлению', value: 'actually:false'},
      {text: 'Фактический', value: 'actually:true'}
    ],
    statuses: [
      {text: 'Все', value: 'all'},
      {text: 'На утверждении', value: 'status:1'},
      {text: 'Утверждённые', value: 'status:2'},
      {text: 'Отклонено', value: 'status:99'},
    ]
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  computed: {
    filtersFunctions() {
      const {filters} = this

      let functions = Object.values(filters).filter(filter => filter !== 'all')

      functions = functions.map(filter => {
        let [key, val] = filter.split(':')
        return (item) => item[key] !== undefined ? String(item[key]) === val : false
      })

      return functions
    },
    vacations() {
      const scheduleId = this.$route.params.id
      const filters = this.filtersFunctions

      let vacations = Object.values(this.$store.getters['vacations/getBySid'](scheduleId))

      if (filters.length) {
        vacations = vacations.filter(vacation => filters.every(f => f(vacation)))
      }

      vacations = vacations.filter(vacation => !vacation.isDraft())

      return vacations
    }
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) this.$router.push({name: 'Schedules'})
    },
    ask({item, type}) {
      switch (type) {
        case 'reject':
          this.onReject(item.id);
          break;
        case 'approve':
          this.onApprove(item.id);
          break;
        case 'cancel':
          this.onCancel(item.id);
          break;
      }
    },
    async onReject(id) {
      let result = await this.$refs.rejectPopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).reject(result)
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
        this.vacations.find(vacation => vacation.id === id).cancel(result)
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
    }
  }
}
</script>
