<template>
  <div>
    <vc-date-picker
      v-model="dates"
      :attributes="attributes"
      :columns="2"
      :disabled-dates="disableDates"
      :max-date="new Date(`${year}-12-31`)"
      :min-date="new Date(`${year}-01-01`)"
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
  </div>
</template>
<script>
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'
import {getChiefOf} from "@/mixins/ComputedData";

export default {
  name: 'AddVacationCalendar',
  components: {PopoverRow},
  mixins: [getChiefOf],
  props: {
    year: {
      type: [String, Number],
      required: true
    },
    exception: {
      type: Array,
    },
    value: {
      type: Object
    },
    actually: {
      type: Boolean,
      default: false
    },
    currentUserVacations: {
      type: Array
    },
    vacations: {
      type: Array
    },
    uid: {
      type: String,
      required: true
    }

  },
  created() {
    this.updateAttributes()
  },
  data: () => ({
    attributes: [],
    levels: [
      {id: 0, hidden: false, title: 'Руководители', key: 'chief'},
      {id: 1, hidden: false, title: 'Коллеги по команде', key: 'team'},
      {id: 2, hidden: false, title: 'Коллеги по задачам', key: 'task'},
    ],
    colors: [
      'teal',
      'green',
      'orange',
      'yellow',
      'blue',
      'indigo',
      'pink'
    ]
  }),
  computed: {
    holidays() {
      return this.exception?.filter(x => x.type === 'holiday') || []
    },
    workdays() {
      return this.exception?.filter(x => x.type === 'workday') || []
    },
    dates: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    disableDates() {
      const {actually, currentUserVacations} = this
      const filteredVacations = currentUserVacations?.filter(x => x.actually === actually)

      return filteredVacations?.map(x => ({
        start: new Date(x.start),
        end: new Date(x.end)
      }))
    },
  },
  methods: {
    updateAttributes() {
      const {vacations, currentUserVacations, holidays, workdays, actually, uid} = this

      const user = this.$store.getters['users/getUserById'](uid)
      let attributes = []

      let chiefs = this.getChiefOf(this.uid)

      let normalizedUsersVacations = vacations?.map(v => {
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
      let relevantUsersVacations = normalizedUsersVacations?.filter(v => v.lvl.length !== 0)

      let normalizedLevels = this.levels.map(level => {
        level.dates = relevantUsersVacations
          ?.filter(v => v.lvl.some(lvl => lvl === level.id))
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
      const colleaguesPopover = relevantUsersVacations?.map(v => {
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
      const userAttr = currentUserVacations
        ?.filter(v => v.actually === actually)
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

      if (userAttr) attributes.push(...userAttr)
      if (colleaguesAttr) attributes.push(...colleaguesAttr)
      if (colleaguesPopover) attributes.push(...colleaguesPopover)
      if (exceptionAttr) attributes.push(...exceptionAttr)

      this.attributes = attributes
    },
    setCssVariable() {
      let root = document.documentElement;
      root.style.setProperty('--min-h-day', "47px");
    },
    clearSelection() {
      this.dates = {}
    },
  },
  watch: {
    actually() {
      this.updateAttributes()
    }
  }
}
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
