<template>
  <v-sheet
    :elevation="$vuetify.breakpoint.mdAndUp ? 2 : 0"
    rounded
    class="pa-1 pa-md-3 ma-1"
    color="white"
  >
    <slot/>
  </v-sheet>
</template>
<script>
export default {
  name: 'app-base-sheet',
  props: {
    block: {
      type: Boolean,
      default: false
    }
  }
}
</script>