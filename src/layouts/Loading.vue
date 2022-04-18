<template>
  <div>
    <SideNavigation
      :expand="expandNavigation"
      loading
      @close="onExpandClick"
    />
    <Appbar :expand="expandNavigation" :title="title" @click="onExpandClick"/>
    <v-main>
          <v-overlay color="info">
            <v-progress-circular indeterminate size="50" width="6" color="primary">
            </v-progress-circular>
          </v-overlay>
    </v-main>
  </div>
</template>

<script>
import SideNavigation from "@/components/TheSideBar";
import Appbar from "@/components/Appbar";

export default {
  name: "Loading",
  components: {
    SideNavigation,
    Appbar,
  },
  props: {
    title: String,
  },
  data: () => ({
    expandNavigation: false,
  }),
  methods: {
    onExpandClick() {
      console.log('onExpandClick')
      this.expandNavigation = !this.expandNavigation;
    },
  },
}
</script>

<style scoped>

</style>