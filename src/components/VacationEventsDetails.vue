<template>
  <td :colspan="headers.length">
    <div v-if="item.events && item.events.length">
      <v-timeline
        dense
      >
        <v-timeline-item
          v-for="(event, idx) in item.events"
          :key="idx"
          small
          fill-dot
        >
          <v-card
            flat
          >
            <v-card-title>
              {{ event.type }}
            </v-card-title>
            <v-card-subtitle>
              {{ $moment(event.at).format('YYYY-MM-DD HH:mm') }}
            </v-card-subtitle>
            <blockquote>
              {{ event.by }}
            </blockquote>
            <blockquote v-if="event.comment">
              {{ event.comment }}
            </blockquote>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
    <div v-else>
      История отсутсвует
    </div>
  </td>
</template>
<script>
export default {
  name: 'VacationEventsDetails',
  props: {
    headers: {},
    item: {}
  }
}
</script>