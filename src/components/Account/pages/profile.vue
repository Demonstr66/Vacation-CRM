<template>
  <v-row no-gutters>
    <v-col cols="12">
      <the-user-info
          height="100%"
          :disabled="!$can('updatePersonalData', user)"
          :user="user"
          solo
      />
      <the-account-info
          :user="user"
          disable-all
          solo
      />
    </v-col>
  </v-row>
</template>

<script>
import {User} from "@/plugins/servises/User";
import TheUserInfo from "@/components/TheUserInfo";
import TheAccountInfo from "@/components/TheAccountInfo";

export default {
  name: "profile",
  components: {TheAccountInfo, TheUserInfo},
  computed: {
    user() {
      return new User(this.$store.getters['currentUser/get'])
    }
  },
}
</script>

<style scoped>

</style>