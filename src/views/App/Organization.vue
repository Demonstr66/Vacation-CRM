<template>
  <div>
    <app-tabs-nav v-model="currentTab" :tabs="$options.TABS"/>
    <!--    <v-tabs-items v-model="currentTab" style="background: inherit">-->
    <!--      <v-tab-item-->
    <!--          v-for="tab in $options.TABS"-->
    <!--          :key="tab.name"-->
    <!--      >-->
    <!--        <component :is="tab.component"/>-->
    <!--      </v-tab-item>-->
    <!--    </v-tabs-items>-->
    <router-view/>
  </div>
</template>

<script>
import Employees from "@/components/Organization/pages/Employees";
import Structure from "@/components/Organization/pages/Structure";
import AppBaseSheet from "@/components/UI/app-base-sheet";
import AppTabsNav from "@/components/UI/app-tabs-nav";

const TABS = [
  {name: 'OrganizationEmployees', title: "Сотрудники", component: 'Employees'},
  {name: 'OrganizationStructure', title: "Структура", component: 'Structure'}
]

export default {
  name: "Administration",
  components: {AppTabsNav, AppBaseSheet, Structure, Employees},
  TABS,
  data() {
    return {
      currentTab: 0
    }
  }
};
</script>
