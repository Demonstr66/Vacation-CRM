<template>
  <div>
    <v-progress-linear v-if="items.length == 0" indeterminate></v-progress-linear>
    <div v-show="items.length > 0" class="d-flex">
      <div id="headers-wrapper" class="headers-wrapper">
        <v-treeview :items="headers" dense hoverable @update:open="onHeaderOpenGroup">
          <template v-slot:label="{item}">
            <div
              :title="item.title"
              class="text-truncate"
              style="cursor: pointer;"
              @click="setFocusToEvent(item)"
            >
              {{ item.title }}
            </div>
          </template>
        </v-treeview>
      </div>
      <div
        id="tl-wrapper"
        ref="timeline"
        class="overflow-x-auto"
        style="width: 100%; scroll-behavior: smooth;"
      >
        <table class="tl">
          <tr id="tl-row-month">
            <td
              v-for="(month, index) in calendar.months"
              :key="index"
              :colspan="month.days"
              class="tl-cell tl-cell-month"
            >
              {{ month.title }}
            </td>
          </tr>
          <tr id="tl-row-day-title">
            <td
              v-for="(day, index) in calendar.days"
              :id="'vd-' + day.date"
              :key="index"
              :class="{
                'tl-cell-day--today': day.today,
                'tl-cell-day--end-month': day.endOfMonth,
                'tl-cell-day--weekend': day.weekend,
                'tl-cell-day--workday': day.workday,
                'tl-cell-day--holiday': day.holiday,
              }"
              class="tl-cell tl-cell-day-title"
              tabindex="-1"
            >
              {{ day.date | weekDayFilter }}
            </td>
          </tr>
          <tr id="tl-row-day">
            <td
              v-for="(day, index) in calendar.days"
              :id="'vd-' + day.date"
              :key="index"
              :class="{
                'tl-cell-day--today': day.today,
                'tl-cell-day--end-month': day.endOfMonth,
                'tl-cell-day--weekend': day.weekend,
                'tl-cell-day--workday': day.workday,
                'tl-cell-day--holiday': day.holiday,
              }"
              class="tl-cell tl-cell-day"
              tabindex="-1"
            >
              {{ day.dayNumber }}
            </td>
          </tr>
          <tr v-for="(item, index) in items"
              v-show="item.isHeader || opened.indexOf(item.groupId) != -1"
              :id="'tl-event-row-'+index"
              :key="'event-row-'+index"
              class="tl-event-row"
          >
            <td
              v-for="(day, index) in calendar.days"
              :key="'cell-'+index"
              :class="{
                'today': day.today,
                'tl-cell-day--end-month': day.endOfMonth
              }"
              class="tl-cell"
            >
            </td>

            <v-tooltip
              v-for="(event, idx) in item.events"
              :key="'event-'+item.id+'-'+idx"
              bottom
              offset-overflow
              open-delay="750"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  :id="'event-'+(item.isHeader ? '' : item.groupId) + item.id + '-' + idx"
                  v-ripple
                  class="event overflow-hidden"
                  tabindex="-1"
                  v-bind="attrs"
                  v-on="on"
                >
                  <div v-if="item.workload" class="event-workload-wrapper">
                    <div
                      v-for="(day, i) in event.days"
                      :key="'event-'+item.id+'-'+idx+'-'+i"
                      :class="'event-workload--' + (day > 4 ? 'max': day)"
                      :data-count="day"
                      class="event-workload"
                    ></div>
<!--                    <v-sparkline-->
<!--                      :value="event.days"-->
<!--                      height="7px"-->
<!--                      :gradient="gradient"-->
<!--                      :smooth="radius || false"-->
<!--                      :padding="padding"-->
<!--                      :line-width="width"-->
<!--                      :stroke-linecap="lineCap"-->
<!--                      :gradient-direction="gradientDirection"-->
<!--                      :fill="fill"-->
<!--                      :type="type"-->
<!--                      :auto-line-width="autoLineWidth"-->
<!--                      auto-draw-->
<!--                    >-->

