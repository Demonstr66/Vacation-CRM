<template>
  <v-container class="mx-4 mt-6">
    <div class="title">График отпусков</div>
      <Calendar
        language="ru"
        :data-source="dataSet"
        :disabled-days="disableDays"
        :enable-range-selection="true"
        render-style="custom"
        :round-range-limits="true"
        @render-end="onRenderEnd"
        @year-changed="onYearChanged"
        @select-range="onSelectRange"
        :custom-data-source-renderer="customRender"
      ></Calendar>
  </v-container>
</template>

<script>
import Calendar from 'v-year-calendar';
import 'v-year-calendar/locales/v-year-calendar.ru';

export default {
  components: {
    Calendar
  },
  data: function() {
    return {
      disableDays: [],
      currentYear: 2022,
      dataSet: []
    }
  },
  async mounted() {
    this.disableDays = await this.getDisableDays( this.currentYear )
  },
  methods:{
    onRenderEnd: function() {
      console.log('renderEnd')
    },
    onYearChanged: async function( {currentYear}) {
      this.currentYear = currentYear
      this.disableDays = await this.getDisableDays( this.currentYear )
    },
    getDisableDays: async function(year) {
      const api = require('isdayoff')();
      return await api.year({ year })
    },
    onSelectRange: function({ startDate, endDate }) {
      console.log(startDate, endDate)
      this.dataSet.push({
        name: "Name",
        startDate,
        endDate
      })
    },
    customRender: function(e){
      e.style = "background-color: red;"
      return e
    }
  }
}
</script>


