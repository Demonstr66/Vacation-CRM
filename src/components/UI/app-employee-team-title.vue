<template>
  <span v-if="id">
      {{ title }}
 </span>
  <small v-else class="text--secondary font-italic">
    Не назнчена
  </small>
</template>
<script>
import {Team} from "@/plugins/servises/Team";

export default {
  name: 'employee-team-title',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    title() {
      return Team.getTitle(this.id)
    }
  }
}
</script>