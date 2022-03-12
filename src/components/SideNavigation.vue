<template>
  <v-navigation-drawer app :mini-variant="!expand" :expand-on-hover="!expand">
    <v-list nav dense>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-calendar-month-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>График отпусков</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item link to="/vacations">
        <v-list-item-icon>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Мои отпуска</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/deportment">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Структура отдела</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-star</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Starred</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "SideNavigation",
  props: {
    expand: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({}),
};
</script>
