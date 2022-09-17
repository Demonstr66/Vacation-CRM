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
          v-model="year"
          :items="years"
          :rules="[blankCheck]"
          label="Год"
          name="year"
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
            :disable="!!!year"
            icon="mdi-refresh"
            @click="updateExceptions(year)"
          >
            Загрузить даты по умолчанию
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!year"
            color="primary"
            icon="mdi-calendar-remove-outline"
            @click="deleteExceptionByType('holiday')"
          >
            Удалить все праздничные дни
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!year"
            color="warning"
            icon="mdi-calendar-remove-outline"
            @click="deleteExceptionByType('workday')"
          >
            Удалить все рабочие выхоные дни
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="!!!year"
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
        v-if="exceptionLoading || !!!year"
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
          locale="ru"
          v-model="selectedDate"
          :attributes="attributes"
          :columns="$vuetify.breakpoint.mdAndUp ? 2 : 1"
          :is-expanded="$vuetify.breakpoint.mobile"
          :max-date="maxDate"
          :min-date="minDate"
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
        <CalendarLegend/>
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
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {getShortDayLabel, normalizeDate} from "@/mixins/Filters";
import {loadDisDates} from "@/plugins/utils";
import ScheduleChips from "@/components/Modals/ScheduleChips";
import InputIcon from "@/components/InputIcon";
import {appReady} from "@/mixins/ComputedData";
import {Schedule} from "@/plugins/servises/Schedule";
import CalendarLegend from "@/components/CalendarLegend";


export default {
  mixins: [inputValidations, getShortDayLabel, normalizeDate, appReady],
  components: {
    CalendarLegend,
    InputIcon,
    ScheduleChips,
    IconBtnWithTip,
  },
  data: () => ({
    schedule: null,
    minDate: null,
    maxDate: null,
    year: null,
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
    attributes() {
      const {holidays, workdays, minDate, maxDate} = this

      return [
        {
          key: 'allDays',
          popover: {
            visibility: 'hover',
          },
          dates: {
            start: minDate,
            end: maxDate
          }
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
          dates: holidays
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
          dates: workdays
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
      let {exception} = this
      return this.getExceptionDatesByType(exception, 'holiday')
    },
    workdays() {
      let {exception} = this
      return this.getExceptionDatesByType(exception, 'workday')
    }

  },
  methods: {
    getExceptionDatesByType(exception, type) {
      exception = exception.filter(x => x.type === type)
      exception = exception.map(x => x.date)
      exception = exception.sort()

      return exception
    },
    initialize() {
      const id = this.$route.params.id

      if (!id) {
        return
      }

      const schedule = this.$store.getters['schedules/getById'](id)

      this.schedule = schedule
      this.title = schedule.title
      this.year = schedule.year
      this.exception = schedule.exception || []

      this.goto(`${schedule.year}-01-01`)
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
      this.exception = this.exception.filter(x => x.type !== type)
    },
    addToException(type, date) {
      date = this.$moment(date).format('YYYY-MM-DD')
      this.exception.push({date, type})
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
      this.$nextTick(() => {
        this.$refs.datePicker.focusDate(new Date(date))
      })
    },
    onSubmit() {
      this.$refs.form.validate()
      const {valid, schedule, exception, title, year} = this
      if (!valid) return

      let currentSchedule = new Schedule(schedule)

      const newData = {
        title,
        year,
        endDate: `${currentSchedule.year}-12-31`,
        startDate: `${currentSchedule.year}-01-01`,
        exception,
      }


      let res = !!currentSchedule.id
        ? currentSchedule.update({type: 'edit'}, newData)
        : currentSchedule.create(newData)

      res.then(() => this.$router.go(-1))
    }
  },
  watch: {
    appReady() {
      this.initialize()
    },
    year(val) {
      if (!this.schedule || this.schedule.year !== val) this.updateExceptions(val)
      this.minDate = new Date(`${val}-01-01`)
      this.maxDate = new Date(`${val}-12-31`)
      this.goto(`${val}-01-01`)
    }
  }
};
</script>