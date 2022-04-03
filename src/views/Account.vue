<template>
  <v-row>
    <v-col>
      <pers-user-info :data="user"></pers-user-info>
    </v-col>
    <v-col>
      <account-user-info
        :data="user"
        disabled
      ></account-user-info>
    </v-col>
  </v-row>
</template>

<script>
import persUserInfo from "../components/user/info/personal.vue";
import accountUserInfo from "../components/user/info/account.vue";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    persUserInfo,
    accountUserInfo,
  },
  data: () => ({
    items: [],
    tasks: [
      { id: 1, label: "task1" },
      { id: 2, label: "task2" },
      { id: 3, label: "task3" },
    ],
    userTasks: [1, 2],
    team: 1,
    isChanged: false,
  }),
  mounted() {
    this.$store.dispatch("user/getCurrentUserData");
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("user/update", this.user)
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Данные сохранены",
          })
        )
        .then((this.isChanged = false));
    },
  },
};
</script>