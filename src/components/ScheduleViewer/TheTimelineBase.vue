<template>
  <div class="calendar-wrapper">
    <table
      ref="calendar"
      class="calendar"
    >
      <!--      months-->
      <tr class="calendar-header-row">
        <td class="calendar-event-header">
        </td>
        <td
          v-for="(month, mIndex) in calendar.months"
          :key="'header-month-'+mIndex"
          :colspan="month.days"
          class="calendar-header-month"
        >
          {{ month.title }}
        </td>
      </tr>
      <!--      dates-->
      <tr>
        <td class="calendar-event-header">
        </td>
        <td
          v-for="(day, dIndex) in calendar.dates"
          :id="'header-day-'+day.date"
          :key="'header-days-'+dIndex"
          :class="{'calendar-header-day__today': day.isToday}"
          class="calendar-header-day"
        >
          <div class="d-flex flex-column">
            <div>{{ day.date | getShortDayLabel }}</div>
            <div>{{ day.dayNumber }}</div>
          </div>
        </td>
      </tr>

      <!--      events-->
      <div id="today-marker" class="today-marker">
        <span class="today-marker-dot today-marker-dot-top"></span>
        <span class="today-marker-line"></span>
        <span class="today-marker-dot today-marker-dot-bottom"></span>
      </div>
      <tr
        v-for="(node, nodeIndex) in tree"
        :key="'root-row-'+nodeIndex"
        class="calendar-event-row"
      >
        <td class="calendar-event-header">
          <div
            v-ripple
            class="calendar-event-header-item"
          >
            <span v-if="node.children && node.children.length">
              <v-btn icon small @click="toggleExpand(node.id)">
                  <v-icon v-if="open.indexOf(node.id) === -1">
                    mdi-chevron-down
                  </v-icon>
                  <v-icon v-else>
                    mdi-chevron-up
                  </v-icon>
              </v-btn>
            </span>
            <span :class="{'ml-6': !node.root}">
              {{ node.title }}
            </span>
          </div>
        </td>
        <td
          v-for="(cell, cIndex) in calendar.dates"
          :key="'root-row-'+nodeIndex +'-day-'+cIndex"
          class="calendar-event-cell"
        >
        </td>
        <div
          v-for="(event, eIndex) in node.events"
          :id="'row-'+nodeIndex+'-event-'+eIndex"
          :key="'row-'+nodeIndex+'-event-'+eIndex"
          class="calendar-event"
          tabindex="-1"
        >
          <div v-if="node.root" class="event-workload-wrapper">
            <div
              v-for="(day, dayIndex) in event.days"
              :key="'row-'+nodeIndex+'-event-'+eIndex+'-day-'+dayIndex"
              :class="'event-workload--' + (day.total > 4 ? 'max': day.total)"
              :data-count="day.total"
              class="event-workload"
            ></div>
          </div>
        </div>
      </tr>
    </table>
  </div>
</template>

<script>
import {getShortDayLabel} from "@/mixins/Filters";

