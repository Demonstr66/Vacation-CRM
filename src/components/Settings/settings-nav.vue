<template>
  <app-base-sheet>
    <v-list subheader>
      <v-list-item-group
          mandatory
          v-model="page"
          @change="onChangePage"
          color="primary"
      >
        <account-nav-item v-for="(item, idx) in items" :key="idx" :item="item"/>
      </v-list-item-group>
    </v-list>
  </app-base-sheet>
</template>

<script>

import AccountNavItem from "@/components/Settings/settings-nav-item";
import AccountNavHeader from "@/components/Settings/settings-nav-header";
import AccountNavItemProvider from "@/components/Settings/settings-nav-item-provider";
import AppBaseSheet from "@/components/UI/app-base-sheet";

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