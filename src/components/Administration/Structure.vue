<template>
  <div class="mt-1">
    <v-row no-gutters>
      <v-col cols="12" md="6" lg="4" xl="3">
        <teams></teams>
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3">
        <tasks class="mb-1"></tasks>
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3" offset="0" offset-md="6" offset-lg="0">
        <posts></posts>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Tasks from "./TheTasksWidget.vue";
import Teams from "./TheTeamsWidget.vue";
import Posts from "./ThePostsWidget.vue";

export default {
  components: {Teams, Tasks, Posts},
};
</script>
