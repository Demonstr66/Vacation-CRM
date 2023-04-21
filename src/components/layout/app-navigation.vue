<template>
  <v-navigation-drawer
      v-model="isExpand"
      :mini-variant="!isExpand"
      :permanent="!$vuetify.breakpoint.mobile"
      style="z-index: 20"
      clipped
      app
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
      <template
          v-for="(link, idx) in links"
      >
        <v-list-group
            v-if="link.children && link.children.length"
            :key="idx"

            :value="isCurrentGroup(link.children)"
            no-action
            :prepend-icon="link.icon"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ link.header }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <app-navigation-link
              v-for="(subLink, subIdx) in link.children"
              class="pl-6"
              :key="idx + '_' + subIdx"
              :link="subLink"
          />
          <v-divider></v-divider>
        </v-list-group>
        <app-navigation-link v-else :link="link" :key="idx"/>
      </template>
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
import AppNavigationLink from "@/components/layout/app-navigation-link";

export default {
  name: "SideNavigation",
  components: {AppNavigationLink},
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
      {
        header: 'Отспуска',
        icon: 'mdi-calendar-outline',
        children: [
          {path: 'Schedules', icon: 'mdi-folder', title: 'Графики'},
          {path: 'Vacations', icon: 'mdi-star', title: 'Мои отпуска'},
          {path: 'Stats', icon: 'mdi-chart-donut', title: 'Настройка '},
        ]
      },
      {
        header: 'Цели',
        icon: 'mdi-bullseye-arrow',
        children: [
          {path: 'Intervals', icon: 'mdi-folder', title: 'Периоды'},
          {path: 'GoalViewer', icon: 'mdi-chart-donut', title: 'Просмотр'},
          {path: 'Goals', icon: 'mdi-star', title: 'Мои цели'}
        ]
      },
      {path: 'Tab1', icon: 'mdi-account-group', title: 'Команда'},
    ]
  }),
  computed: {
    isExpand: {
      get: function () {
        return this.expand;
      },
      set: function (val) {
        if (!val) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    isCurrentGroup(children) {
      const currPathName = this.$route.name
      return children.some(child => child.path === currPathName)
    }
  }
};
</script>

