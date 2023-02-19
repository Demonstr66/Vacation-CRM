<template>
  <v-divider v-if="item.divider"/>
  <v-subheader v-else-if="item.header">
    {{ item.header }}
  </v-subheader>
  <v-list-item v-else-if="!item.header" :value="item.id" link :to="item.to.name">
    <v-list-item-content>
      <account-nav-title :title="item.text"/>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import AccountNavTitle from "@/components/Account/account-nav-title";

export default {
  name: "account-nav-item",
  components: {AccountNavTitle},
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>