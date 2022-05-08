<template>
  <vc-calendar
    v-model="dates"
    disabled
    :columns="$vuetify.breakpoint.smAndDown ? 1 : $vuetify.breakpoint.mdOnly ? 3 : 4"
    :max-date="new Date('2022-12-31')"
    :min-date="new Date('2022-01-01')"
    :model-config="modelConfig"
    :rows="$vuetify.breakpoint.smAndDown ? 2 : $vuetify.breakpoint.mdOnly ? 4 : 3"
    is-expanded
  >
  </vc-calendar>
</template>
<script>

export default {
  name: 'TheCalendar',
  data: () => ({
    dates: null,
    modelConfig: {
      type: 'string',
      mask: 'YYYY-MM-DD', // Uses 'iso' if missing
    },
  }),
  computed: {
    attributes() {
      return []
    }
  },
  async mounted() {
  },
  methods: {
    console(val) {
      console.log(val)
    }
  }
}
</script>