<template>
  <div>
    <!--    <v-row no-gutters>-->
    <!--      <v-col cols="12" md="9">-->
    <!--        <app-base-sheet>-->
    <!--          <slot name="main"/>-->
    <!--        </app-base-sheet>-->
    <!--      </v-col>-->
    <!--      <v-col v-if="$vuetify.breakpoint.mdAndUp">-->
    <!--        <slot name="navbar"/>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <div class="d-flex flex-wrap" style="max-width: 100%; position: relative">
      <div
        class="flex-shrink-1 flex-grow-1 main-block"
        :style="!isMobile ? mainBlockMd : ''"
        style="order: 1"
      >
        <slot name="main"/>
      </div>
      <div
        v-if="!isMobile || noHideSidebar"
        class="flex-grow-0 flex-shrink-0"
        :style="sideBlock"
      >
        <div class="side-block">
          <slot name="navbar"/>
        </div>
      </div>
    </div>
    <v-navigation-drawer
      v-if="isMobile && !noHideSidebar"
      v-model="drawer"
      app
      clipped
      right
      temporary
      touchless
    >
      <slot name="navbar"/>
    </v-navigation-drawer>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: 'app-block-with-right-navbar',
  props: {
    noHideSidebar: {
      type: Boolean,
      default: false
    },
    sideBlockWidth: {
      type: [String, Number],
      default: 250
    }
  },
  components: {AppBaseSheet, IconBtnWithTip},
  data: () => ({
    drawer: false
  }),
  provide() {
    return {openRightSidebar: this.openRightSidebar}
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    mainBlockMd() {
      return `max-width: calc(100% - ${this.sideBlockWidth}px) !important;`
    },
    sideBlock() {
      const flex = this.isMobile ? 'order: 0; min-width: 100%;' : 'order: 2'
      return `min-width: ${this.sideBlockWidth}px; max-width: ${this.sideBlockWidth}px; ${flex}`
    }
  },
  methods: {
    openRightSidebar() {
      this.drawer = true
    }
  }
}
</script>

<style scoped>
.main-block {
  max-width: 100%;
}
</style>