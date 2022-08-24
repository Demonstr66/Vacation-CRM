<template>
  <td :colspan="cols" class="pa-0">
    <div v-if="events.length" style="max-height: 250px" class="overflow-y-auto ml-2">
      <v-timeline
        dense
      >
        <v-timeline-item
          v-for="(event, idx) in reversedEvents"
          :key="idx"

          fill-dot
          small
        >
          <div
            :class="getEventColor(event.type) + '--text'"
            class="font-weight-medium"
          >
            {{ getEventName(event.type) }}
          </div>
          <vacation-range-label :end="event.end" :start="event.start" no-icon>
            <template v-slot:label>
              <span class="font-weight-medium">Даты:</span>
            </template>
          </vacation-range-label>
          <div>
            <span class="font-weight-medium">Дней:</span>
            <span class="ml-2">{{ event.days }}</span>
          </div>
          <div>
            <span>
              <span class="font-weight-medium">
                {{ getShortUserNameByUID(event.by) }}
              </span>
              <span class="ml-2">
                {{ $moment(event.at).format('DD.MM.YYYY в HH:mm') }}
              </span>
            </span>
          </div>
          <div v-if="event.comment">
            <div class="font-weight-medium">Комментарий:</div>
            <span class="ml-2 font-italic">{{ event.comment }}</span>
          </div>
        </v-timeline-item>
      </v-timeline>
    </div>
    <div v-else>
      История отсутсвует
    </div>
  </td>
</template>
<script>
import {getShortUserNameByUID} from "@/mixins/ComputedData";
import {normalizeDate} from "@/mixins/Filters";
import VacationRangeLabel from "@/views/App/VacationRangeLabel";

export default {
  name: 'VacationEventsDetails',
  components: {VacationRangeLabel},
  mixins: [getShortUserNameByUID, normalizeDate],
  props: {
    cols: {
      type: Number,
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  computed: {
    reversedEvents() {
      return this.events.reverse()
    }
  },
  methods: {
    getEventName(type) {
      switch (type) {
        case 'create':
          return 'Создан'
        case 'correct':
          return 'Исправлено'
        case 'edit':
          return 'Отредактирован'
        case 'sendToApprove':
          return 'Отпрален на утверждение'
        case 'cancelApproval':
          return 'Отозван'
        case 'approved':
          return 'Утверждён'
        case 'reject':
          return 'Отклонен'
        case 'cancelAccept':
          return 'Утверждение отозвано'

        default:
          return type
      }
    },
    getEventColor(type) {
      switch (type) {
        case 'create':
          return 'success'
        case 'cancelApproval':
          return 'warning'
        case 'approved':
          return 'success'
        case 'reject':
          return 'error'

        default:
          return 'info'
      }
    },
    addDayLabel(days) {
      if (days % 100 >= 10 && days % 100 <= 20 || days % 10 === 0) return days + ' дней'
      if (days % 10 === 1) return days + ' день'
      if (days % 10 <= 3) return days + ' дня'

      return days + ' дней'
    },
  }
}
</script>