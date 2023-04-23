<template>
  <v-list-group
      :value="true"
      :sub-group="subGroup"
      :no-action="noAction"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <account-nav-title :title="title"/>
      </v-list-item-content>
    </template>
    <slot/>
  </v-list-group>
</template>

<script>
import AccountNavTitle from "@/components/Settings/settings-nav-title";

export default {
  inheritAttrs: true,
  name: "account-nav-header",
  components: {AccountNavTitle},
  props: {
    title: {
      type: String,
      default: ""
    },
    subGroup: {
      type: Boolean,
      default: false
    },
    noAction: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>