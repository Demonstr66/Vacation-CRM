<template>
  <account-nav-header
      v-if="item.children && item.children.length > 0"
      :title="item.text"
      :sub-group="!item.root"
      :no-action="item.root"
  >
    <account-nav-item-provider v-for="child in item.children" :key="child.id" :item="child"/>
  </account-nav-header>
  <account-nav-item v-else :title="item.text"/>
</template>

<script>
import AccountNavHeader from "@/components/Settings/settings-nav-header";
import AccountNavItem from "@/components/Settings/settings-nav-item";

export default {
  name: "account-nav-item-provider",
  components: {AccountNavHeader, AccountNavItem},

  props: {
    item: {
      type: [Array, Object],
      required: true
    },
    text: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>