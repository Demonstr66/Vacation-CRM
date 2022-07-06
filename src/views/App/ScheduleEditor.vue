<template>
  <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
    <div class="d-flex">
      <v-btn
        color="info"
        small
        text
        @click="$router.go(-1)"
      >
        Назад
      </v-btn>
      <v-spacer></v-spacer>
    </div>

    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-model="title"
          :rules="[blankCheck]"
          label="Название графика"
          name="title"
        >
          <template v-slot:prepend>
            <input-icon>mdi-calendar</input-icon>
          </template>
        </v-text-field
        >
      </v-col>
      <v-col>
        <v-select
          v-model="schedule.year"
          :items="years"
          :rules="[blankCheck]"
          label="Год"
          name="year"
          @change="onYearChange"
        >
          <template v-slot:prepend>
            <input-icon>mdi-calendar</input-icon>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-title class="justify-center">
          Исключения
        </v-card-title>
        <v-divider></v-divider>
        <div class="text-right">
          <icon-btn-with-tip
            :disable="!!!schedule.year"
            icon="mdi-refresh"
            @click="updateExceptions(schedule.year)"
          >
            Загрузить даты по умолчанию
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!schedule.year"
            color="primary"
            icon="mdi-calendar-remove-outline"
            @click="deleteExceptionByType('holiday')"
          >
            Удалить все праздничные дни
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!schedule.year"
            color="warning"
            icon="mdi-calendar-remove-outline"
            @click="deleteExceptionByType('workday')"
          >
            Удалить все рабочие выхоные дни
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!schedule.year"
            color="error"
            icon="mdi-calendar-remove-outline"
            @click="deleteException()"
          >
            Удалить все исключения
          </icon-btn-with-tip>
        </div>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row no-gutters style="position: relative">
      <v-overlay
        v-if="exceptionLoading || !!!schedule.year"
        :color="exceptionLoading ? 'info' : 'secondary'"
        absolute
        opacity="0.2"
      >
        <v-progress-circular
          v-if="exceptionLoading"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <v-col cols="12" order="1" order-sm="0" sm="auto">
        <vc-date-picker
          ref="datePicker"
          v-model="selectedDate"
          :attributes="attributes"
          :columns="$vuetify.breakpoint.mdAndUp ? 2 : 1"
          :is-expanded="$vuetify.breakpoint.mobile"
          :max-date="minAndMaxDates[1]"
          :min-date="minAndMaxDates[0]"
        >
          <template v-slot:day-popover="{day, attributes, dayTitle }">
            <div>
              {{ dayTitle }}
            </div>
            <div>
              <v-btn
                v-if="!!day.attributesMap.workdays || !!day.attributesMap.holidays"
                color="info"
                small
                text
                @click="deleteException(day.date)"
              >
                Удалить из исключений
              </v-btn>
              <v-btn
                v-else
                color="info"
                small
                text
                @click="addToException(day.attributesMap.weekends
                  ? 'workday'
                  : 'holiday', day.date)"
              >
                Добавить в исключения
              </v-btn>
            </div>
          </template>

        </vc-date-picker>
        <div
          class="d-flex flex-wrap align-start justify-space-between mt-2"
          style="max-width: fit-content"
        >
          <v-badge color="black" dot inline left>
            <span class="subtitle-1"> Рабочие дни </span>
          </v-badge>
          <v-badge color="error" dot inline left>
            <span class="subtitle-1"> Выходные дни </span>
          </v-badge>
          <v-badge color="#2196f3" dot inline left>
            <span class="subtitle-1"> Праздничные дни </span>
          </v-badge>
          <v-badge color="warning" dot inline left>
            <span class="subtitle-1"> Рабочие выходные дни </span>
          </v-badge>
        </div>
      </v-col>
      <v-col order="0" order-sm="1">
        <div
          v-if="!holidays.length && !workdays.length"
          class="text-center"
        >
          Нет исключений
        </div>
        <div v-else>
          <schedule-chips
            v-if="holidays.length"
            :items="holidays"
            color="info"
            @click="goto"
            @close="deleteException"
          />
          <schedule-chips
            v-if="workdays.length"
            :items="workdays"
            color="warning"
            @click="goto"
            @close="deleteException"
          />
        </div>
      </v-col>
    </v-row>

    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        text
        type="submit"
      >
        Сохранить
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import {defSchedule} from "@/plugins/schema";
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {getShortDayLabel, normalizeDate} from "@/mixins/Filters";
import {loadDisDates} from "@/plugins/utils";
import ScheduleChips from "@/components/Modals/ScheduleChips";
import {ScheduleMethods} from "@/mixins/ScheduleMethods";
import InputIcon from "@/components/InputIcon";
import {appReady} from "@/mixins/ComputedData";


