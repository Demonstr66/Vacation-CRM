<template>
  <div
    class="d-flex flex-wrap align-start justify-space-between mt-2"
    style="max-width: fit-content"
  >
    <v-badge color="black" dot inline left>
      <span class="subtitle-1"> Рабочие дни </span>
    </v-badge>
    <v-badge color="error" dot inline left>
      <span class="subtitle-1"> Выходные дни </span>
    </v-badge>
    <v-badge color="#2196f3" dot inline left>
      <span class="subtitle-1"> Праздничные дни </span>
    </v-badge>
    <v-badge color="warning" dot inline left>
      <span class="subtitle-1"> Рабочие выходные дни </span>
    </v-badge>
  </div>
</template>
<script>
export default {
  name: 'CalendarLegend'
}
</script>