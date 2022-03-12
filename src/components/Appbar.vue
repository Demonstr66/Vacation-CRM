<template>
  <v-app-bar app dense flat>
    <v-app-bar-nav-icon @click="onNavIconClick">
      <v-icon v-if="expand">mdi-window-close</v-icon>
    </v-app-bar-nav-icon>

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
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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
    menu: [{ title: "Выход", action: "onSignOut" }],
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
      this.$store.dispatch("signOut").then(() => {
        this.$router.push("/login");
        this.$store.commit("setMessage", {
            type: "warning",
            text: "Вы вышли из аккаунта"
          });
      })
      .catch(err => {
        this.$store.commit("setMessage", {
            type: "error",
            code: err.code,
            text: err.message
          });
      });
    },
  },
};
</script>