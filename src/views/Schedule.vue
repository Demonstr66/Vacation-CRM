<template>
  <div class="d-flex">
    <div
      class="d-flex flex-column event-header-wrapper"
    >
      <v-row
        v-for="(event, index) in events"
        :key="'event'+index"
        align="center"
        class="event-header flex-nowrap"
        no-gutters
      >
        <v-col class="" cols="auto">
          <v-btn icon small @click="goto">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-col>
        <v-col
          class="px-3 text-no-wrap fill-height d-flex flex-column justify-center"
          v-ripple
          style="cursor: pointer"
          @click="focusEvent(event, index)"
        >
          {{ event.title}}
        </v-col>
      </v-row>
    </div>
    <div id="c-wrapper" ref="cWrapper" class="overflow-x-auto "
         style="width: 100%; scroll-behavior: smooth;">
      <table class="tl">
        <tr id="tl-month-header">
          <td
            v-for="(month, index) in calendar.months"
            :key="index"
            :colspan="month.days"
            class="tl-cell tl-cell-month"
          >
            {{ month.title }}
          </td>
        </tr>
        <tr id="tl-day-header">
          <td
            v-for="(day, index) in calendar.days"
            :id="'vd-' + day.date"
            :key="index"
            :class="{'tl-cell-day--today': day.today, 'end-month': day.endOfMonth}"
            class="tl-cell tl-cell-day"
            tabindex="-1"
          >
            {{ day.dayNumber }}
          </td>
        </tr>
        <tr v-for="(event, index) in events" :id="'tl-event-'+index" :key="'event'+index"
            class="tl-event-row">
          <td
            v-for="(day, index) in calendar.days"
            :key="index"
            :class="{
              today: day.today,
              'end-month': day.endOfMonth
            }"
            class="tl-cell tl-cell-event"
          >
          </td>

          <v-tooltip v-for="(e, idx) in event.events"
                     :key="'event-'+index+'-'+idx" bottom offset-overflow
                     open-delay="750">
            <template v-slot:activator="{ on, attrs }">
              <div
                :id="'event-'+index+'-'+idx"
                v-ripple
                class="myEvent overflow-hidden"
                style="line-height: 40%"
                tabindex="-1"
                v-bind="attrs"
                v-on="on"
              >
              </div>
            </template>
            <span>
              {{ event.title }}: {{ e.start | dateNormalFilter }} - {{ e.end | dateNormalFilter }}
            </span>
          </v-tooltip>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import TheCalendar from "@/components/TheCalendar";

