<template>
  <v-container class="fill-height bggrad mx-0" style="max-width: 100vw !important;">
    <v-card class="mx-auto my-auto" elevation="8" max-width="450px" width="100%">
      <v-card-title class="justify-center" style="word-break: break-word;">{{
          title
        }}
      </v-card-title>
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
    loading: Boolean
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
