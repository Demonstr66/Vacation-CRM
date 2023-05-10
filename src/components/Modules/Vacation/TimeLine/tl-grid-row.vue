<template>
  <div class="tl-row">
    <div class="tl-row-side">
      <div class="tl-row-side_container">
        <slot name="header"/>
      </div>
    </div>
    <div class="tl-row-cells" :class="`grid-cols-${cols || days.length}`">
      <template
          v-for="day in days"
      >
        <slot name="item" :item="day">
          <div
              class="tl-row-cell"
              :class="{
                'tl-row-cell_month-end': day.lastDayOfMonth,
                'tl-row-cell_month-start': day.firstDayOfMonth,
                'tl-row-cell-today': day.today
              }"
              :data-date="day.date"
          >
            <template v-if="!empty">
              {{ day[itemText] }}
            </template>
          </div>
        </slot>
      </template>

      <template v-for="event in events">
        <tl-event :event="event" :style="getStyle(event)"/>
      </template>
    </div>
  </div>
</template>

<script>
import TlEvent from "@/components/Modules/Vacation/TimeLine/tl-event";

export default {
  name: "tl-grid-row",
  components: {TlEvent},
  props: {
    days: {
      type: Array,
      required: true
    },
    itemText: {
      type: String,
      default: "title"
    },
    cols: {
      type: Number,
      default: 0
    },
    empty: {
      type: Boolean,
      default: false
    },
    events: {
      type: Array,
    }
  },
  methods: {
    findDateCol(date) {
      date = this.$moment(date).normal()
      let col = this.days.findIndex(d => d.date === date)
      if (col) {
        return col + 1
      }

      return -1
    },
    getStyle(event) {
      const colStart = this.findDateCol(event.start)
      const colEnd = this.findDateCol(event.end)

      if (colStart === -1 || colEnd === -1) {
        return ''
      }

      return `grid-column: ${colStart}/${colEnd + 1}`
    }
  }
}
</script>

<style scoped>

</style>