export default {
  mixins: [inputValidations, getShortDayLabel, normalizeDate, ScheduleMethods, appReady],
  components: {
    InputIcon,
    ScheduleChips,
    IconBtnWithTip,
  },
  data: () => ({
    schedule: defSchedule(),
    title: "",
    exception: [],
    valid: false,
    selectedDate: null,
    exceptionLoading: false
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  computed: {
    minAndMaxDates() {
      const year = this.schedule.year
      return [new Date(`${year}-01-01`), new Date(`${year}-12-31`)]
    },
    attributes() {
      return [
        {
          key: 'allDays',
          popover: {
            visibility: 'hover',
          },
          dates: {}
        },
        {
          key: 'weekends',
          highlight: {
            style: {
              display: 'none'
            },
            fillMode: 'outline',
            contentStyle: {
              color: 'red'
            }
          },
          dates: {
            weekdays: [1, 7]
          }
        },
        {
          key: 'holidays',
          highlight: {
            style: {
              display: 'none'
            },
            fillMode: 'outline',
            contentStyle: {
              color: '#2196f3'
            }
          },
          dates: this.holidays
        },
        {
          key: 'workdays',
          highlight: {
            style: {
              display: 'none'
            },
            fillMode: 'outline',
            contentStyle: {
              color: '#fb8c00'
            }
          },
          dates: this.workdays
        },
      ]
    },
    years() {
      const d = 4
      let years = []
      for (let i = -1 * d; i <= d; i++) years.push('' + ((new Date()).getFullYear() + i))
      return years
    },
    holidays() {
      let exception = this.exception
      exception = exception.filter(x => x.type === 'holiday')
      exception = exception.map(x => x.date)
      exception = exception.sort()

      return exception
    },
    workdays() {
      let exception = this.exception
      exception = exception.filter(x => x.type === 'workday')
      exception = exception.map(x => x.date)
      exception = exception.sort()

      return exception
    }
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      if (id) {
        const schedule = this.$store.getters['schedules/getById'](id)

        if (!schedule) this.$router.push({name: 'Schedules'})
        else {
          this.schedule = Object.assign({}, schedule)
          this.title = schedule.title
          this.exception = [...schedule.exception || []]
          this.$nextTick(() => {
            this.goto(`${schedule.year}-01-01`)
          })
        }
      }
    },
    deleteException(exception) {
      if (exception === undefined) {
        this.exception = []
        return
      }
      const date = this.$moment(exception).format('YYYY-MM-DD')
      const exceptions = this.exception.filter(x => x.date !== date)
      this.exception = [...exceptions]
    },
    deleteExceptionByType(type) {
      this.exception = this.schedule.exception.filter(x => x.type !== type)
    },
    addToException(type, date) {
      date = this.$moment(date).format('YYYY-MM-DD')
      this.exception.push({date, type})
    },
    onYearChange() {
      const year = this.schedule.year

      this.updateExceptions(year)
      this.$nextTick(() => {
        this.goto(`${year}-01-01`)
      })
    },
    updateExceptions(year) {
      this.exceptionLoading = true
      loadDisDates(year)
        .then((res) => this.exception = res)
        .finally(() => {
          this.exceptionLoading = false
        })
    },
    goto(date) {
      this.$refs.datePicker.focusDate(new Date(date))
    },
    onSubmit() {
      this.$refs.form.validate()
      if (!this.valid) return

      let schedule = {...this.schedule}

      schedule.title = this.title
      schedule.endDate = `${schedule.year}-12-31`
      schedule.startDate = `${schedule.year}-01-01`
      schedule.exception = [...this.exception]

      const method = !!!schedule.id ? this.createSchedule : this.updateSchedule

      method(schedule)
        .then((res) => this.$router.go(-1))
        .catch(() => {})
    }
  },
  watch: {
    appReady() {
      this.initialize()
    }
  }
};
</script>