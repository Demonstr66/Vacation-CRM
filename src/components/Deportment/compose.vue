<template>
  <v-row>
    <v-col cols="12" md="6" lg="4" xl="3">
      <teams></teams>
    </v-col>
    <v-col cols="12" md="6" lg="4" xl="3">
      <tasks></tasks>
    </v-col>
    <v-col cols="12" md="6" lg="4" xl="3">
      <posts></posts>
    </v-col>
  </v-row>
</template>

<script>
import Tasks from "./tasks.vue";
import Teams from "./teams.vue";
import Posts from "./posts.vue";

export default {
  components: {Teams, Tasks, Posts},
};
</script>

<style lang="scss" scoped>
</style>