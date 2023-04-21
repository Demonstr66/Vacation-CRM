<template>
  <app-base-sheet :style="$vuetify.breakpoint.smAndDown ? 'max-width: 200px' : ''">
    <div class="d-flex justify-space-between">
      <span v-if="!!header">
        {{ header }}
      </span>
      <v-icon v-if="!!icon" :color="iconColor">
        {{ icon }}
      </v-icon>
    </div>
    <span class="headline primary--text font-weight-bold mx-2">
      {{ text }}
    </span><br>
    <small v-if="!!footer">
      {{ footer }}
    </small>
  </app-base-sheet>
</template>
<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";

export default {
  name: 'app-shield',
  components: {AppBaseSheet},
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: 'info'
    },
    header: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      required: true
    },
    footer: {
      type: String,
      default: ''
    }
  }
}
</script>