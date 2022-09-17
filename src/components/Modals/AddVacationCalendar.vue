<template>
  <div>
    <vc-date-picker
      v-model="dates"
      locale="ru"
      :attributes="[
        ...attributes,
        ...userAttributes,
        ...exceptionAttributes,
        $options.WEEKEND_ATTRIBUTES,
      ]"
      :columns="$vuetify.breakpoint.mdAndUp ? 2 : 1"
      :disabled-dates="disableDates"
      :max-date="new Date(`${year}-12-31`)"
      :min-date="new Date(`${year}-01-01`)"
      :select-attribute="{highlight: {fillMode: 'light'}}"
      is-range
    >

      <template v-slot:day-content="{attributesMap, day, dayEvents}">
        <div
          :class="{
            'vc-custom-weekend': attributesMap && attributesMap.weekend,
            'vc-custom-workday': attributesMap && attributesMap.workday,
            'vc-custom-holiday': attributesMap && attributesMap.holiday,
            'vc-custom-disabled': day && day.isDisabled,
          }"
          :style="attributesMap && attributesMap.weekends ? 'color: red' : ''"
          class="vc-day in-month vc-day-box-center-center"
          v-on="dayEvents"
        >
          <span
            aria-disabled="false"
            class="vc-day-content vc-focusable"
            role="button"
            tabindex="-1"
          >
            {{ day.day }}
          </span>
        </div>
      </template>
      <template v-slot:day-popover="{dayTitle, attributes}">
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
      </template>
    </vc-date-picker>
    <v-btn block color="primary" text @click="clearSelection">Сбросить</v-btn>
  </div>
</template>
<script>
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'

