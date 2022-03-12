<template>
  <div>
    <SideNavigation :expand="expandNavigation" />
    <Appbar @click="onExpandClick" :expand="expandNavigation" />
    <v-main>
      <v-container class="mx-16 mt-8">
        <span class="text-h3 ml-1 mb-1">{{ title }}</span>
        <v-sheet
          color="white"
          elevation="2"
          width="90%"
          class="px-3 py-3"
          min-height="100px"
        >
          <router-view></router-view>
        </v-sheet>
      </v-container>
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
