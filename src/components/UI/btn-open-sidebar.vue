<template>
  <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      icon
      @click.stop="openSidebar"
  >
    <v-icon>mdi-tune-variant</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "btn-open-sidebar",
  inject: ['openSidebar'],
}
</script>