<template>
  <v-row>
    <v-col cols="12" class="pa-0 ma-0 mt-3">
      <v-divider/>
    </v-col>
    <v-col cols="12" md="6" class="mt-0 pt-1">
      <div class="text-subtitle-1 font-weight-medium text--primary pl-1 pl-md-3">{{ label }}</div>
      <div class="text-caption text--secondary pl-1 pl-md-3">{{ description }}</div>
    </v-col>
    <v-col cols="12" md="6" align-self="center" class="pr-1 pr-md-3 mt-0 pt-1">
      <slot/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "setting-row",
  props: {
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>