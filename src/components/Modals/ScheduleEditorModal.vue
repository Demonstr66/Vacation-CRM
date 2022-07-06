<template>
  <BaseModal
    :show="show"
    :submitDisable="!valid"
    :title="title"
    large
    @cancel="onCancel"
    @submit="onSubmit"
  >
    <v-form ref="form" v-model="valid">
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
          <v-col cols="12">
            <v-card-title class="justify-center">
              Исключения
            </v-card-title>
            <v-divider></v-divider>
            <div class="text-right">
              <icon-btn-with-tip
                icon="mdi-refresh"
                @click="updateExceptions(schedule.year)"
              >
                Загрузить даты по умолчанию
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="primary"
                icon="mdi-calendar-remove-outline"
                @click="deleteExceptionByType('holiday')"
              >
                Удалить все праздничные дни
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="warning"
                icon="mdi-calendar-remove-outline"
                @click="deleteExceptionByType('workday')"
              >
                Удалить все рабочие выхоные дни
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="error"
                icon="mdi-calendar-remove-outline"
                @click="deleteException()"
              >
                Удалить все исключения
              </icon-btn-with-tip>
            </div>
            <v-divider></v-divider>
          </v-col>
          <v-row>
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
                           @click="addToException(day.attributesMap.weekends ? 'workday'
                           : 'holiday', day.date)">
                      Добавить в исключения
                    </v-btn>
                  </div>
                </template>

              </vc-date-picker>
              <div class="d-flex flex-column align-start mt-2">
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
            <v-col style="position: relative">
              <v-overlay v-if="exceptionLoading" absolute color="info" opacity="0.2">
                <v-progress-circular indeterminate size="32" width="4"></v-progress-circular>
              </v-overlay>
              <div
                v-if="!holidays.length && !workdays.length"
                class="text-center"
              >
                Нет исключений
              </div>
              <div v-else>
                <schedule-chips
                  :items="holidays"
                  color="info"
                  @click="goto"
                  @close="deleteException"
                />
                <schedule-chips
                  :items="workdays"
                  color="warning"
                  @click="goto"
                  @close="deleteException"
                />
              </div>
            </v-col>
          </v-row>
        </v-row>
      </v-expand-transition>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {defSchedule} from "@/plugins/schema";
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {getShortDayLabel, normalizeDate} from "@/mixins/Filters";
import {loadDisDates} from "@/plugins/utils";
import ScheduleChips from "@/components/Modals/ScheduleChips";
import {ScheduleMethods} from "@/mixins/ScheduleMethods";


export default {
  mixins: [inputValidations, getShortDayLabel, normalizeDate, ScheduleMethods],
  components: {
    ScheduleChips,
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
    exception: [],
    valid: false,
    selectedDate: null,
    exceptionLoading: false
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
    defaultName() {
      return `График отпусков на ${this.schedule && this.schedule.year ||
      (new Date()).getFullYear()} год`
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
    async onYearChange() {
      const year = this.schedule.year
      await this.updateExceptions(year)

      this.$nextTick(() => {
        this.goto(`${year}-01-01`)
      })
    },
    async updateExceptions(year) {
      this.exceptionLoading = true
      this.exception = await loadDisDates(year)
      this.exceptionLoading = false
    },
    goto(date) {
      this.$refs.datePicker.focusDate(new Date(date))
    },
    onSubmit() {
      let schedule = {...this.schedule}
      if (!schedule.title) schedule.title = this.defaultName

      schedule.endDate = `${schedule.year}-12-31`
      schedule.startDate = `${schedule.year}-01-01`
      schedule.exception = [...this.exception]

      const method = !!!schedule.id ? this.createSchedule : this.updateSchedule

      method(schedule)
        .then(() => this.closeModal())
        .catch(er => {
        })
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");

      this.$nextTick(() => {
        this.$refs.form.reset()
        this.selectedDate = null
        this.exception = []
        this.exceptionLoading = false
        this.schedule = defSchedule()
      })
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.schedule = {...this.data}
        this.exception = [...this.data.exception || []]

        this.$refs.form.reset()
        this.$nextTick(() => {
          if (this.data.year) this.goto(`${this.data.year}-01-01`)
        })
        //установка высоты трок календаря
        document.documentElement.style.setProperty('--min-h-day', "32px");
      }
    }
  }
};
</script>