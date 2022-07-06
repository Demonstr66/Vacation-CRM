<template>
  <v-row no-gutters>
    <v-col>
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
    <v-col>
      <TheVacations
        :uid="user ? user.uid : null"
        :vacations="vacations"
      ></TheVacations>
    </v-col>
  </v-row>
</template>

<script>
import {users} from "@/mixins/ComputedData";
import TheVacations from "@/components/TheVacations";

import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";

export default {
  name: "User",
  components: {TheVacations, TheUserInfo, TheAccountInfo},
  mixins: [users],
  data: () => ({
    user: null,
    vacations: []
  }),
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      const uid = this.$route.params.uid
      this.user = this.users[uid]
      if (!this.user) return this.$router.replace({name: 'Administration'})

      this.vacations = this.$store.getters['vacations/getByUid'](this.user.uid)
    },
  }
}
</script>

<style scoped>

</style>