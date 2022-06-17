<template>
  <div>
    <SideNavigation
      :expand="expandNavigation"
      @close="expandNavigation = false"
    />
    <Appbar :expand="expandNavigation" :title="title" app @click="onExpandClick"/>
    <the-app-loader v-if="loading"></the-app-loader>
    <v-main>
      <div class="mt-0 mt-md-8 px-0 px-md-8">
        <span v-if="$vuetify.breakpoint.smAndUp && !!title" class="text-h4 ml-1 mb-1">{{
            title
          }}</span>
        <v-sheet
          :elevation="$vuetify.breakpoint.mdAndUp ? 2 : 0"
          class="pa-1 pa-md-3"
          color="white"
          min-height="100px"
        >
          <router-view></router-view>
        </v-sheet>
      </div>
    </v-main>
  </div>
</template>

<script>
import SideNavigation from "../components/TheSideBar.vue";
import Appbar from "../components/Appbar.vue";
import TheAppLoader from "@/components/TheAppLoader";

export default {
  components: {
    TheAppLoader,
    SideNavigation,
    Appbar,
  },
  props: {
    title: String,
    loading: Boolean
  },
  data: () => ({
    expandNavigation: false,
  }),
  methods: {
    onExpandClick() {
      this.expandNavigation = !this.expandNavigation;
    },
  },
};
</script>
