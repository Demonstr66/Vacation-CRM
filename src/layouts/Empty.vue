<template>
  <v-container class="fill-height">
    <v-card elevation="8" class="mx-auto my-auto" width="100%" max-width="450px">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <router-view></router-view>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    title: String,
  },
  data: () => ({
    appTitle: 'Vacation CRM'
  })
};
</script>
