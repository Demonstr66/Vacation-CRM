<template>
<v-row no-gutters>
  <v-col>
  <personal-user-info
    :user="user"
    disabled
  ></personal-user-info>
  <account-user-info
    :user="user"
    disabled
  ></account-user-info>
  </v-col>
  <v-col>
    <TheVacations
      :vacations="vacations"
      :uid="user ? user.uid : null"
    ></TheVacations>
  </v-col>
</v-row>
</template>

<script>
import {users} from "@/mixins/ComputedData";
import AccountUserInfo from "@/components/user/info/account";
import PersonalUserInfo from "@/components/user/info/personal";
import TheVacations from "@/components/TheVacations";

export default {
  name: "User",
  components: {TheVacations, PersonalUserInfo, AccountUserInfo},
  mixins:[users],
  data: () =>({
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