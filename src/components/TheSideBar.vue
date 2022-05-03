<template>
  <v-navigation-drawer
    v-model="isExpand"
    :mini-variant="!isExpand"
    :permanent="!$vuetify.breakpoint.mobile"
    app
    clipped
  >
    <v-list v-if="!loading" dense nav>
      <v-list-item
        link
        to="/"
      >
        <v-list-item-icon>
          <v-icon>
            mdi-home
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          На главную
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="(link, idx) in links"
        :key="idx"
        :to="{name: link.path}"
        link
      >
        <v-list-item-icon>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list v-else dense nav>
      <v-skeleton-loader type="list-item">
      </v-skeleton-loader>
      <v-divider></v-divider>
      <v-skeleton-loader
        v-for="(link, idx) in links"
        :key="idx"
        type="list-item"
      />
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
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    links: [
      {path: 'Schedules', icon: 'mdi-folder', title: 'Графики отпусков'},
      {path: 'Vacations', icon: 'mdi-star', title: 'Мои отпуска'},
      {path: 'Deportment', icon: 'mdi-account-group', title: 'Команда'},
    ]
  }),
  computed: {
    isExpand: {
      get: function () {
        return this.expand;
      },
      set: function (val) {
        if (!val) this.$emit("close");
      },
    },
  },
};
</script>

