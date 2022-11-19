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
    <app-block-with-right-navbar>
      <template #main>
        <app-base-sheet>
          <v-sparkline
            :labels="$options.MONTHS"
            :value="daysByMonth"
            :gradient="['#f72047', '#ffd200', '#0f0']"
            auto-draw
            color="info"
            show-labels
            line-width="2"
            label-size="5"
            padding="8"
            smooth="16"
          >
          </v-sparkline>
        </app-base-sheet>
      </template>
      <template #navbar>
        <app-base-sheet>
          <v-btn color="primary" outlined block @click="onExport">
            Экспорт
          </v-btn>
        </app-base-sheet>
      </template>
    </app-block-with-right-navbar>
  </div>
</template>

<script>
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";
import {appReady} from "@/mixins/ComputedData";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import {dateToFileFormat} from "@/plugins/utils";
import * as XLSX from "xlsx";

export default {
  name: "ScheduleStatistic",
  MONTHS: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август',
    'сентябрь', 'октябрь', 'ноябрь', 'декабрь',],
  mixins: [appReady],
  components: {AppBaseSheet, AppBlockWithRightNavbar},
  data: () => ({
    schedule: {},
    vacations: [],
    daysByMonth: []
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.$store.getters['schedules/getById'](id)
      this.vacations = this.$store.getters['vacations/getBySid'](id)
      this.daysByMonth = Object.values(this.daysByMonths())
    },
    daysByMonths() {
      const stat = {}
      for (let month in this.$options.MONTHS) {
        stat[month] = 0
      }

      this.vacations.forEach(({days, start, end}) => {
        const startMonth = this.$moment(start).month()
        const endMonth = this.$moment(end).month()

        if (startMonth === endMonth) {
          stat[startMonth] += days
        } else {
          let day = this.$moment(start)
          stat[day.month()] += 1

          do {
            day.add(1, 'days')
            stat[day.month()] += 1
          } while (day.format('YYYY-MM-DD') !== end)
        }
      })

      return stat
    },
    onExport() {
      let header = ['ФИО', 'c', 'по']
      let rows = []
      this.vacations.forEach(vacation => {
        if (!vacation.approved) return
        
        let fullName = this.$store.getters['users/getUserById'](vacation.uid).fullName
        rows.push([fullName, this.$moment(vacation.start).format('DD.MM.YYYY'),
          this.$moment(vacation.end).format('DD.MM.YYYY')])
      })

      rows.sort()
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.aoa_to_sheet([header, ...rows])
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${this.schedule.title}.xlsx`);
    }
  },
  watch: {
    appReady() {
      this.initialize()
    },
  }
}
</script>

<style lang="scss">
.custom-label {
  //transform: rotate(-45deg);
}
</style>