<template>
  <div>
    <v-row class="ma-0 pa-0 mb-3" justify="space-between">
      <v-col class="mx-0 pa-0" cols="12" sm="9">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab :to="{name: 'Tab1'}">Сотрудники</v-tab>
          <v-tab :to="{name: 'Tab2'}">Структура</v-tab>
          <v-tab :to="{name: 'Tab3'}">Архив</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: "Administration",
  data: () => ({
    activeTab: null
  })
};
</script>