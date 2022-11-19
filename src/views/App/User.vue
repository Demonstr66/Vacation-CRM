<template>
  <v-progress-linear indeterminate v-if="!appReady"/>
  <v-row v-else no-gutters>
    <v-col cols="12" md="4" lg="3" xl="3">
      <the-user-info
        :user="user"
        solo
        disabled
        hide-additional-fields
      ></the-user-info>
      <the-account-info
        solo
        :user="user"
        disable-all
      ></the-account-info>
    </v-col>
    <v-col cols="12" md="8" lg="9" xl="9">
      <app-base-sheet class="text-center">
        <span class="text-h5">Отпуска</span>
      </app-base-sheet>
      <TheVacations
        :uid="user ? user.uid : null"
        :vacations="vacations"
      ></TheVacations>
    </v-col>
  </v-row>
</template>

<script>
import {appReady, users} from "@/mixins/ComputedData";
import TheVacations from "@/components/TheVacations";

import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: "User",
  components: {AppBaseSheet, TheVacations, TheUserInfo, TheAccountInfo},
  mixins: [appReady],
  data: () => ({
    user: null,
    vacations: []
  }),
  created() {
    if (appReady) this.initialize()
  },
  methods: {
    initialize() {
      const uid = this.$route.params.uid
      this.user = this.$store.getters['users/getUserById'](uid)
      this.vacations = this.$store.getters['vacations/getByUid'](uid)
    },
  },
  watch: {
    appReady(val) {
      if (val) this.initialize()
    }
  }
}
</script>

<style scoped>

</style>