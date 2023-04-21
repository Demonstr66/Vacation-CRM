<template>
  <div>
    <app-base-sheet>
      <v-tabs
          v-model="activeTab"
      >
        <v-tab
            v-for="tab in $options.TABS"
            :key="tab.id"

        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </app-base-sheet>
    <v-tabs-items v-model="activeTab" style="background: inherit">
      <v-tab-item
          v-for="tab in $options.TABS"
          :key="tab.id"
      >
        <component :is="tab.component"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>

import Users from "@/components/Organization/Users";
import Structure from "@/components/Organization/Structure";
import AppBaseSheet from "@/components/UI/app-base-sheet";

const TABS = [
  {id: 1, name: "Сотрудники", route: 'OrganizationUsers', component: 'Users'},
  {id: 2, name: "Структура", route: 'OrganizationStructure', component: 'Structure'}
]

export default {
  name: "Administration",
  components: {AppBaseSheet, Structure, Users},
  props: {
    sidebarData: {}
  },
  TABS,
  data: () => ({
    activeTab: 1,
  }),
  created() {
    const name = this.$route.name
    const id = this.$options.TABS.findIndex(tab => tab.route === name)
    if (this.activeTab !== id) {
      this.activeTab = id
    }
  },
  watch: {
    activeTab(id) {
      const name = this.$options.TABS[id]?.route
      if (this.$route.name !== name) {
        this.$router.push({name})
      }
    }
  }
};
</script>

<style scoped>
.v-slide-group__prev--disabled {
  display: none !important;
}

.v-window,
.v-window__container,
.v-window * {
  overflow: initial !important;
  overflow-x: clip !important;
}
</style>