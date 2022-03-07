<template>
  <v-app>
    <router-view name="SideNavigation" />
    <v-main>
      <router-view />
    </v-main>
    <v-overlay :value="isLoading" color="accent" opacity=".4" z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>



<script>
import SideNavigation from "./components/SideNavigation.vue";

export default {
  components: {
    SideNavigation,
  },
  data: () => ({
    isLoading: false,
  }),
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch("getDataFromBase")
    this.isLoading = false;
  },
};
</script>

