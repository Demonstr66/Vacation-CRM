<template>
  <v-row class="pa-0 ma-0">
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <pers-user-info :user="user"></pers-user-info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <account-user-info :user="user" disabled></account-user-info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <info></info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <TheTemplateVacationFile></TheTemplateVacationFile>
    </v-col>
  </v-row>
</template>

<script>
import persUserInfo from "../components/user/info/personal.vue";
import accountUserInfo from "../components/user/info/account.vue";
import Info from "@/components/workspace/info";
import TheTemplateVacationFile from "@/components/workspace/TheTemplateVacationFile";
import {user} from "@/mixins/ComputedData";

export default {
  name: 'Account',
  mixins: [user],
  components: {
    TheTemplateVacationFile,
    Info,
    persUserInfo,
    accountUserInfo,
  },
};
</script>
