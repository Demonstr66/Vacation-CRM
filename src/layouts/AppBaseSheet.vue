<template>
  <v-sheet
      :elevation="flat ? 0 : $vuetify.breakpoint.mdAndUp ? 2 : 0"
      rounded
      class="pa-1 pa-md-3 mx-1 my-1 mb-2"
      :color="color"
  >
    <slot/>
  </v-sheet>
</template>
<script>
export default {
  name: 'app-base-sheet',
  props: {
    flat: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>