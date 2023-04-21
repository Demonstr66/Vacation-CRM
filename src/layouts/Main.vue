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
        <span v-if="$vuetify.breakpoint.smAndUp && !!title" class="text-h4 ml-1 mb-1">
          {{ title }}</span>
        <app-base-sheet>
          <router-view/>
        </app-base-sheet>
      </div>
    </v-main>
  </div>
</template>

<script>
import SideNavigation from "../components/layout/app-navigation.vue";
import Appbar from "../components/layout/app-bar.vue";
import TheAppLoader from "@/components/TheAppLoader";
import AppBaseSheet from "@/components/UI/app-base-sheet";

export default {
  components: {
    AppBaseSheet,
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
  }
};
</script>
