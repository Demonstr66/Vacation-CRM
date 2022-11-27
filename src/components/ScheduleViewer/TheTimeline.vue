<template>
  <div class="overflow-hidden elevation-2"
       style="border-radius: 4px;">
    <div class="calendar-wrapper pb-5">
      <table
        class="calendar"
      >
        <!--      months-->
        <tr class="calendar-header-row">
          <td id="header-col" class="calendar-event-header first">
          </td>
          <td
            v-for="(month, mIndex) in calendar.months"
            :key="'header-month-'+mIndex"
            :colspan="month.days"
            class="calendar-header-month"
          >
              <span class="calendar-header-month__title">
                {{ month.title }}
              </span>
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
            :class="{
              'calendar-header-day__today': day.isToday,
              'calendar-header-day__weekend': day.isWeekend,
              'calendar-header-day__workday': day.isWorkday,
              'calendar-header-day__holiday': day.isHoliday,
              'calendar-header-day__monthend': day.isLastDayOfMonth,
              'calendar-header-day__monthstart': day.isFirstDayOfMonth
            }"
            class="calendar-header-day"
          >
            <div class="d-flex flex-column text-center">
              <div>{{ day.date | getShortDayLabel }}</div>
              <div>{{ day.dayNumber }}</div>
            </div>
          </td>
        </tr>

        <div id="today-marker" class="today-marker">
          <span class="today-marker-dot today-marker-dot-top"></span>
          <span class="today-marker-line"></span>
          <span class="today-marker-dot today-marker-dot-bottom"></span>
        </div>

        <!--      events-->
        <v-slide-y-transition
          style="display: contents"
          group
        >
          <tr
            v-for="(node, nodeIndex) in tree"
            :key="'root-row-'+nodeIndex"
            class="calendar-event-row"
          >
            <td
              :class="{'last': nodeIndex === tree.length - 1}"
              class="calendar-event-header hoverable"
            >
              <div
                v-ripple
                :title="node.title"
                class="calendar-event-header-item text-truncate"
              >
              <span v-if="node.children && node.children.length">
                <v-btn icon small @click="toggleExpand(node.id)">
                    <v-icon
                      class="expand"
                      :class="{'open': open.indexOf(node.id) !== -1} "
                    >
                      mdi-chevron-down
                    </v-icon>
                </v-btn>
              </span>
                <span :class="{'ml-6': !node.root && !node.flat}" class="mx-3">
                {{ node.title }}
              </span>
              </div>
            </td>
            <td
              v-for="(cell, cIndex) in calendar.dates"
              :key="'root-row-'+nodeIndex +'-day-'+cIndex"
              :class="{
                'calendar-header-day__monthend': cell.isLastDayOfMonth,
                'calendar-header-day__monthstart': cell.isFirstDayOfMonth
              }"
              class="calendar-event-cell"
            >
            </td>
            <TheTimelineBaseEvent
              v-for="(event, eIndex) in node.events"
              :id="'row-'+nodeIndex+'-event-'+eIndex"
              :key="'row-'+nodeIndex+'-event-'+eIndex"

              :event="event"
              :root="node.root"
            />
          </tr>
        </v-slide-y-transition>
      </table>
    </div>
  </div>
</template>

<script>
import {getShortDayLabel} from "@/mixins/Filters";
import TheTimelineBaseEvent from "@/components/ScheduleViewer/TheTimelineBaseEvent";

