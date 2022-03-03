<template>
  <v-app>
    <router-view name="SideNavigation" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>



<script>
import SideNavigation from "./components/SideNavigation.vue";

export default {
  components: {
    SideNavigation,
  }
};
</script>