export default {
  name: 'TheTimelineBase',
  mixins: [getShortDayLabel],
  props: {
    items: {},
    schedule: {}
  },
  data: () => ({
    calendar: {},
    open: [],
    tree: []
  }),
  created() {
    this.initialize()
  },
  mounted() {
    this.placementEvents()
    this.placementTodayMarker()
  },
  methods: {
    initialize() {
      const year = this.schedule.year
      const exception = [...this.schedule.exception || []]
      const holidays = exception.filter(x => x.type === 'holiday')
      const workdays = exception.filter(x => x.type === 'workday')

      let currDay = this.$moment(`${year}-01-01`)
      let calendar = {
        months: {},
        dates: []
      }

      while (currDay.get('year') == year) {
        const month = currDay.get('month')
        if (!calendar.months[month]) calendar.months[month] = {
          title: currDay.format('MMMM'),
          days: 0
        }
        calendar.months[month].days += 1
        calendar.dates.push({
          dayNumber: currDay.format('DD'),
          date: currDay.format('YYYY-MM-DD'),
          isLastDayOfMonth: month !== this.$moment(currDay).add(1, 'days').get('month'),
          isLastDayOfWeek: year !== this.$moment(currDay).add(1, 'days').get('year'),
          isWeekend: currDay.day() == 6 || currDay.day() == 0,
          isWorkday: !!workdays.find(d => d.date === currDay.format('YYYY-MM-DD')),
          isHoliday: !!holidays.find(d => d.date === currDay.format('YYYY-MM-DD')),
          isToday: currDay.format('YYYY-MM-DD') === this.$moment().format('YYYY-MM-DD')
        })
        currDay.add(1, 'days')
      }
      calendar.months = Object.values(calendar.months)
      this.calendar = {...calendar}
      this.tree = [...this.items]
    },
    placementEvents() {
      this.tree.map((node, nodeIndex) => {
        node.events.map((event, eIndex) => {
          const el = document.getElementById('row-' + nodeIndex + '-event-' + eIndex)

          const style = this.calculateEventStyle(event)
          el.style.left = style.left
          el.style.width = style.width
        })
      })
    },
    placementTodayMarker() {
      const wrap = this.$refs.calendar
      const wrapX = wrap.getBoundingClientRect().x
      const todayEl = document.getElementsByClassName('calendar-header-day__today')[0]
      const marker = document.getElementById('today-marker')

      const startToday = todayEl.getBoundingClientRect().x
      const widthToday = todayEl.offsetWidth
      const widthMarker = marker.offsetWidth
      const left = startToday + widthToday / 2 - widthMarker / 2 - wrapX - 1

      console.log(left)
      marker.style.left = left + 'px'
    },
    calculateEventStyle(e) {
      const wrap = this.$refs.calendar
      const start = document.getElementById(`header-day-${e.start}`)
      const end = document.getElementById(`header-day-${e.end}`)

      const startX = start.getBoundingClientRect().x
      const endX = end.getBoundingClientRect().x + end.offsetWidth
      const wrapX = wrap.getBoundingClientRect().x

      return {
        left: `${startX - wrapX + (wrapX - start.parentNode.getBoundingClientRect().x) + 1}px`,
        width: `${endX - startX - 3}px`
      }
    },
    toggleExpand(id) {
      if (this.open.indexOf(id) === -1) this.open.push(id)
      else this.open = this.open.filter(x => x !== id)
    },
    reCalculateTree() {
      let tree = []
      this.items.map(node => {
        tree.push({...node, root: true})
        if (this.open.indexOf(node.id) !== -1 && node.children && node.children.length)
          tree.push(...node.children)
      })
      this.tree = tree

      this.$nextTick(() => {
        this.placementEvents()
      })
    }
  },
  watch: {
    open() {
      this.reCalculateTree()
    },
    items() {
      this.reCalculateTree()
    }
  }
}
</script>

<style lang="scss" scoped>
$day-width: 25px;
.today-marker {
  $marker-color: rgba(255, 0, 0, 0.94);
  $marker-dot-size: 5.5px;

  position: absolute;
  width: $marker-dot-size * 2 + 3px;
  top: 75px;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  text-align: center;

  &-dot {
    width: $marker-dot-size;
    border: $marker-dot-size solid $marker-color;
    border-radius: $marker-dot-size + 0.5px;
    background-color: $marker-color;
    position: absolute;
    transform: translateX(-1 * $marker-dot-size + 0.5px);

    &-top {
      top: -1 * $marker-dot-size - 0.5px;
    }

    &-bottom {
      bottom: -1 * $marker-dot-size - 0.5px;
    }
  }

  &-line {
    border-right: 1px dotted $marker-color;
    position: absolute;
    top: 0;
    bottom: 0;
  }
}

.rotate {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
}

.event {
  &-workload-wrapper {
    display: flex;
    width: calc(100% + 3px);
    height: 100%;
    position: absolute;
    left: -1px;

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

  &-workload {
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
}

.calendar {
  border-spacing: 0;
  border-collapse: separate;
  box-sizing: border-box;
  position: relative;

  &-wrapper {
    overflow-x: auto;
  }

  &-event {
    position: absolute;
    display: block;
    top: 1px;
    bottom: 2px;
    background-color: rgb(33, 150, 243);
    background: linear-gradient(45deg, #2196f3, #6ebfff);
    border-radius: 3px;

    overflow: hidden;

    &-row {
      position: relative;
    }

    &-header {
      position: sticky;
      left: 0;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      background-color: #d0d0d0;
      white-space: nowrap;
      z-index: 2;

      &-item {
        padding: 4px;
        cursor: pointer;
      }
    }

    &-cell {
      border-right: 1px dashed #c3c3c3;
      border-bottom: 1px dashed #c3c3c3;
    }
  }

  &-header {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;

    &-month {
      background-color: #b8f8ec;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      border-top: 1px solid black;
      text-align: center;

      z-index: 1;

      &__title {
        display: block;
      }
    }

    &-day {
      max-width: $day-width;
      min-width: $day-width;
      background-color: #b8caf8;
      border-right: 1px solid black;
      border-bottom: 1px solid black;

      &-today::after {
        content: "";
        display: block;
        width: 1px;
        position: absolute;
        top: 0;
        height: 100%;
        background-color: blue;

      }
    }
  }
}
</style>