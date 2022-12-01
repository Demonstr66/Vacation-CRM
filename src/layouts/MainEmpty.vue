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
        <span v-if="$vuetify.breakpoint.smAndUp && !!title" class="display-1 ml-1 mb-1">
          {{ title }}</span>
        <router-view/>
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
  created() {
    let item = localStorage.getItem('navbarIsOpened')
    if (item && item != false) {
      this.expandNavigation = true
    }
  },
  computed: {
    route() {
      return this.$route
    }
  },
  methods: {
    onExpandClick() {
      this.expandNavigation = !this.expandNavigation;
    },
  },
  watch: {
    route(val) {
      this.rightSidebar = !!val.meta.RightSidebar
    },
    expandNavigation(val) {
      localStorage.setItem('navbarIsOpened', val)
    }
  }
};
</script>
