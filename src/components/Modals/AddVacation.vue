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
          :max-date="maxDate"
          :min-date="minDate"
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
          <v-form v-model="valid" ref="datesForm">
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
import {dateDiff, getCalendarAttributes} from "@/plugins/utils";
import {dataMethods} from "@/mixins/dataHelper";
import {getChiefOf, myVacations} from "@/mixins/ComputedData";
import {defVacation} from "@/plugins/schema";
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'
import {normalizeDate} from "@/mixins/Filters";
import {VacationMethods} from "@/mixins/VacationMethods";
import {inputValidations} from "@/mixins/InputValidations";

export default {
  components: {
    BaseModal,
    PopoverRow
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
    valid: false,

    vacation: null,
    minDate: null,
    maxDate: null,
    dates: null,
    isActually: false,

    holidays: [],
    workdays: [],
    uid: null,

    userVacations: [],
    colleaguesVacations: [],

    attributes: [],

    levels: [
      {id: 0, hidden: false, title: 'Руководители', key: 'chief'},
      {id: 1, hidden: false, title: 'Коллеги по команде', key: 'team'},
      {id: 2, hidden: false, title: 'Коллеги по задачам', key: 'task'},
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
    rangeLabel() {
      if (!this.dates) return ""
      const {start, end} = this.dates
      const formattedStart = this.$moment(start).format('DD.MM.YYYY')
      const formattedEnd = this.$moment(end).format('DD.MM.YYYY')

      return `C ${formattedStart} по ${formattedEnd}`
    },
    rangeLength() {
      if (!this.dates) return 0;
      const {start, end} = this.dates

      return dateDiff(start, end);
    },
    disableDates() {
      const {isActually, userVacations} = this
      const filteredVacations = userVacations.filter(x => x.actually === isActually)

      if (filteredVacations.length === 0) {
        return null
      }

      return filteredVacations.map(x => ({
          start: new Date(x.start),
          end: new Date(x.end)
        }))
    },
  },
  methods: {
    initialize() {
      const {id, uid} = this.$route.params
      const schedule = this.$store.getters['schedules/getById'](id)
      const existingVacations = this.$store.getters['vacations/getBySid'](id)

      if (!schedule || !uid) {
        return
      }

      const {exception, year} = schedule


      if (!!this.vacationId) {
        const currentVacation = existingVacations[this.vacationId]

        this.dates = {
          start: new Date(currentVacation.start),
          end: new Date(currentVacation.end),
        }

        this.isActually = currentVacation.actually
        this.vacation = currentVacation
      }

      this.minDate = new Date(`${year}-01-01`)
      this.maxDate = new Date(`${year}-12-31`)

      this.holidays = exception?.filter(x => x.type === 'holiday') || []
      this.workdays = exception?.filter(x => x.type === 'workday') || []

      this.uid = uid

      const allOtherVacations = Object.values(existingVacations || {})//.filter(v => v.id !== id)

      this.colleaguesVacations = allOtherVacations.filter(v =>  v.uid !== uid)
      this.userVacations = allOtherVacations.filter(v =>  v.uid === uid && v.id !== this.vacationId)

      this.updateAttributes()
    },
    clear() {
      this.minDate = null
      this.maxDate = null
      this.isActually = false
      this.clearSelection()
    },
    clearSelection() {
      this.dates = null
    },
    updateAttributes() {
      const {colleaguesVacations, userVacations, holidays, workdays} = this

      const user = this.$store.getters['users/getUserById'](this.uid)
      let attributes = []

      let chiefs = this.getChiefOf(this.uid)

      let normalizedUsersVacations = colleaguesVacations.map(v => {
        v.lvl = []

        const vacationOwner = this.$store.getters['users/getUserById'](v.uid)
        v.displayName = vacationOwner.displayName


        if (chiefs.indexOf(vacationOwner.uid))
          v.lvl.push(this.levels.find(lvl => lvl.key === 'chief')['id'])
        else if (!!vacationOwner.team && vacationOwner.team === user.team)
          v.lvl.push(this.levels.find(lvl => lvl.key === 'team')['id'])

        if (!user.tasks || user.tasks.length === 0) return v
        if (!vacationOwner.tasks || vacationOwner.tasks.length === 0) return v

        v.tasks = []
        user.tasks.map(taskId => {
          const task = vacationOwner.tasks.find(t => t == taskId)
          if (!task) return

          v.lvl.push(this.levels.find(lvl => lvl.key === 'task')['id'])
          v.tasks.push(
            this.$store.getters['tasks/getTitle'](taskId)
          )
        })

        return v
      })
      let relevantUsersVacations = normalizedUsersVacations.filter(v => v.lvl.length !== 0)

      let normalizedLevels = this.levels.map(level => {
        level.dates = relevantUsersVacations
            .filter(v => v.lvl.some(lvl => lvl === level.id))
            .map(v => ({
                start: new Date(v.start),
                end: new Date(v.end)
            }))

        return level
      })

      //Отпуска коллег
      const colleaguesAttr = normalizedLevels.map(({id, dates}) => ({
        key: `vacation-${id}`,
        bar: {
          color: this.colors[id],
          style: {
            width: '100%'
          },
          class: ''
        },
        dates: dates,
      }))

      //Отпуска коллег popover
      const colleaguesPopover = relevantUsersVacations.map(v => {
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
            tasks: v.tasks?.length ? ' [' + v.tasks.join(', ') + ']' : '',
            dates
          },
          dates
        }
      })

      //Мои отпуска
      const userAttr = this.userVacations
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
          })

      let exceptionAttr = [
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
          dates: holidays.map(d => new Date(d.date))
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
          dates: workdays.map(d => new Date(d.date))
        },
      ]

      attributes.push(...userAttr)
      attributes.push(...colleaguesAttr)
      attributes.push(...colleaguesPopover)
      attributes.push(...exceptionAttr)

      this.attributes = attributes
    },
    setCssVariable() {
      let root = document.documentElement;
      root.style.setProperty('--min-h-day', "47px");
    },
    onSubmit() {
      const item = {...this.vacation}
      let events = []
      let versions = []

      if (!!item.id && item.status == 99) {
        versions = [...item.versions || []]
        versions.push(item)
      }

      const now = this.$moment().toISOString()
      events = [...item.events || []]

      let event = {}
      switch (true) {
        case(!item.id):
          event = {type: 'create'};
          break;
        case(item.status == 99):
          event = {type: 'correct'};
          break;
        case(item.status == 0):
          event = {type: 'edit'};
          break;
      }

      const vacation = defVacation({
        id: item.id,
        actually: this.isActually,
        createdAt: now,
        start: this.$moment(this.dates.start).format('YYYY-MM-DD'),
        end: this.$moment(this.dates.end).format('YYYY-MM-DD'),
        days: this.rangeLength,
        sid: this.$route.params.id,
        uid: this.uid,
        versions: versions.length !== 0 ? versions : null,
        events: item.events,
        status: 0
      })

      if (!vacation.id) this.createVacation(vacation)
      else this.updateVacation(vacation, event)

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
      if (val) this.$nextTick(() => {
        this.initialize()
        this.setCssVariable()
      })
    },
    isActually() {
      this.updateAttributes()
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