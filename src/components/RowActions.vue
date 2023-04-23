<template>
  <v-menu
      v-if="$vuetify.breakpoint[breakpoint]"
      content-class="no-sheet"
      offset-y
      top

  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <div class="d-flex flex-column white">
      <slot></slot>
    </div>
  </v-menu>
  <div v-else class="d-flex flex-nowrap justify-end" style="max-width: fit-content">
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: 'RowActions',
  props: {
    breakpoint: {
      type: String,
      default: 'smAndDown'
    }
  }
}
</script>