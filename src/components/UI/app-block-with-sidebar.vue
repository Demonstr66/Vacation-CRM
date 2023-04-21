<template>
  <div>
    <div class="d-flex flex-wrap" :class="{'flex-row-reverse': left}" style="max-width: 100%; position: relative">
      <div
          class="flex-shrink-1 flex-grow-1 main-block"
          :style="!isMobile ? mainBlockMd : ''"
          style="order: 1"
      >
        <slot name="main"/>
      </div>
      <div
          v-if="!isMobile || noHideSidebar"
          class="flex-grow-0 flex-shrink-0 side-block"
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
        :right="!bottom"
        :bottom="bottom"
        temporary
        touchless
        style="z-index: 100; padding-top: 14px"
    >
      <slot name="navbar"/>
    </v-navigation-drawer>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AppBaseSheet from "@/components/UI/app-base-sheet";

export default {
  name: 'app-block-sidebar',
  props: {
    noHideSidebar: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    sideBlockWidth: {
      type: [String, Number],
      default: 250
    },
    bottom: {
      type: Boolean,
      default: false
    },

  },
  components: {AppBaseSheet, IconBtnWithTip},
  data: () => ({
    drawer: false
  }),
  provide() {
    return {openSidebar: this.openSidebar}
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
    openSidebar() {
      this.drawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main-block {
  max-width: 100%;
}

</style>