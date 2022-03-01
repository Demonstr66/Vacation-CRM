<template>
  <v-app>
    <!-- <side-navigation /> -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>



<script>
import SideNavigation from './components/SideNavigation.vue'

export default {
  name: 'App',
  components: {
    SideNavigation
  },
  data: () => ({
    //
  }),
};
</script>

