<template>
  <div>
    <v-chip
      v-for="(item, index) in items"
      :key="index"
      :color="color"
      class="ma-1"
      close
      label
      link
      small
      outlined
      @click="$emit('click', item)"
      @click:close="$emit('close', item)"
    >
    <span class="font-weight-bold mr-2">
      {{ item | getShortDayLabel }}
    </span>
      {{ item | normalizeDate }}
    </v-chip>
    <v-divider></v-divider>
  </div>
</template>
<script>
import {getShortDayLabel, normalizeDate} from "@/mixins/Filters";

export default {
  name: 'schedule-chips',
  props: {
    items: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
  },
  mixins: [getShortDayLabel, normalizeDate]
}
</script>