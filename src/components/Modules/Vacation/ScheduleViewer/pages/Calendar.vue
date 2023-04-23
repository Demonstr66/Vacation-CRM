<template>
  <vc-date-picker
    :columns="3"
    :max-date="maxDate"
    :min-date="minDate"
    :rows="4"
  >
  </vc-date-picker>
</template>

<script>
export default {
  name: "FullCalendar",
  props: {
    vacations: {},
    groupBy: {
      type: String
    },
    year: {
      type: [String, Number]
    },
    exception: {
      type: Array
    },
    filters: {
      type: Array
    }
  },
  computed: {
    minDate() {
      return new Date(`${this.year}-01-01`)
    },
    maxDate() {
      return new Date(`${this.year}-12-31`)
    }
  }
}
</script>

<style scoped>

</style>