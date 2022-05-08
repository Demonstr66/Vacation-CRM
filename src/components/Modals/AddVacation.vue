<template>
  <BaseModal
    :result="dates"
    :show="show"
    :submitDisable="!valid"
    large
    title="Новый отпуск"
    @cancel="onCancel"
    @reset="reset"
    @submit="onSubmit"
  >
    <v-row class="mt-2">
      <v-col cols="auto">
        <vc-date-picker
          v-model="dates"
          :attributes="attributes"
          :columns="2"
          :disabled-dates="disableDates"
          :max-date="new Date(schedule.endDate)"
          :min-date="new Date(schedule.startDate)"
          :select-attribute="selectAttributes"
          is-range
        >
          <template v-slot:day-popover="{dayTitle, attributes}">
            <div style="max-width: 400px">
              <div class="text-xs text-gray-300 font-semibold text-center">
                {{ dayTitle }}
              </div>
              <popover-row
                v-for="attr in attributes"
                :key="attr.key"
                :attribute="attr"
              >
                {{ attr.customData.title }}
              </popover-row>
            </div>
          </template>
        </vc-date-picker>
        <v-btn block color="primary" text @click="reset">Сбросить</v-btn>

      </v-col>
      <v-col class="d-flex flex-column justify-space-between">
        <div>
          <div class="d-flex align-end">
            <span class="title">Дней выбрано:</span>
            <v-chip class="ml-4" :color="rangeLength === 0 ? '' : 'success'" label outlined>
              <span class="font-weight-bold"> {{ rangeLength }}</span>
            </v-chip>
          </div>
          <v-text-field
            v-model="dateRangeText"
            hide-details
            label="Даты"
            prepend-icon="mdi-calendar"
            readonly
          ></v-text-field>
          <v-checkbox
            v-model="vacation.actually"
            hide-details
            label="Фактический отпуск (без заявления)"
          >

          </v-checkbox>
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

    <v-row>
      <v-col
        v-for="(lvl, index) in levels.filter(l => !l.hidden)"
        :key="index"
        cols="auto"
      >
        <div class="d-flex align-center">
          <div class="mx-1" style="width: 12px !important;">
            <span :style="`background-color: ${colors[lvl.id]}`" class="d-block vc-bar"></span>
          </div>
          <span style="width: fit-content;">{{ lvl.title }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
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
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {dateDiff} from "@/plugins/utils";
import {dataMethods} from "@/mixins/dataHelper";
import {currentUID, myVacations} from "@/mixins/ComputedData";
import {defVacation} from "@/plugins/schema";
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'
import {vacationMethods} from "@/mixins/workspaceHelper";

export default {
  components: {
    BaseModal,
    PopoverRow
  },
  mixins: [dataMethods, currentUID, myVacations, vacationMethods],
  props: {
    color: {
      type: String,
      default: "primary",
    },
    show: {
      type: Boolean,
      required: true
    },
    schedule: {
      type: Object,
      required: true
    },
    vacation: {
      type: Object,
      default: defVacation()
    },
    existVacations: {}
  },
  data: () => ({
    dates: null,
    vacations: [
      {
        id: 1, name: 'Начальник', lvl: 0, dates: [
          {
            start: new Date('2022-05-01'),
            end: new Date('2022-05-10'),
          }, {
            start: new Date('2022-06-01'),
            end: new Date('2022-06-10'),
          }
        ]
      }, {
        id: 2, name: 'Тимлид', lvl: 1, dates: [
          {
            start: new Date('2022-05-04'),
            end: new Date('2022-05-15'),
          }
        ]
      }, {
        id: 3, name: 'Коллега 1', lvl: 2, dates: [
          {
            start: new Date('2022-05-10'),
            end: new Date('2022-05-15'),
          }
        ]
      }, {
        id: 4, name: 'Коллега 2', lvl: 2, dates: [
          {
            start: new Date('2022-06-10'),
            end: new Date('2022-06-15'),
          },
          {
            start: new Date('2022-05-10'),
            end: new Date('2022-05-11'),
          }
        ]
      }
    ],
    levels: [
      {id: 0, hidden: true},
      {id: 0, hidden: false, title: 'Руководители'},
      {id: 1, hidden: true},
      {id: 1, hidden: false, title: 'Коллеги по команде'},
      {id: 2, hidden: true},
      {id: 2, hidden: false, title: 'Коллеги по задачам'},
    ],
    colors: [
      'gray',
      'purple',
      'teal',
      'green',
      'orange',
      'yellow',
      'blue',
      'indigo',
      'pink'
    ],
  }),
  created() {
    this.initialize()
  },
  computed: {
    valid() {
      return this.dates != null
    },
    disableDates() {
      return Object.values(this.existVacations)
        .filter(x => x.actually === !!this.vacation.actually)
        .map(x => ({
          start: new Date(x.start),
          end: new Date(x.end)
        }))
    },
    dateRangeText() {
      if (!this.dates) return ""
      const start = this.$moment(this.dates.start).format('DD.MM.YYYY')

      const end = this.$moment(this.dates.end).format('DD.MM.YYYY')
      return `C ${start} по ${end}`
    },
    rangeLength() {
      if (!this.dates) return 0;

      return dateDiff(this.dates);
    },
    selectAttributes() {
      return {
        highlight: {
          fillMode: 'light'
        }
      }
    },
    attributes() {
      return [
        //Отпуска коллег
        ...this.levels.map(({id, hidden}) => {
          const temp = [this.vacations.filter(v => v.lvl === id).reduce((x, y) => {
            if (x.dates) return [...x.dates, ...y.dates]
            return [...x, ...y.dates]
          })].map(x => x.dates ? x.dates : x)[0]

          return {
            key: `vacation${hidden ? '-hidden' : ''}-${id}`,
            bar: {
              color: this.colors[id],
              style: {
                width: '100%'
              },
              class: hidden ? 'hiddenBar' : ``
            },
            dates: hidden ? {} : temp,
            excludeDates: !hidden ? null : temp
          }
        }),
        //Отпуска коллег popover
        ...this.vacations.map(v => {
          return {
            key: `popover-${v.id}`,
            highlight: {
              color: this.colors[v.lvl],
              style: {
                display: 'none'
              },
            },
            popover: {
              visibility: 'hover'
            },
            customData: {
              lvl: v.lvl,
              title: v.name
            },
            dates: v.dates

          }
        }),
        //Мои отпуска
        ...Object.values(this.existVacations)
          .filter(v => v.actually === !!this.vacation.actually)
          .map(v => {
            const title =
              `Мой отпуск: ${this.$options.filters.dateFilter(v.start)} - ${this.$options.filters.dateFilter(v.end)}`
            return {
              key: `myVocation-${v.id}`,
              highlight: {
                color: !v.actually ? 'green' : 'red',
                fillMode: 'light',
              },
              customData: {
                title
              },
              popover: {
                label: title
              },
              dates: {
                start: v.start,
                end: v.end
              }
            }
          }),
        {
          key: 'weekends',
          highlight: {
            style: {
              display: 'none'
            },
            fillMode: 'outline',
            contentStyle: {
              color: 'red'
            },
            contentClass: 'myClass'
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
          dates: this.schedule.exception ? this.schedule.exception.holidays ?
            this.schedule.exception.holidays.map(d => new Date(d)) : [] : []
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
          dates: this.schedule.exception ? this.schedule.exception.workdays ?
            this.schedule.exception.workdays.map(d => new Date(d)) : [] : []
        },
      ]
    },
  },
  methods: {
    initialize() {
      if (this.vacation.id) {
        this.dates = {
          start: new Date(this.vacation.start),
          end: new Date(this.vacation.end),
        }
      }

      let root = document.documentElement;
      root.style.setProperty('--min-h-day', "47px");
    },
    onSubmit() {
      let vacation = defVacation(this.vacation, {
        start: this.$moment(this.dates.start).format('YYYY-MM-DD'),
        end: this.$moment(this.dates.end).format('YYYY-MM-DD'),
        days: this.rangeLength,
        sid: this.schedule.id,
        uid: this.currentUID
      })

      this.mixSaveVacation(!!!vacation.id, vacation)

      this.closeModal()
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
    reset() {
      this.dates = null;
      this.vacation.actually = false
    },
  },
  filters: {
    weekDayFilter(val) {
      const weekDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return weekDay[new Date(val).getDay()]
    },
    dateFilter(val) {
      return val.split('-').reverse().join('.')
    },
    lowerCase(val) {
      return val.toLowerCase()
    }
  }
};
</script>

<style lang="css">
:root {
  --min-h-day: 47px;
}

.vc-day {
  min-height: var(--min-h-day) !important;
}

.vc-bars {
  transform: translateY(50%);
  width: 100% !important;
  flex-direction: column !important;
}

.vc-bar {
  height: 5px;
}

.hiddenBar {
  opacity: 0;
}

.vc-day-popover-row-content {
  align-items: start !important;
}

.vc-day-popover-row {
  align-items: start !important;
}

.vc-day-popover-row-indicator {
  margin-top: 10px;
}

.is-disabled {
  font-style: italic !important;
}
</style>