const colors = ['blue', 'green', 'orange', 'yellow', 'blue', 'indigo', 'pink']
export default {
  name: 'AddVacationCalendar',
  components: {PopoverRow},
  WEEKEND_ATTRIBUTES: {
    key: 'weekend',
    highlight: {
      style: {
        display: 'none'
      },
      fillMode: 'outline',
      contentStyle: {
        color: 'red'
      },
    },
    dates: {
      weekdays: [1, 7]
    }
  },
  props: {
    year: {
      type: [String, Number],
      required: true
    },
    exception: {
      type: Array,
      default: () => []
    },
    value: {},
    currentUserVacations: {
      type: Array,
      default: () => []
    },
    uid: {
      type: String,
      required: true
    }
  },
  created() {
    this.update()
  },
  data: () => ({
    attributes: [],
  }),
  computed: {
    dates: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    disableDates() {
      const {currentUserVacations} = this
      const filteredVacations = currentUserVacations

      return filteredVacations.map(x => ({
        start: new Date(x.start),
        end: new Date(x.end)
      }))
    },
    exceptionAttributes() {
      const {exception} = this

      return exception.map(({type, date}) => {
        return {
          key: type,
          dates: new Date(date)
        }
      })
    },
    //Мои отпуска
    userAttributes() {
      const {currentUserVacations} = this

      return currentUserVacations
        .map(v => {
          return {
            key: `userVacations-${v.id}`,
            highlight: {
              color: 'green',
              fillMode: 'light',
            },
            customData: {
              name: 'Существующий отпуск',
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
    }
  },
  methods: {
    async update() {
      const {uid} = this

      const sid = this.$route.params.id

      const tasks = this.$store.getters['tasks/get']

      const currentUser = this.$store.getters['users/getUserById'](uid)

      const taskColleagues = []
      if (currentUser.tasks) currentUser.tasks.map(task => {
        let users = this.$store.getters['users/getUsersByTask'](task)
          .filter(user => user.uid !== uid)
        taskColleagues.push(...users)
      })


      const teamColleagues = this.$store.getters['users/getUsersByTeam'](currentUser.team)
        .filter(user => user.uid !== uid && !taskColleagues.some(user2 => user2.uid === user.uid))
      let chiefs = await this.$store.dispatch('users/getChiefsOf', currentUser.uid)

      chiefs = chiefs
        .filter(user => user.uid !== uid)
        .filter(user => !taskColleagues.some(user2 => user2.uid === user.uid))
        .filter(user => !teamColleagues.some(user2 => user2.uid === user.uid))

      let taskBar = taskColleagues.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft() && !vacation.isRejected())
        let attribute = {
          key: `vacationTask-${user.uid}`,
          bar: {
            color: colors[0],
            style: {
              width: '100%'
            },
            class: ''
          },
          dates: [],
        }
        Object.values(vacations).map(({start, end}) => {
          attribute.dates.push({start, end})
        })

        return attribute
      })

      let teamBar = teamColleagues.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft() && !vacation.isRejected())
        let attribute = {
          key: `vacationTeam-${user.uid}`,
          bar: {
            color: colors[1],
            style: {
              width: '100%'
            },
            class: ''
          },
          dates: [],
        }
        Object.values(vacations).map(({start, end}) => {
          attribute.dates.push({start, end})
        })

        return attribute
      })

      let chiefsBar = chiefs.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft() && !vacation.isRejected())
        let attribute = {
          key: `vacationChiefs-${user.uid}`,
          bar: {
            color: colors[2],
            style: {
              width: '100%'
            },
            class: ''
          },
          dates: [],
        }
        Object.values(vacations).map(({start, end}) => {
          attribute.dates.push({start, end})
        })

        return attribute
      })

      //Отпуска коллег popover
      let taskPopover = taskColleagues.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft())

        let attribute = (dates, vid) => ({
          key: `taskPopover-${user.uid}-${vid}`,
          highlight: {
            color: colors[0],
            style: {
              display: 'none'
            },
          },
          popover: {
            visibility: 'hover'
          },
          customData: {
            name: user.displayName,
            tasks: '[ ' + user.tasks
              ?.filter(taskId => currentUser.tasks.includes(taskId))
              .map(task => tasks[task].title)
              .join(', ') + ' ]'
            ,
            dates
          },
          dates
        })

        const attributes = Object.values(vacations).map(({start, end, id}) => {
          return attribute({start, end}, id)
        })

        return attributes
      })

      //Отпуска коллег popover
      let teamPopover = teamColleagues.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft())

        let attribute = (dates, vid) => ({
          key: `teamPopover-${user.uid}-${vid}`,
          highlight: {
            color: colors[1],
            style: {
              display: 'none'
            },
          },
          popover: {
            visibility: 'hover'
          },
          customData: {
            name: user.displayName,
            dates
          },
          dates
        })

        const attributes = Object.values(vacations).map(({start, end, id}) => {
          return attribute({start, end}, id)
        })

        return attributes
      })

      //Отпуска коллег popover
      let chiefsPopover = chiefs.map(user => {
        let vacations = this.$store.getters['vacations/getBySidByUid'](sid, user.uid)
        vacations = Object.values(vacations)
          .filter(vacation => !vacation.isDraft())

        let attribute = (dates, vid) => ({
          key: `chiefPopover-${user.uid}-${vid}`,
          highlight: {
            color: colors[2],
            style: {
              display: 'none'
            },
          },
          popover: {
            visibility: 'hover'
          },
          customData: {
            name: user.displayName,
            dates
          },
          dates
        })

        const attributes = Object.values(vacations).map(({start, end, id}) => {
          return attribute({start, end}, id)
        })

        return attributes
      })


      let attributes = [...taskBar, ...teamBar, ...chiefsBar]
      taskPopover.map(arr => attributes.push(...arr))
      teamPopover.map(arr => attributes.push(...arr))
      chiefsPopover.map(arr => attributes.push(...arr))
      this.attributes = attributes
    },
    clearSelection() {
      this.dates = null
    },
  }
}
</script>

<style lang="css">
:root {
  --min-h-day: 50px;
}

.vc-custom-weekend {
  color: red;
}

.vc-custom-workday {
  color: #fb8c00;
}

.vc-custom-holiday {
  color: #2196f3;
}

.vc-custom-disabled {
  font-style: italic !important;
  opacity: 0.5;
}

.vc-day {
  min-height: var(--min-h-day) !important;
}

.vc-bars {
  width: 100% !important;
  flex-direction: column !important;
}

.vc-bar {
  margin-top: 1px;
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


</style>
