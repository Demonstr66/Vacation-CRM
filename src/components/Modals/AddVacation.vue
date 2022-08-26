<template>
  <BaseModal
    :result="dates"
    :show="show"
    :submitDisable="!valid"
    large
    title="Новый отпуск"
    @cancel="onCancel"
    @submit="onSubmit"
  >
    <v-row class="mt-2">
      <v-col cols="auto">
        <AddVacationCalendar
          v-if="calendar"
          v-model="dates"
          :actually="isActually"
          :current-user-vacations="currentUserVacations"
          :exception="exception"
          :uid="uid"

          :vacations="colleaguesVacations"
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
          <v-form ref="datesForm" v-model="valid">
            <v-text-field
              v-model="rangeLabel"
              :rules="[blankCheck]"
              hide-details
              label="Даты"
              prepend-icon="mdi-calendar"
              readonly
            ></v-text-field>
            <v-checkbox
              v-model="isActually"
              hide-details
              label="Фактический отпуск (без заявления)"
            >
            </v-checkbox>
          </v-form>
        </div>
        <div>
          <small>
            Выбранные даты будут будут отправлены на утверждение руководителю
            и будут видны для всех сотрудников сразу после отправки
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
          v-for="(lvl, index) in levels.filter(l => !l.hidden)"
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
        <div
          class="ml-2">
          <v-badge color="black" dot inline left>
            <span class="subtitle-1"> Рабочие дни </span>
          </v-badge>
        </div>
        <div
          class="ml-2">
          <v-badge color="error" dot inline left>
            <span class="subtitle-1"> Выходные дни </span>
          </v-badge>
        </div>
        <div
          class="ml-2">
          <v-badge color="#2196f3" dot inline left>
            <span class="subtitle-1"> Праздничные дни </span>
          </v-badge>
        </div>
        <div
          class="ml-2">
          <v-badge color="warning" dot inline left>
            <span class="subtitle-1"> Рабочие выходные дни </span>
          </v-badge>
        </div>
      </v-col>
    </v-row>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {dateDiff} from "@/plugins/utils";
import {dataMethods} from "@/mixins/dataHelper";
import {getChiefOf, myVacations} from "@/mixins/ComputedData";
import {normalizeDate} from "@/mixins/Filters";
import {VacationMethods} from "@/mixins/VacationMethods";
import {inputValidations} from "@/mixins/InputValidations";
import AddVacationCalendar from "@/components/Modals/AddVacationCalendar";
import {Vacation} from "@/plugins/Vacation";

export default {
  components: {
    AddVacationCalendar,
    BaseModal
  },
  mixins: [getChiefOf, dataMethods, myVacations, VacationMethods, normalizeDate, inputValidations],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    vacationId: {
      type: String,
      default: null
    },
  },
  data: () => ({
    calendar: false,
    valid: false,

    schedule: {},
    dates: {},
    isActually: false,

    currentUserVacations: [],
    colleaguesVacations: [],


    vacation: null,
    year: null,
    exception: {},
    uid: null,


    attributes: [],

    levels: [
      {id: 0, hidden: false, title: 'Руководители', key: 'chief', color: 'teal'},
      {id: 1, hidden: false, title: 'Коллеги по команде', key: 'team', color: 'green'},
      {id: 2, hidden: false, title: 'Коллеги по задачам', key: 'task', color: 'orange'},
    ],

  }),
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    },
    rangeLabel() {
      const {start, end} = this.dates
      if (!start) return ""

      const formattedStart = this.$moment(start).format('DD.MM.YYYY')
      const formattedEnd = this.$moment(end).format('DD.MM.YYYY')

      return `C ${formattedStart} по ${formattedEnd}`
    },
    rangeLength() {
      const {dates} = this

      return dates.start ? dateDiff(dates.start, dates.end) : 0
    },
  },

  methods: {
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

        this.isActually = currentVacation.actually
        this.vacation = currentVacation
      }

      this.schedule = schedule
      this.year = schedule.year
      this.exception = schedule.exception || []
      this.uid = uid

      //Отпуска коллег
      this.colleaguesVacations = scheduleVacations?.filter(v => v.uid !== uid)

      //Мои отпуска, кроме текущего
      this.currentUserVacations = scheduleVacations?.filter(v => v.uid === uid && v.id !==
        vacationId)

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

      vacation.actually = this.isActually

      vacation.start = this.$moment(this.dates.start).format('YYYY-MM-DD')
      vacation.end = this.$moment(this.dates.end).format('YYYY-MM-DD')
      vacation.days = this.rangeLength

      if (this.vacationId) {
        vacation.update({type: 'edit'})
      } else {
        vacation.create()
      }

      this.closeModal()
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.isShow = false
    },

    reset() {
      this.valid = false
      this.schedule = {}
      this.dates = {}
      this.isActually = false
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

<style lang="css">
.vc-bar {
  height: 5px;
}

</style>