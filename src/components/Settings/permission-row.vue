<template>
  <v-row>
    <v-col cols="12" md="6">
      <slot/>
    </v-col>
    <v-col cols="12" md="6">
      <slot name="description"/>
    </v-col>
    <v-col cols="12">
      <v-divider/>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'permission-row',
}
</script>
