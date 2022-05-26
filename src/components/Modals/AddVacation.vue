<template>
  <BaseModal
    :result="dates"
    :show="show"
    :submitDisable="!valid"
    large
    title="Новый отпуск"
    @cancel="onCancel"
    @reset="clear"
    @submit="onSubmit"
  >
    <v-row class="mt-2">
      <v-col cols="auto">
        <vc-date-picker
          v-model="dates"
          :attributes="attributes"
          :columns="2"
          :disabled-dates="disableDates"
          :max-date="minDate"
          :min-date="maxDate"
          :select-attribute="{highlight: {fillMode: 'light'}}"
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
                {{ attr.customData.name }}{{ attr.customData.tasks }}:
                {{ attr.customData.dates.start }} - {{ attr.customData.dates.end }}
              </popover-row>
            </div>
          </template>
        </vc-date-picker>
        <v-btn block color="primary" text @click="clearSelection">Сбросить</v-btn>


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
            v-model="dateRangeText"
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
            <span :style="`background-color: ${colors[lvl.id]}`" class="d-block vc-bar"></span>
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
import {myVacations} from "@/mixins/ComputedData";
import {defVacation} from "@/plugins/schema";
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'
import {vacationMethods} from "@/mixins/workspaceHelper";
import {normalizeDate} from "@/mixins/Filters";

export default {
  components: {
    BaseModal,
    PopoverRow
  },
  mixins: [dataMethods, myVacations, vacationMethods, normalizeDate],
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
    minDate: null,
    maxDate: null,
    dates: null,
    disableDates: [],
    isActually: false,
    existVacations: [],
    holidays: [],
    workdays: [],
    uid: null,

    attributes: [],

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
  computed: {
    valid() {
      return this.dates != null
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
  },
  methods: {
    clear() {
      this.minDate = null
      this.maxDate = null
      this.disableDates = []
      this.isActually = false
      this.clearSelection()
    },
    clearSelection() {
      this.dates = null
    },
    initialize() {
      const scheduleId = this.$route.params.id
      const uid = this.$route.params.uid
      const vacationId = this.vacationId
      const schedule = this.$store.getters['schedules/get'][scheduleId]
      const exception = schedule.exception

      this.holidays = exception ? exception.holidays : []
      this.workdays = exception ? exception.workdays : []

      let vacations = this.$store.getters['vacations/getBySid'](scheduleId)

      if (!!vacationId) {
        const vacation = vacations[vacationId]

        this.dates = {
          start: new Date(vacation.start),
          end: new Date(vacation.end),
        }
        this.vacation = vacation
        this.isActually = vacation.actually
      }

      this.uid = uid
      this.vacations = Object.values(vacations).filter(v => v.id !== vacationId)

      this.existVacations = Object.values(vacations).filter(v => v.id !== vacationId && v.uid === uid)

      this.updateDisableDates()
      this.updateAttributes()
      this.setCssVariable()
    },
    updateDisableDates() {
      const actually = this.isActually
      const existVacations = this.existVacations

      this.disableDates = existVacations
        .filter(x => x.actually === actually)
        .map(x => ({
          start: new Date(x.start),
          end: new Date(x.end)
        }))
    },
    updateAttributes() {
      let vacations = [...this.vacations]

      const uid = this.uid
      const user = {...this.$store.getters['users/getUserById'](uid)}

      vacations = vacations.filter(v => v.uid !== uid)

      vacations = vacations.map(v => {
        v.lvl = []
        v.tasks = []
        const vUser = {...this.$store.getters['users/getUserById'](v.uid)}

        v.displayName = vUser.displayName

        if (!!vUser.team && vUser.team === user.team) v.lvl.push(1)

        if (!user.tasks || user.tasks.length === 0) return v
        if (!vUser.tasks || vUser.tasks.length === 0) return v

        user.tasks.map(taskId => {
          const task = vUser.tasks.find(t => t == taskId)
          if (!task) return

          v.lvl.push(2)
          v.tasks.push(
            this.$store.getters['tasks/getTitle'](taskId)
          )
        })

        return v
      }).filter(v => v.lvl.length !== 0)


      let levels = this.levels.map(level => {
        level.dates = []
        const temp = vacations.filter(v => v.lvl.some(lvl => lvl === level.id))
        temp.map(v => level.dates.push({start: new Date(v.start), end: new Date(v.end)}))
        return level
      })

      this.attributes = [
        //Отпуска коллег
        ...levels.map(({id, hidden, dates}) => ({
          key: `vacation${hidden ? '-hidden' : ''}-${id}`,
          bar: {
            color: this.colors[id],
            style: {
              width: '100%'
            },
            class: hidden ? 'hiddenBar' : ``
          },
          dates: hidden ? null : dates,
          excludeDates: !hidden ? null : dates
        })),


        //Отпуска коллег popover
        ...vacations.map(v => {

          const dates = {
            start: v.start,
            end: v.end
          }

          return {
            key: `popover-${v.id}`,
            highlight: {
              color: this.colors[Math.min(v.lvl)],
              style: {
                display: 'none'
              },
            },
            popover: {
              visibility: 'hover'
            },
            customData: {
              name: v.displayName,
              tasks: v.tasks.length ? ' [' + v.tasks.join(', ') + ']' : '',
              dates
            },
            dates
          }
        }),

        //Мои отпуска
        ...this.existVacations
          .filter(v => v.actually === this.isActually)
          .map(v => {
            return {
              key: `myVacation-${v.id}`,
              highlight: {
                color: !v.actually ? 'green' : 'red',
                fillMode: 'light',
              },
              customData: {
                name: 'Мой отпуск',
                tasks: '',
                dates: {
                  start: v.start,
                  end: v.end
                }
              },
              popover: {
                visibility: 'hover',
                label: name
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
          dates: this.holidays.map(d => new Date(d))
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
          dates: this.workdays.map(d => new Date(d))
        },
      ]
    },
    setCssVariable() {
      let root = document.documentElement;
      root.style.setProperty('--min-h-day', "47px");
    },
    onSubmit() {
      const old = {...this.vacation}
      let history = []
      if (!!old.id && old.status === 3) {
        if (!!old.history) {
          history = [...old.history]
          delete old.history
        }
        old.isCurrent = false
        history.push({...old})
      }
      console.log(history)
      const vacation = defVacation({
        id: this.vacationId,
        createdAt: this.$moment().toISOString(),
        start: this.$moment(this.dates.start).format('YYYY-MM-DD'),
        end: this.$moment(this.dates.end).format('YYYY-MM-DD'),
        days: this.rangeLength,
        sid: this.$route.params.id,
        uid: this.uid,
        history: history.length !== 0 ? history : null,
        status: 1
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
  },
  watch: {
    show(val) {
      if (val) this.$nextTick(() => this.initialize())
    },
    isActually() {
      this.updateDisableDates()
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