<!--                    </v-sparkline>-->
                  </div>
                </div>
              </template>
              <span>
                {{ item.title }}: {{
                  event.start | dateNormalFilter
                }} - {{ event.end | dateNormalFilter }}
              </span>
            </v-tooltip>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {allVacations, calendar, posts, tasks, teams, users} from "@/mixins/ComputedData";
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]
export default {
  name: "TheTimeline",
  mixins: [allVacations, calendar, tasks, teams, posts, users],
  props: {
    schedule: {
      required: true
    },
    year: {
      required: true
    },
    groupBy: {
      type: String,
      default: 'none'
    }
  },
  mounted() {
    this.initialize(this.groupBy)
  },
  data: () => ({
    width: 1,
    radius: 5,
    padding: 0,
    lineCap: 'round',
    gradient: gradients[5],
    gradientDirection: 'top',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: true,



    headers: [],
    items: [],
    opened: [],
    vacations: []
  }),
  methods: {
    initialize(groupBy) {
      let mt = 0
      mt += document.getElementById('tl-row-month').offsetHeight
      mt += document.getElementById('tl-row-day-title').offsetHeight
      mt += document.getElementById('tl-row-day').offsetHeight

      document.getElementById('headers-wrapper').style['margin-top'] = mt + 'px'

      this.initVacations()
      if (groupBy == 'none') this.noGroupHandler()
      else this.groupVacations()

      this.$nextTick(() => {
        this.stylingEvents()
        this.goto(new Date())
      })
    },
    initVacations() {
      let vacations = {}
      Object.values(this.allVacations[this.schedule.id]).map(v => {
        if (!vacations[v.uid]) vacations[v.uid] = {
          id: v.id,
          uid: v.uid,
          user: this.$store.getters['users/getUserById'](v.uid),
          events: []
        }

        vacations[v.uid].events.push({
          start: v.start,
          end: v.end,
          days: v.days
        })
      })

      this.vacations = Object.values(vacations)
    },
    groupVacations() {
      let headers, key
      switch (this.groupBy) {
        case 'task':
          key = 'tasks'
          headers = Object.values(this.tasks);
          break;
        case 'team':
          key = 'team'
          headers = Object.values(this.teams);
          break;
        case 'post':
          key = 'post'
          headers = Object.values(this.posts);
          break;
      }

      headers.map(h => {
        let children = this.vacations
          .filter(v => v.user && v.user[key] && v.user[key].indexOf(h.id) !== -1)

        h.children = children.map(c => {
          c.title = c.user.displayName;
          c.events = c.events.sort((a, b) => a.start > b.start ? 1 : -1)
          c.groupId = h.id
          return {...c}
        })

        h.isHeader = true
        h.events = []
        h.children.map(child => h.events.push(...child.events))
        h.events = this.mergeEvent(h.events)

        return h
      })

      let items = []
      headers.map(item => {
        items.push({...item, isHeader: true, workload: true})
        item.children.map(child => {
          items.push({...child})
        })
      })

      this.headers = headers
      this.items = items
    },
    noGroupHandler() {
      let headers = Object.values(this.users)

      headers.map(h => {
        let vacations = this.vacations
          .find(v => v.uid == h.uid)

        h.id = h.uid
        h.isHeader = true
        h.title= h.displayName
        h.events = vacations.events

        return h
      })

      let items = []
      headers.map(item => {
        items.push({...item, isHeader: true  })
      })

      this.headers = headers
      this.items = items
      this.opened = headers.map( h => h.id)
    },
    stylingEvents() {
      this.items.map(item => {
        item.events.map((e, idx) => {
          const el = document.getElementById(
            'event-' + (item.isHeader ? '' : item.groupId) + item.id + '-' + idx)

          const style = this.getEventStyle(e)
          el.style.left = style.left
          el.style.width = style.width

          el.onfocus = function () {
            this.focused = true
          }
        })
      })
    },


    onHeaderOpenGroup(val) {
      this.opened = val
    },
    mergeEvent(events) {
      if (!events || events.length == 0) return []
      let days = {}
      events.map(e => {
        let day = this.$moment(e.start)

        while (day <= this.$moment(e.end)) {
          const key = day.format('YYYY-MM-DD')
          if (!days[key]) days[key] = 0
          days[key] += 1

          day.add(1, 'days')
        }
      })

      const sortDays = Object.keys(days).sort()

      let mergeEvents = []
      let start, end, curr, currDays

      sortDays.map(s => {
        if (start) {
          if (curr.format('YYYY-MM-DD') == s) {
            end = s
            currDays.push(days[s])
            curr.add(1, 'days')
            return
          }
          mergeEvents.push({start, end, days: currDays})
          curr = undefined
          start = undefined
        }

        if (!start) {
          start = s
          currDays = []
          currDays.push(days[s])
          curr = this.$moment(s)
          curr.add(1, 'days')
          return
        }
      })
      mergeEvents.push({start, end, days: currDays})

      return mergeEvents
    },
    getEventStyle(e) {
      const wrap = this.$refs.timeline
      const start = document.getElementById(`vd-${e.start}`)
      const end = document.getElementById(`vd-${e.end}`)

      const startX = start.getBoundingClientRect().x
      const endX = end.getBoundingClientRect().x + end.offsetWidth
      const wrapX = wrap.getBoundingClientRect().x

      return {
        left: `${startX - wrapX + (wrapX - start.parentNode.getBoundingClientRect().x) + 2}px`,
        width: `${endX - startX - 5}px`
      }
    },
    getText(event, e) {
      let res =
        `${e.start.split('-').reverse().join('.')} - ${e.end.split('-').reverse().join('.')}`

      return res
    },
    setFocusToEvent(data) {
      if (!data.events || data.events.length == 0) return
      const elements = data.events.map((e, idx) => {
        return document.getElementById('event-' + (data.isHeader ? '' : data.groupId) + data.id + '-' + idx)
      })

      const focusedIndex = elements.findIndex(e => e.focused)

      if (focusedIndex != -1) {
        elements[focusedIndex].focused = false
      }

      elements[(focusedIndex + 1) % elements.length].focus()
    },
    goto(date) {
      const el = this.$refs.timeline
      const target = document.getElementById('vd-' + this.$moment(date).format('YYYY-MM-DD'))

      if (!target) return

      target.focus()
    },
  },
  watch: {
    groupBy: function (val) {
      console.log(val)
      this.items = []
      this.headers = []
      this.opened = []
      console.log()
      this.initialize(val)
    }
  },
  filters: {
    weekDayFilter(val) {
      const weekDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return weekDay[new Date(val).getDay()]
    },
    dateNormalFilter(date) {
      if (!date) return
      const d = date.split('-')
      return d.reverse().join('.')
    }
  }
}
</script>


