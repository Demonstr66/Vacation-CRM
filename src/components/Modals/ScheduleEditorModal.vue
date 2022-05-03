<template>
  <BaseModal
    :show="show"
    :submitDisable="!valid"
    :title="title"
    large
    @cancel="onCancel"
    @reset="reset"
    @submit="onSubmit"
  >
    <v-form ref="mainForm" v-model="valid">
      <v-row align="end" dense>
        <v-col>
          <v-text-field
            ref="name"
            v-model="schedule.title"
            :placeholder="defaultName"
            hide-details
            single-line
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            ref="year"
            v-model="schedule.year"
            :items="years"
            :rules="[blankCheck]"
            dense
            hide-details
            placeholder="Год"
            @change="onYearChange"
          ></v-select>
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-row v-if="!!schedule.year">
          <v-col cols="auto">
            <vc-date-picker
              ref="datePicker"
              v-model="selectedDate"
              :attributes="attributes"
              :max-date="new Date(`${schedule.year}-12-31`)"
              :min-date="new Date(`${schedule.year}-01-01`)"
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
                    @click="deleteException(day.attributesMap.holidays ? 'holidays':'workdays',
                      day.date)"
                  >
                    Удалить из исключений
                  </v-btn>
                  <v-btn v-else color="info" small text
                         @click="addToException(day.attributesMap.weekends ? 'workdays'
                           : 'holidays', day.date)">
                    Добавить в исключения
                  </v-btn>
                </div>
              </template>
            </vc-date-picker>
          </v-col>
          <v-col>
            <v-card-title class="justify-center">
              Исключения
              <div>
                <icon-btn-with-tip icon="mdi-refresh" @click="loadDisDates(schedule.year)">
                  Загрузить данные по умолчанию
                </icon-btn-with-tip>
              </div>
            </v-card-title>
            <v-chip
              v-for="(holiday, index) in schedule.exception.holidays"
              :key="'h'+index"
              class="ma-1"
              close
              color="info"
              label
              outlined
              @click="goto(holiday)"
              @click:close="deleteException('holidays', holiday)"
            >
                <span class="font-weight-bold mr-2">
                  {{ holiday | weekDayFilter }}
                </span>
              {{ holiday | dateFilter }}
            </v-chip>
            <v-divider></v-divider>
            <v-chip
              v-for="(workday, index) in schedule.exception.workdays"
              :key="'w'+index"
              class="ma-1"
              close
              color="warning"
              label
              link
              outlined
              @click="goto(workday)"
              @click:close="deleteException('workdays', workday)"
            >
              <span class="font-weight-bold mr-2">
                {{ workday | weekDayFilter }}
              </span>
              {{ workday | dateFilter }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-badge color="black" dot inline left>
                  <span class="subtitle-1"> Рабочие дни </span>
                </v-badge>
              </v-col>
              <v-col cols="auto">
                <v-badge color="error" dot inline left>
                  <span class="subtitle-1"> Выходные дни </span>
                </v-badge>
              </v-col>
              <v-col cols="auto">
                <v-badge color="#2196f3" dot inline left>
                  <span class="subtitle-1"> Праздничные дни </span>
                </v-badge>
              </v-col>
              <v-col cols="auto">
                <v-badge color="warning" dot inline left>
                  <span class="subtitle-1"> Рабочие выходные дни </span>
                </v-badge>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </v-expand-transition>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {defSchedule} from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";
import {dataMethods} from "@/mixins/dataHelper";
import IconBtnWithTip from "@/components/IconBtnWithTip";

const api = require('isdayoff')();

export default {
  mixins: [inputRules, dataMethods],
  components: {
    IconBtnWithTip,
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "График отпусков",
    },
    data: {}
  },
  data: () => ({
    schedule: defSchedule(),
    valid: false,
    selectedDate: null
  }),
  computed: {
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
          dates: this.schedule.exception.holidays ? this.schedule.exception.holidays.map(d => new Date(d)) : []
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
          dates: this.schedule.exception.workdays ? this.schedule.exception.workdays.map(d => new Date(d)) : []
        },
      ]
    },
    defaultName() {
      return `График отпусков на ${(new Date()).getFullYear()} год`
    },
    years() {
      const d = 4
      const today = new Date()
      const year = today.getFullYear()
      let years = []

      for (let i = -1 * d; i <= d; i++) years.push('' + (year + i))

      return years
    }
  },
  methods: {
    deleteException(type, data) {
      data = this.$moment(data).format('YYYY-MM-DD')
      this.schedule.exception[type] = this.schedule.exception[type].filter(x => x !== data)
    },
    addToException(type, data) {
      data = this.$moment(data).format('YYYY-MM-DD')
      this.schedule.exception[type].push(data)
    },
    async onYearChange() {
      const year = this.schedule.year
      if (!year) return

      await this.loadDisDates(year)

      this.$nextTick(() => {
        this.goto(`${year}-01-01`)
      })
    },
    async loadDisDates(year) {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      const stateDays = await api.period({
        start: new Date(startDate),
        end: new Date(endDate)
      })

      let holidays = []
      let workdays = []
      let day = this.$moment(new Date(startDate))
      stateDays.map((state) => {
        if (!!state && day.weekday() !== 5 && day.weekday() !== 6)
          holidays.push(this.$moment(day).format('YYYY-MM-DD'))

        if (!!!state && (day.weekday() === 5 || day.weekday() === 6))
          workdays.push(this.$moment(day).format('YYYY-MM-DD'))

        day.add(1, 'days')
      })
      this.schedule.exception = {holidays, workdays}
    },
    goto(date) {
      const dp = this.$refs.datePicker
      const to = new Date(date)

      dp.focusDate(to)
    },
    reset() {
      this.$refs.mainForm.reset()
      this.schedule = defSchedule()
    },
    onSubmit() {
      let schedule = {...this.schedule}
      schedule.exception = {...this.schedule.exception}
      if (!schedule.title) schedule.title = this.defaultName

      schedule.exception.holidays = [...schedule.exception.holidays]
      schedule.exception.workdays = [...schedule.exception.workdays]

      schedule.endDate = `${schedule.year}-12-31`
      schedule.startDate = `${schedule.year}-01-01`

      this.asyncCallback({
        callback: (data) => this.$store.dispatch(!!schedule.id ? 'schedules/update' :
          'schedules/create', data),
        data: schedule
      })
        .then(() => this.closeModal())
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
  watch: {
    show(val) {
      if (val) {
        if (this.data && this.data.id) {
          this.schedule = defSchedule(this.data)
        }
        let root = document.documentElement;
        root.style.setProperty('--min-h-day', "32px");
      }
    }
  },
  filters: {
    weekDayFilter(val) {
      const weekDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return weekDay[new Date(val).getDay()]
    },
    dateFilter(val) {
      return val.split('-').reverse().join('.')
    }
  }
};
</script>

<style lang="scss">
//.vc-day {
//  min-height: 32px !important;
//}
</style>