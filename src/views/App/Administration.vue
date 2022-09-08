<template>
  <div>
    <app-base-sheet>
      <v-tabs
        v-model="activeTab"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </app-base-sheet>
    <v-tabs-items v-model="activeTab" style="background: inherit">
      <v-tab-item
        v-for="tab in tabs"
        :key="tab.id"
      >
        <component :is="tab.component"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>

import Users from "@/components/Administration/Users";
import Structure from "@/components/Administration/Structure";
import Archive from "@/components/Administration/Archive";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: "Administration",
  components: {AppBaseSheet, Archive, Structure, Users},
  props: {
    sidebarData: {}
  },
  data: () => ({
    activeTab: 0,
    tabs: [
      {id: 1, name: "Сотрудники", route: 'Tab1', component: 'Users'},
      {id: 2, name: "Структура", route: 'Tab2', component: 'Structure'},
      // {id: 3, name: "Архив", route: 'Tab3', component: 'Archive'}
    ]
  }),
  created() {
    const name = this.$route.name
    const id = this.tabs.findIndex(tab => tab.route === name)
    if (this.activeTab !== id) this.activeTab = id
  },
  watch: {
    activeTab(id) {
      const name = this.tabs[id].route
      if (this.$route.name !== name) this.$router.replace({name})
    },
    sidebarData(val) {
      console.log(val)
    }
  }
};
</script>

<style lang="css">
.v-slide-group__prev--disabled {
  display: none !important;
}
</style>