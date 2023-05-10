<template>
  <div class="tl elevation-2">
    <div class="tl-wrapper">
      <tl-grid-row :days="months" :cols="dates.length">
        <template v-slot:item="{item}">
          <div class="tl-row-month" :class="`grid-span-${item.daysCount}`">
            <span>{{ item.title }}</span>
          </div>
        </template>
      </tl-grid-row>
      <tl-grid-row :days="dates" item-text="dayNumber">
        <template v-slot:header>
          <div class="tl-corner">
            <slot name="corner"/>
          </div>
        </template>
        <template v-slot:item="{item}">
          <div
              :data-date="item.date"
              class="tl-row-cell tl-row-day_header"
              :class="{
                'tl-row-day_header_today': item.today,
                'tl-row-day_header_weekend': item.weekend,
                'tl-row-day_header_workday': item.workday,
                'tl-row-day_header_holiday': item.holiday,
                'tl-row-cell_month-end': item.lastDayOfMonth,
                'tl-row-cell_month-start': item.firstDayOfMonth
              }"
          >
            <div>
              {{ item.weekDay }}
            </div>
            <div>
              {{ item.dayNumber }}
            </div>
          </div>
        </template>
      </tl-grid-row>

      <template v-for="item in items">
        <tl-grid-row
            :days="dates"
            item-text="dayNumber"
            empty
            :events="item.events"
        >
        </tl-grid-row>
      </template>
    </div>
  </div>
</template>

<script>
import TlGridRow from "@/components/Modules/Vacation/TimeLine/tl-grid-row";


export default {
  name: "tl-grid",
  components: {TlGridRow},
  props: {
    items: {
      type: Array
    },
    year: {
      type: [String, Number]
    },
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      dense: false,
      dates: [],
      months: []
    }
  },
  computed: {
    dateStart() {
      return new Date(`01-01-${this.year}`)
    },
    dateEnd() {
      return new Date(`12-31-${this.year}`)
    }
  },
  methods: {
    init() {
      let days = []

      let currDay = this.$moment(this.dateStart)
      let lastDay = this.$moment(this.dateEnd)


      do {
        const date = currDay.normal()
        const month = this.addDayToMonth(currDay.get('month'), currDay)

        days.push({
          date,
          month,
          dayNumber: currDay.format('DD'),
          firstDayOfMonth: date === month.firstDate,
          lastDayOfMonth: date === month.lastDate,
          weekend: currDay.day() === 6 || currDay.day() === 0,
          weekDay: currDay.weekDay(),
          // workday: !!workdays.find(d => d.date === currDay.format('YYYY-MM-DD')),
          // isHoliday: !!holidays.find(d => d.date === currDay.format('YYYY-MM-DD')),
          today: currDay.normal() === this.$moment().normal(),
          events: []
        })
        currDay.add('1', 'days')
      } while (currDay <= lastDay)

      this.dates = days
    },
    addDayToMonth(id, day) {
      let month = this.months.find(m => m.id === id)

      if (!month) {
        const currDay = this.$moment(day)
        month = {
          id,
          daysCount: 0,
          title: currDay.locale('ru').format('MMMM'),
          firstDate: currDay.startOf('month').normal(),
          lastDate: currDay.endOf('month').normal(),
        }
        this.months.push(month)
      }
      this.months[id].daysCount++

      return this.months[id]
    },
    scrollTo({date, el, align}) {
      let selector
      if (date) {
        selector = `div[data-date="${date}"]`
      }
      if (el) {
        selector = el
      }

      if (!selector) {
        return
      }

      const element = document.querySelector(selector)
      if (!element) {
        return
      }
      element.scrollIntoView({
        inline: align || 'center',
        behavior: 'smooth'
      })
      element.focus()
    },
  },
  watch: {
    dense(val) {
      document.documentElement.style.setProperty("--cell-height", val ? "25px" : "40px")
    }
  }
}
</script>

<style lang="scss">
</style>
