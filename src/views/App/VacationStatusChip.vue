<template>
  <v-chip
    :color="vacationStatuses[status].color"
    label
    outlined
    small
  >
    {{ vacationStatuses[status].title }}
  </v-chip>
</template>
<script>
import {vacationStatuses} from "@/mixins/ComputedData";

export default {
  name: 'VacationStatusChip',
  mixins: [vacationStatuses],
  props: {
    status: {
      type: [String, Number],
      required: true
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  }
}
</script>