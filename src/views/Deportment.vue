<template>
  <layout title="Структура">
    <v-row>
      <v-col cols="10">
        <v-tabs>
          <v-tab>Сотрудники</v-tab>
          <v-tab>Команды</v-tab>
          <v-tab>Архив</v-tab>
        </v-tabs></v-col
      >
      <v-col cols="2" class="justify-self-end">
        <v-menu transition="slide-y-transition" bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on">
              Импорт
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in importItems" :key="i" link>
              <v-list-item-title @click="onImport(item.type)">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu transition="slide-y-transition" bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on">
              Экспорт
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in importItems" :key="i" link>
              <v-list-item-title @click="onImport(item.type)">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col></v-row
    >
    <v-row>
      <v-col>
        <v-list>
          <v-subheader>Сотрудники</v-subheader>
          <v-list-item v-for="(person, id) in persons" :key="id">
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-list-item-title>{{ person.fullName }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    person.email
                  }}</v-list-item-subtitle>
                </v-col>
                <v-spacer />
                <v-col cols="2">
                  Команда:<br />
                  <small v-if="person.inTeams.length === 0">Пока не в команде</small>
                  <v-chip
                    v-else
                    v-for="(team, index) in person.inTeams"
                    :key="index"
                  >
                    {{ getTeamLabel(team) }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </layout>
</template>




<script>
import layout from "../layouts/Main.vue";

export default {
  components: {
    layout,
  },
  data: () => ({
    importItems: [{ title: "Excel (.xlsx)", type: "excel" }],
    persons: [
      {
        fullName: "Дмитрий Филиппов",
        email: "Demonstr66@yandex.ru",
        inTeams: [],
      },
      {
        fullName: "Дмитрий Филиппов",
        email: "Demonstr66@yandex.ru",
        inTeams: [1],
      },
      {
        fullName: "Дмитрий Филиппов",
        email: "Demonstr66@yandex.ru",
        inTeams: [1, 2],
      },
      {
        fullName: "Дмитрий Филиппов",
        email: "Demonstr66@yandex.ru",
        inTeams: [3],
      },
    ],
    teams: [
      { id: 1, label: "iField" },
      { id: 2, label: "Dimensions" },
      { id: 3, label: "Tiburon" },
    ],
  }),
  methods: {
    onImport(type) {
      console.log("import " + type);
    },
    getTeamLabel(teamId) {
      return this.teams.filter((t) => t.id === teamId)[0].label;
    },
  },
};
</script>