<style lang="scss" scoped>
.headers-wrapper {
  display: block;
  width: 250px;
}

.event {
  position: absolute;
  display: block;
  top: 1px;
  bottom: 2px;
  background-color: rgb(33, 150, 243);
  background: linear-gradient(45deg, #2196f3, #6ebfff);
  border-radius: 3px;

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 2px #ed8fa5;
  }

  &-workload-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;


    &:hover {
      .event-workload {
        &--1 {
          height: 15%;
        }

        &--2 {
          height: 35%;
        }

        &--3 {
          height: 50%;
        }

        &--4 {
          height: 65%;
        }

        &--max {
          height: 80%;
        }
      }
    }
  }
}

.event-workload {
  display: block;
  width: 100%;
  height: 15%;
  transition: height .17s ease-in-out;
  border: thin solid #848484;

  &--1 {
    background-color: #B2FF59;
  }

  &--2 {
    transition: height .204s ease-in-out;
    background-color: #EEFF41;
  }

  &--3 {
    transition: height .238s ease-in-out;
    background-color: #FFEA00;
  }

  &--4 {
    transition: height .272s ease-in-out;
    background-color: #FFC400;
  }

  &--max {
    transition: height .306s ease-in-out;
    background-color: #F57C00;
  }
}

.tl {
  border-collapse: collapse;
  scroll-behavior: smooth;

  &-event-row {
    position: relative;
  }


  &-cell {
    border: thin #ccc;
    border-style: dotted;

    text-align: center;
    height: 40px;
    position: relative;
    box-sizing: border-box;

    &:focus {
      outline: none;
      box-shadow: 0 0 4px 2px #ed8fa5;
    }

    &-month {
      font-size: large;
      border-style: solid;
      color: #414141;
      border-right-width: 3px;
    }

    &-day {
      border-style: solid;
      font-size: small;
      padding: 0 3px;

      border-right: none;
      border-top: none;


      &-title {
        border-style: solid;
        height: 25px;
        font-size: small;
        font-weight: bold;
      }

      &--today {
        background-color: #d5003270;
      }

      &--weekend {
        color: red
      }

      &--workday {
        color: #fb8c00;
      }

      &--holiday {
        color: rgb(33, 150, 243);
      }

      &--end-month {
        border-right-style: solid;
        border-right-color: #ccc;
        border-right-width: 3px;
      }
    }
  }
}

.today {
  &::after {
    content: "";
    box-sizing: content-box;
    display: block;
    border-right: 1px dotted #d50032;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: calc(50% - 1px);
    z-index: 100;
    pointer-events: none;
  }
}
</style>