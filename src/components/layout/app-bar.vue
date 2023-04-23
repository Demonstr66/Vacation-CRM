<template>
  <v-app-bar absolute app clipped-left dense flat style="position: fixed; z-index: 10">
    <v-app-bar-nav-icon @click="onNavIconClick"></v-app-bar-nav-icon>

    <v-app-bar-title v-if="$options.DEBUG">{{ $vuetify.breakpoint.name }}</v-app-bar-title>
    <template v-else>
      <v-app-bar-title v-if="$vuetify.breakpoint.smAndUp">{{ appName }}</v-app-bar-title>
      <v-app-bar-title v-else>{{ title }}</v-app-bar-title>
    </template>
    <v-spacer></v-spacer>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark large text tile v-bind="attrs" v-on="on">
          <v-icon large>mdi-account</v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">{{ user.displayName }}</span>
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
import {signOut} from "@/mixins/AuthMethods";

export default {
  name: 'app-bar',
  DEBUG: process.env.VUE_APP_DEBUG,
  mixins: [user, signOut],
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
  computed: {
    appName() {
      return this.$store.getters['app/getAppName']
    }
  },
  methods: {
    onNavIconClick() {
      this.$emit("click");
    },
    onMenuItemClick(action) {
      if (!this[action]) {
        return;
      }

      this[action]();
    },
    onSignOut() {
      this.signOut()
    },
    onAccount() {
      if (this.$route.name == 'Settings') {
        return
      }
      this.$router.push({name: 'SettingProfile'});
    },
  },
};
</script>