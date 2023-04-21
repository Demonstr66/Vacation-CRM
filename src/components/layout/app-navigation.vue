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
      <template
          v-for="(item, idx) in links"
      >
        <v-list-group
            v-if="item.children && item.children.length"
            :key="idx"

            :value="item.module === $route.meta.module"
            no-action
            :prepend-icon="item.icon"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.header }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <app-navigation-link
              v-for="(subLink, subIdx) in item.children"
              class="pl-6"
              :key="idx + '_' + subIdx"
              :link="subLink"
          />
        </v-list-group>
        <v-divider v-else-if="item.divider"></v-divider>
        <app-navigation-link v-else :link="item" :key="idx"/>
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
    <v-btn @click="console" text block outlined color="deep-purple">console</v-btn>
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
        to: '/',
        icon: 'mdi-home',
        title: 'На главную'
      },
      {divider: true},
      {
        module: 'vacation',
        header: 'Отспуска',
        icon: 'mdi-calendar-outline',
        children: [
          {to: {name: 'Schedules'}, icon: 'mdi-folder', title: 'Графики'},
          {to: {name: 'Vacations'}, icon: 'mdi-star', title: 'Мои отпуска'},
          {to: {name: 'Stats'}, icon: 'mdi-chart-donut', title: 'Настройка '},
        ]
      },
      {divider: true},
      {
        module: 'goals',
        header: 'Цели',
        icon: 'mdi-bullseye-arrow',
        children: [
          {to: {name: 'Intervals'}, icon: 'mdi-folder', title: 'Периоды'},
          {to: {name: 'GoalViewer'}, icon: 'mdi-chart-donut', title: 'Просмотр'},
          {to: {name: 'Goals'}, icon: 'mdi-star', title: 'Мои цели'}
        ]
      },
      {divider: true},
      {to: {name: 'OrganizationUsers'}, icon: 'mdi-account-group', title: 'Команда'},
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
    isCurrentGroup(module) {
      const currModuleName = this.$route.meta.module
      return currModuleName === module
    },
    console() {
      console.log(this.$router)
      console.log(this.$route)
    }
  }
};
</script>

