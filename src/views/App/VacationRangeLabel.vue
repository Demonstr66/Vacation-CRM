<template>
  <div>
    <v-icon v-if="!noIcon">mdi-calendar</v-icon>
    <slot name="label"></slot>
    {{ start | getShortDayLabel | lowerCase }}
    <span class="font-weight-bold">{{ start | normalizeDate }}</span> -
    {{ end | getShortDayLabel | lowerCase }}
    <span class="font-weight-bold">{{ end | normalizeDate }}</span>
  </div>
</template>
<script>
import {getShortDayLabel, lowerCase, normalizeDate} from "@/mixins/Filters";

export default {
  name: 'VacationRangeLabel',
  mixins: [getShortDayLabel, lowerCase, normalizeDate],
  props: {
    start: {
      type: String
    },
    end: {
      type: String
    },
    noIcon: {
      type: Boolean,
      default: false
    }
  }
}
</script>