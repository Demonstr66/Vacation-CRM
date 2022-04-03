<template>
  <div>
    <SideNavigation
      :expand="expandNavigation"
      @close="expandNavigation = false"
    />
    <Appbar @click="onExpandClick" :expand="expandNavigation" />
    <v-main>
      <div class="mt-8 px-7 mx-0">
        <span class="text-h3 ml-1 mb-1">{{ title }}</span>
        <v-sheet
          color="white"
          elevation="2"
          class="px-3 py-3"
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
