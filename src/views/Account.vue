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
    <v-col cols="12" md="6" class="pa-0 ma-0">
      <TheTemplateVacationFile></TheTemplateVacationFile>
    </v-col>
  </v-row>
</template>

<script>
import persUserInfo from "../components/user/info/personal.vue";
import accountUserInfo from "../components/user/info/account.vue";

import {mapState} from "vuex";
import Info from "@/components/workspace/info";
import TheTemplateVacationFile from "@/components/workspace/TheTemplateVacationFile";

export default {
  components: {
    TheTemplateVacationFile,
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

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 100px 40px 100px;
  grid-gap: 30px;
  grid-template-areas: "a a" "b b";
}
.grid_item:nth-child(1) {
  grid-area: 1 / auto / 2 / auto;
  /*grid-area: a / auto / b / auto; тоже самое что и выше*/
}

.grid_item:nth-child(3) {
  grid-area: 2 / auto / 2 / auto;
  /*grid-area: b / auto / c / auto; тоже самое что и выше*/
}

.grid_item:nth-child(3) {
  grid-area: 1 / auto / 3 / auto;
  /*grid-area: a / auto / b / auto; тоже самое что и выше*/
}

</style>