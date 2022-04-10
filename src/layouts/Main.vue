<template>
  <div>
    <SideNavigation
      :expand="expandNavigation"
      @close="expandNavigation = false"
    />
    <Appbar @click="onExpandClick" :expand="expandNavigation" :title="title"/>
    <v-main>
      <div class="mt-0 mt-md-8 px-0 px-md-8">
        <span v-if="$vuetify.breakpoint.smAndUp" class="text-h4 ml-1 mb-1">{{ title }}</span>
        <v-sheet
          color="white"
          :elevation="$vuetify.breakpoint.mdAndUp ? 2 : 0"
          class="pa-1 pa-md-3"
          min-height="100px"
        >
          <router-view></router-view>
        </v-sheet>
      </div>
    </v-main>
  </div>
</template>

<script>
import SideNavigation from "../components/SideNavigation.vue";
import Appbar from "../components/Appbar.vue";

export default {
  components: {
    SideNavigation,
    Appbar,
  },
  props: {
    title: String,
  },
  data: () => ({
    expandNavigation: true,
  }),
  methods: {
    onExpandClick() {
      this.expandNavigation = !this.expandNavigation;
    },
  },
};
</script>
