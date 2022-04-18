<template>
  <div>
    <vc-date-picker
      v-model="dates"
      :min-date="new Date('2022-01-01')"
      :max-date="new Date('2022-12-31')"
      :columns="2"
      :rows="2"
      :attributes="attributes"
      :model-config="modelConfig"
      is-range
    >
      <template v-slot:day-content="{day, dayEvents, attributes}">
        <div class="vc-day-box-center-center"
             style="height: 100%"
             v-on="dayEvents"
        >
          <span
            class="vc-day-content vc-focusable"
            :style="attributes && attributes.some(a => a.customData ? !!a.customData.holiday :
            false) ?
            'color: red;' : ''"
          >
            {{ day.label }}
          </span>
        </div>
      </template>
    </vc-date-picker>
    {{ dates }}
  </div>
</template>
<script>
const api = require('isdayoff')();

export default {
  name: 'TheCalendar',
  data: () => ({
    dates: null,
    holidays: [],
    modelConfig: {
      type: 'string',
      mask: 'YYYY-MM-DD', // Uses 'iso' if missing
    },
  }),
  computed: {
    attributes() {
      return [
        {
          key: 'holidays',
          customData: {
            holiday: true
          },
          dates: this.holidays
        },
        {
          key: 'vacation',
          bar: true,
          customData: {
            vacation: true
          },
          dates: [
            new Date(2022,3,20),
            new Date(2022,3,21),
            new Date(2022,3,22),
            new Date(2022,3,23),
            new Date(2022,3,24),
            new Date(2022,3,26),
          ]
        }
      ]
    }
  },
  async mounted() {
    const year = 2022
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`
    const stateDays = await api.period({
      start: new Date(startDate),
      end: new Date(endDate)
    })

    let holidays = []
    let day = this.$moment(new Date(startDate))

    stateDays.map((state) => {
      if (!!state) holidays.push(new Date(day._d))

      day.add(1, 'days')
    })
    this.holidays = holidays
  },
  methods: {
    console(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
.vc-highlight {
  border: 2px solid var(--blue-600) !important;

  &:not(.vc-highlight-base-middle, .vc-highlight-base-start, .vc-highlight-base-end) {
    background-color: #ffffff !important;

  }
}
</style>