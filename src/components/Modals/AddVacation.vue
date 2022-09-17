<template>
  <BaseModal
    :result="dates"
    :show="show"
    :submitDisable="!dates"
    large
    title="Новый отпуск"
    @cancel="close(false)"
    @submit="onSubmit"
  >
    <v-row class="mt-2">
      <v-col cols="auto">
        <AddVacationCalendar
          v-if="calendar"
          v-model="dates"

          :current-user-vacations="currentUserVacations"
          :exception="exception"

          :uid="uid"
          :year="year"
        />


      </v-col>
      <v-col class="d-flex flex-column justify-space-between">
        <div>
          <div class="d-flex align-end">
            <span class="title">Дней выбрано:</span>
            <v-chip :color="rangeLength === 0 ? '' : 'success'" class="ml-4" label outlined>
              <span class="font-weight-bold"> {{ rangeLength }}</span>
            </v-chip>
          </div>
          <v-text-field
            v-model="rangeLabel"
            hide-details
            label="Даты"
            prepend-icon="mdi-calendar"
            readonly
          ></v-text-field>
          <v-textarea
            v-model="comment"
            hide-details
            no-resize
            label="Комментарий"
          >
          </v-textarea>
        </div>
        <div>
          <small>
            Выбранные Вами даты будут видны другим пользователям только после отправки на
            утверждение
          </small>
          <v-divider/>
          <small class="red--text">
            * Обратите внимание, что окончательно даты будут зарезервированы
            за Вами только после утверждения руководителем
          </small>
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="d-flex flex-row justify-start" cols="12">
        <div
          v-for="(lvl, index) in levels"
          :key="index"
          class="ml-2"
        >
          <div class="mx-1 d-inline-block" style="width: 12px !important;">
            <span :style="`background-color: ${lvl.color}`" class="d-block vc-bar"></span>
          </div>
          <span style="width: fit-content;">{{ lvl.title }}</span>
        </div>
      </v-col>
      <v-col class="d-flex flex-row justify-start" cols="12">
        <calendar-legend/>
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {dateDiff} from "@/plugins/utils";
import AddVacationCalendar from "@/components/Modals/AddVacationCalendar";
import {Vacation} from "@/plugins/servises/Vacation";
import CalendarLegend from "@/components/CalendarLegend";

export default {
  ModalController: null,
  components: {
    CalendarLegend,
    AddVacationCalendar,
    BaseModal
  },
  data: () => ({
    vacationId: undefined,
    show: false,

    calendar: false,

    schedule: {},
    dates: null,
    comment: "",

    currentUserVacations: [],
    colleaguesVacations: [],


    vacation: null,
    year: null,
    exception: {},
    uid: null,

    attributes: [],

    levels: [
      {id: 2, hidden: false, title: 'Руководители', key: 'chief', color: 'orange'},
      {id: 1, hidden: false, title: 'Коллеги по команде', key: 'team', color: 'green'},
      {id: 0, hidden: false, title: 'Коллеги по задачам', key: 'task', color: 'blue'},
    ],

  }),
  computed: {
    rangeLabel() {
      const {dates} = this
      if (!dates) return ""

      const formattedStart = this.$moment(dates.start).format('DD.MM.YYYY')
      const formattedEnd = this.$moment(dates.end).format('DD.MM.YYYY')

      return `C ${formattedStart} по ${formattedEnd}`

    },
    rangeLength() {
      const {dates} = this

      if (!dates) return 0

      return dateDiff(dates.start, dates.end)
    }
  },
  methods: {
    open(vacationId) {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      this.vacationId = vacationId
      this.show = true
      this.$options.ModalController = {resolve, reject}
      return result
    },
    close(val) {
      this.show = false
      this.$options.ModalController.resolve(val)
    },
    initialize() {
      const {id, uid} = this.$route.params
      const schedule = this.$store.getters['schedules/getById'](id)
      const scheduleVacations = this.$store.getters['vacations/getBySid'](id)

      const {vacationId} = this

      if (!!vacationId) {
        const currentVacation = scheduleVacations.find(v => v.id === vacationId)

        this.dates = {
          start: new Date(currentVacation.start),
          end: new Date(currentVacation.end),
        }

        this.vacation = currentVacation
        this.comment = currentVacation.comment
      }

      this.schedule = schedule
      this.year = schedule.year
      this.exception = schedule.exception || []
      this.uid = uid

      //Мои отпуска, кроме текущего
      this.currentUserVacations = scheduleVacations
        .filter(v => v.uid === uid && v.id !== vacationId)
        .filter(v => !v.isRejected())

      this.$nextTick(() => {
        this.calendar = true
      })
    },

    onSubmit() {
      let vacation = this.vacationId
        ? new Vacation(this.vacation)
        : new Vacation({
          uid: this.uid,
          sid: this.schedule.id,
        })

      vacation.comment = this.comment
      vacation.start = this.$moment(this.dates.start).format('YYYY-MM-DD')
      vacation.end = this.$moment(this.dates.end).format('YYYY-MM-DD')
      vacation.days = this.rangeLength

      if (this.vacationId) {
        vacation.edit()
      } else {
        vacation.create()
      }


      this.close(true)
    },
    reset() {
      this.vacationId = undefined
      this.schedule = {}
      this.dates = null
      this.comment = ""
      this.calendar = false
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => {
        if (val) {
          this.initialize()
        } else {
          this.reset()
        }
      })

    }
  }
};
</script>