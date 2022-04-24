<template>
  <v-app-bar absolute app clipped-left dense flat>
    <v-app-bar-nav-icon @click="onNavIconClick"></v-app-bar-nav-icon>

    <!-- <v-app-bar-title v-if="$vuetify.breakpoint.smAndUp">{{ appName }}</v-app-bar-title> -->
    <!-- <v-app-bar-title v-else>{{ title }}</v-app-bar-title> -->
    <v-app-bar-title>{{ $vuetify.breakpoint.name }}</v-app-bar-title>

    <v-spacer></v-spacer>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" text dark tile large v-bind="attrs" v-on="on">
          <v-icon large>mdi-account</v-icon>
          {{ user.displayName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menu"
          :key="index"
          link
          @click="onMenuItemClick(item.action)"
        >
          <v-list-item-title class="d-flex flex-row justify-space-between">
            {{ item.title }}
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import {appName, user} from "@/mixins/ComputedData";
import {accountMethods} from "@/mixins/AccountMethods";

export default {
  mixins: [user, appName, accountMethods],
  props: {
    expand: {
      type: Boolean,
      required: true,
    },
    title: String,
  },
  data: () => ({
    menu: [
      {title: "Аккаунт", action: "onAccount", icon: "mdi-cog"},
      {title: "Выход", action: "onSignOut", icon: "mdi-exit-to-app"},
    ],
  }),
  methods: {
    onNavIconClick() {
      this.$emit("click");
    },
    onMenuItemClick(action) {
      if (!this[action]) return;

      this[action]();
    },
    onSignOut() {
      this.mixSignOut()
      // this.$store
      //   .dispatch("signOut")
      //   .then(() => {
      //     this.$router.push("/login");
      //     this.$store.dispatch("setMessage", {
      //       type: "warning",
      //       text: "Вы вышли из аккаунта",
      //     });
      //   })
      //   .then(() => {
      //     this.$store.dispatch("clearAllPersData");
      //   })
      //   .catch((err) => {
      //     this.$store.dispatch("setMessage", {
      //       type: "error",
      //       code: err.code,
      //       text: err.message,
      //     });
      //   });
    },
    onAccount() {
      if (this.$route.name == 'Account') return
      this.$router.push({name: 'Account'});
    },
  },
};
</script>