<template>
  <v-row class="pa-0 ma-0">
    <v-col cols="12" md="6" class="pa-0 ma-0">
      <pers-user-info :data="user"></pers-user-info>
    </v-col>
    <v-col cols="12" md="6" class="pa-0 ma-0">
      <account-user-info :data="user" disabled></account-user-info>
    </v-col>
    <v-col cols="12" md="6" class="pa-0 ma-0">
      <info></info>
    </v-col>
  </v-row>
</template>

<script>
import persUserInfo from "../components/user/info/personal.vue";
import accountUserInfo from "../components/user/info/account.vue";

import {mapState} from "vuex";
import Info from "@/components/workspace/info";

export default {
  components: {
    Info,
    persUserInfo,
    accountUserInfo,
  },
  mounted() {
    this.$store.dispatch("user/getCurrentUserData");
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
};
</script>