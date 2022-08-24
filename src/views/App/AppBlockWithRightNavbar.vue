<template>
  <div>
    <v-row class="my-0">
      <v-col cols="12" lg="9">
        <slot name="main"/>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.lgAndUp">
        <slot name="navbar"/>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndDown"
      v-model="drawer"
      app
      clipped
      right
      temporary
    >
      <slot name="navbar"/>
    </v-navigation-drawer>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";

export default {
  name: 'app-block-with-right-navbar',
  components: {IconBtnWithTip},
  props: {
    showBar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawer: {
      get: function () {
        return this.showBar
      },
      set: function (val) {
        this.$emit('update:showBar', val)
      }
    }
  }
}
</script>