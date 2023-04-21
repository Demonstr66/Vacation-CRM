<template>
  <td :colspan="data.headers.length">
    <v-btn icon small @click="data.toggle">
      <v-icon v-if="data.isOpen">mdi-minus</v-icon>
      <v-icon v-else>mdi-plus</v-icon>
    </v-btn>
    <span>
                {{ header || data.groupBy }}
    </span>
    <v-btn icon small @click="data.remove">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </td>
</template>

<script>
export default {
  name: "app-table-group-header",
  props: {
    data: {
      required: true
    },
    header: {
      type: String,
    },
  }
}
</script>

<style scoped>

</style>