export default {
  name: 'Schedule',
  components: {TheCalendar},
  data: () => ({
    year: 2022,
    events: [
      {
        title: 'Филиппов Д. О.', events: [
          {start: '2022-01-10', end: '2022-01-15'},
          {start: '2022-01-20', end: '2022-01-25'},
          {start: '2022-01-27', end: '2022-01-31'},
        ]
      },
      {
        title: 'Вакашинов А. С.', events: [
          {start: '2022-01-13', end: '2022-01-27'},
          {start: '2022-02-01', end: '2022-02-23'},
          {start: '2022-03-01', end: '2022-03-23'},
        ]
      },
      {
        title: 'Толстой Л. Н.', events: [
          {start: '2022-01-10', end: '2022-01-11'},
          {start: '2022-01-23', end: '2022-01-25'},
          {start: '2022-01-26', end: '2022-02-25'},
        ]
      },
    ]
  }),
  mounted() {
    let mt = 0
    mt += document.getElementById('tl-month-header').offsetHeight
    mt += document.getElementById('tl-day-header').offsetHeight

    document.getElementsByClassName('event-header-wrapper')[0].style['margin-top'] = mt + 'px'
    this.initEvent()
  },
  computed: {
    calendar() {
      let currDay = this.$moment(`${this.year}-01-01`)
      let days = []
      let months = {}

      while (currDay.get('year') === this.year) {
        days.push(this.$moment(currDay))

        let m = currDay.get('month')
        if (!months[m]) months[m] = {
          title: currDay.format('MMMM'),
          days: 0
        }
        months[m].days += 1


        currDay.add(1, 'days')
      }

      days = days.map(r => ({
        dayNumber: r.format('DD'),
        date: r.format('YYYY-MM-DD'),
        endOfMonth: r.get('month') !== this.$moment(r).add(1, 'days').get('month'),
        endOfYear: r.get('year') !== this.$moment(r).add(1, 'days').get('year'),
        weekend: r.day() == 6 || r.day() == 0,
        today: r.format('YYYY-MM-DD') === this.$moment().format('YYYY-MM-DD')
      }))


      return {days, months: Object.values(months)}
    }
  },
  methods: {
    initEvent() {
      this.events.map((event, index) => {
        event.events.map((e, idx) => {
          const el = document.getElementById('event-' + index + '-' + idx)
          const style = this.getEventStyle(e)
          el.style.left = style.left
          el.style.width = style.width
          el.onfocus = function (d) {
            d.preventDefault()
            this.focused = true
          }

        })
      })
    },
    getEventStyle(e) {
      const wrap = this.$refs.cWrapper
      const start = document.getElementById(`vd-${e.start}`)
      const end = document.getElementById(`vd-${e.end}`)

      const startX = start.getBoundingClientRect().x
      const endX = end.getBoundingClientRect().x + end.offsetWidth
      const wrapX = wrap.getBoundingClientRect().x

      return {
        left: `${startX - wrapX + 3}px`,
        width: `${endX - startX - 5}px`
      }
    },
    getText(event, e) {
      let res =
        `${e.start.split('-').reverse().join('.')} - ${e.end.split('-').reverse().join('.')}`

      return res
    },
    focusEvent(data, index) {
      const elements = data.events.map((e, idx) => {
        return document.getElementById('event-' + index + '-' + idx)
      })
      const focusedIndex = elements.findIndex(e => e.focused)

      if (focusedIndex != -1) {
        elements[focusedIndex].focused = false
      }

      elements[(focusedIndex + 1) % elements.length].focus()
    },
    goto() {
      const el = this.$refs.cWrapper
      const target = document.getElementById('vd-2022-05-09')

      const y = target.getBoundingClientRect().x
      const elX = el.getBoundingClientRect().x
      const elW = el.getBoundingClientRect().width


      target.classList.add('focus')
      el.scrollTo({
        top: 0,
        left: y - elX - elW / 2 + el.scrollLeft,
        behavior: 'smooth'
      },)

      setTimeout(() => {
        target.classList.remove('focus')
      }, 4000)
    },
    dayInEvents(day, events) {
      return events.some(event => this.dayInInterval(day, event))
    },
    dayInInterval(day, {start, end}) {
      const d = this.$moment(day)
      return d >= this.$moment(start) && d <= this.$moment(end)
    },
    isDayStartOfInterval(day, events) {
      return events.some(event => event.start == day)
    },
    isDayEndOfInterval(day, events) {
      return events.some(event => event.end == day)
    }
  },
  filters: {
    dateNormalFilter(date) {
      const d = date.split('-')
      return d.reverse().join('.')
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  scroll-behavior: smooth;
}

.event-header-wrapper {
  display: block;

  & .event-header {
    max-height: 35px;
    padding: 0 5px;
    border-bottom: thin solid #ccc;
  }
}

.myEvent {
  position: absolute;
  display: block;
  top: 1px;
  bottom: 2px;
  background-color: #0088ff;
  border-radius: 3px;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px yellow;
  }
}

.tl {
  scroll-behavior: smooth;
  border-spacing: 0;

  &-event-row {
    position: relative;
  }
}

.tl-cell {
  border: thin #ccc;
  border-style: dotted;

  text-align: center;
  height: 35px;
  position: relative;
  box-sizing: border-box;

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

    &--today {
      background-color: #99f8ff70;
    }
  }

  &-event {
    border-right: none;
    border-top: none;
  }

  &.end-month {
    border-right: 3px solid #ccc;
  }

  transition: box-shadow .7s ease-in-out;

  &.focus {
    box-shadow: 0 0 4px 2px #42f2ff;
  }

}

.event {
  display: block;
  position: absolute;
  box-sizing: border-box;
  top: 1px;
  bottom: 1px;
  width: calc(100% + 2px);
  z-index: 100;
  left: 0px;

  &--start {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }

  &--end {
    width: calc(100%);
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;

  }
}

.today {
  &::after {
    content: "";
    box-sizing: content-box;
    display: block;
    border-right: 1px dotted blue;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%;
  }
}
</style>