<template>
  <v-app-bar app dense flat clipped-left>
    <v-app-bar-nav-icon @click="onNavIconClick"></v-app-bar-nav-icon>

    <v-app-bar-title>{{ appName }}</v-app-bar-title>

    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Аккаунт </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menu"
          :key="index"
          link
          @click="onMenuItemClick(item.action)"
        >
          <v-list-item-title class="d-flex flex-row justify-space-between">
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    expand: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    user: {
      name: "",
    },
    menu: [
      { title: "Аккаунт", action: "onAccount", icon: "mdi-cog" },
      { title: "Выход", action: "onSignOut", icon: "mdi-exit-to-app" },
    ],
  }),
  computed: {
    ...mapState(["appName"]),
  },
  methods: {
    onNavIconClick() {
      this.$emit("click");
    },
    onMenuItemClick(action) {
      if (!this[action]) return;

      this[action]();
    },
    onSignOut() {
      this.$store
        .dispatch("signOut")
        .then(() => {
          this.$router.push("/login");
          this.$store.dispatch("setMessage", {
            type: "warning",
            text: "Вы вышли из аккаунта",
          });
        })
        .catch((err) => {
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        });
    },
    onAccount() {
      this.$router.push('/account')
    }
  },
};
</script>