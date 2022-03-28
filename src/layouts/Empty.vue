<template>
  <v-container class="fill-height bggrad mx-0" style="max-width: 100vw !important;">
    <v-card elevation="8" class="mx-auto my-auto"  width="100%" max-width="450px">
      <v-card-title style="word-break: break-word;" class="justify-center">{{ title }}</v-card-title>
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



<style>
.bggrad {
    background-color: #97cfdb;
    background: linear-gradient(335deg, #e0e18b, #97cfdb);
}
</style>