export default {
  name: 'TheTimeline',
  components: {TheTimelineBaseEvent},
  mixins: [getShortDayLabel],
  props: {
    items: {},
    year: {
      type: Number
    },
    exception: {
      type: Array
    }
  },
  data: () => ({
    calendar: {},
    open: []
  }),
  created() {
    this.initialize()
  },
  mounted() {
    this.$nextTick(() => {
      this.placementEvents()
      this.placementTodayMarker()

      document.getElementById('today-marker').scrollIntoView()
    })
  },
  computed: {
    tree() {
      let tree = []
      const {items, open} = this
      const isFlatArray = items.every(item => !item.children || !item.children.length)
      items.map(node => {
        let currentNode = {...node, root: true}

        currentNode.flat = isFlatArray

        if (!node.children || !node.children.length) {
          currentNode.root = false
        }

        tree.push(currentNode)

        if (open.indexOf(node.id) !== -1 && node.children && node.children.length) {
          tree.push(...node.children)
        }
      })
      return tree
    }
  },
  methods: {
    initialize() {
      const {year, exception} = this

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
          isFirstDayOfMonth: currDay.format('DD') === '01',
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
      if (this.year !== this.$moment().year()) {
        if (marker) marker.style.display = 'none'
        return
      }

      const wrap = document.getElementById('header-col')
      const wrapLeftEdge = wrap.getBoundingClientRect().x

      const marker = document.getElementById('today-marker')

      const today = this.$moment().format('YYYY-MM-DD')
      console.log(today)
      const todayEl = document.getElementById(`header-day-${today}`)

      const todayLeftEdge = todayEl.getBoundingClientRect().x + todayEl.clientLeft

      const widthToday = todayEl.offsetWidth
      const widthMarker = marker.offsetWidth

      const left = todayLeftEdge - wrapLeftEdge + (wrapLeftEdge -
        todayEl.parentNode.getBoundingClientRect().x) + widthToday / 2 - widthMarker / 2

      marker.style.left = left + 'px'
    },
    calculateEventStyle(e) {
      const wrap = document.getElementById('header-col')
      const start = document.getElementById(`header-day-${e.start}`)
      const end = document.getElementById(`header-day-${e.end}`)

      const leftEdge = start.getBoundingClientRect().x + start.clientLeft
      const rightEdge = end.getBoundingClientRect().x + end.offsetWidth - (end.offsetWidth -
        end.clientWidth -
        end.clientLeft)
      const wrapLeftEdge = wrap.getBoundingClientRect().x

      const mx = 1
      return {
        left: `${leftEdge - wrapLeftEdge + (wrapLeftEdge -
          start.parentNode.getBoundingClientRect().x) + mx}px`,
        width: `${rightEdge - leftEdge - mx * 2}px`
      }
    },
    toggleExpand(id) {
      if (this.open.indexOf(id) === -1) this.open.push(id)
      else this.open = this.open.filter(x => x !== id)
    },
  },
  watch: {
    tree() {
      this.$nextTick(() => {
        this.placementEvents()
        this.placementTodayMarker()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$day-width: 30px;
$row-height: 50px;

.today-marker {
  $marker-color: rgba(255, 0, 0, 0.94);
  $marker-dot-size: 5.5px;
  pointer-events: none;

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

.expand {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &.open {
    transform: rotate(180deg);
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
    &-row {
      position: relative;
      height: $row-height;
    }

    &-header {
      position: sticky;
      left: 0;
      background-color: #fff;
      white-space: nowrap;
      z-index: 5;
      min-width: 200px;
      max-width: 200px;
      transition: background-color .1s ease-in-out;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;

      &.first {
        border-top-right-radius: 4px;
        border-bottom: none;
      }

      &.last {
        border-bottom-right-radius: 4px;
      }

      &.hoverable:hover {
        transition: background-color .1s ease-in-out;
        background-color: #eeeeee;
        cursor: pointer;
      }

      &-item {
        padding: 4px;
        height: $row-height;
      }
    }

    &-cell {
      border-color: #ccc !important;
      border-right: 1px dashed;
      border-bottom: 1px dashed;
    }
  }

  &-header {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;

    &-month {
      border: 2px solid #ccc;
      border-bottom: none;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      text-align: center;
      background-color: #f4f4f4;

      z-index: 1;

      &__title {
        position: sticky;
        margin: 0 10px;
        left: 210px;
        right: 10px;
      }
    }

    &-day {
      max-width: $day-width;
      min-width: $day-width;
      background-color: #fafafa;

      border-color: #ccc !important;
      border-right: 1px dashed;
      border-bottom: 1px dashed;


      &__weekend {
        color: #FF5252;
      }

      &__workday {
        color: #FFC107;
      }

      &__holiday {
        color: #1976D2;
      }

      &__month {

        &end {
          border-right-style: solid;
          border-right-width: 2px;
        }

        &start {
          border-left-style: solid;
          border-left-width: 2px;
        }
      }

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