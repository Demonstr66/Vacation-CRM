<template>
  <app-base-sheet>
    <v-list dense subheader>
      <v-list-item-group
          mandatory
          v-model="page"
          @change="onChangePage"
          color="primary"
      >
        <account-nav-item v-for="item in items" :key="item.id" :item="item"/>
      </v-list-item-group>
    </v-list>
  </app-base-sheet>
</template>

<script>

import AccountNavItem from "@/components/Account/account-nav-item";
import AccountNavHeader from "@/components/Account/account-nav-header";
import AccountNavItemProvider from "@/components/Account/account-nav-item-provider";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: "account-nav",
  components: {AppBaseSheet, AccountNavItemProvider, AccountNavHeader, AccountNavItem},
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      page: null
    }
  },
  methods: {
    onChangePage(pageId) {
      switch (pageId) {
        case 0:
          this.addHash('user-info');
          break;
        case 2:
          this.addHash('vacation-user-info');
          break;
        case 3:
          this.addHash('vacation-template');
          break;
      }
    },
    addHash(hash) {
      // this.$router.push('#' + hash)
    }
  }
}
</script>

<style scoped>

</style>