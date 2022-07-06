<template>
  <div class="calendar-wrapper">
      <table class="calendar">
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
        <tr>
          <td class="calendar-event-header">
          </td>
          <td
            v-for="(day, dIndex) in calendar.dates"
            :key="'header-days-'+dIndex"
            class="calendar-header-day"
          >
            <div class="d-flex flex-column">
              <div>{{ day.date | getShortDayLabel }}</div>
              <div>{{ day.dayNumber }}</div>
            </div>
          </td>
        </tr>
        <tr
          v-for="(root, rIndex) in tree"
          :key="'root-row-'+rIndex"
          class="calendar-event-row"
        >
          <td class="calendar-event-header">
            {{ root.title }}
          </td>
          <td
            v-for="(cell, cIndex) in calendar.dates"
            :key="'root-row-'+rIndex +'-day-'+cIndex"
            class="calendar-event-cell"
          >

          </td>
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
    tree: {},
    schedule: {}
  },
  data: () => ({
    calendar: {}
  }),
  created() {
    this.initialize()
    console.log(this.tree)
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
    }
  }
}
</script>

<style lang="scss" scoped>
$day-width: 20px;

.calendar {
  border-spacing: 0;
  border-collapse: separate;

  &-wrapper {
    overflow-x: auto;
  }

  &-event {
    &-header {
      position: sticky;
      left: 0;
      border: 1px solid black;
      background-color: #942e2e;
      white-space: nowrap;
      padding: 4px;
    }
    &-cell {
      border-right: 1px dashed grey;
      border-bottom: 1px dashed grey;
    }
  }

  &-header {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    box-sizing: border-box;

    &-month {
      background-color: #b8f8ec;
      border: 1px solid black;
      text-align: center;

      &__title {
        display: block;
      }
    }

    &-day {
      width: $day-width;
      background-color: #b8caf8;
      border: 1px solid black;
    }
  }
}
</style>