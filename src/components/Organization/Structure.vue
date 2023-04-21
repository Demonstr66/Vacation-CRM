<template>
  <div class="d-grid">
    <teams/>
    <tasks/>
    <posts/>
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
<style lang="scss" scoped>
.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(95%, 1fr));
  }
}
</style>

