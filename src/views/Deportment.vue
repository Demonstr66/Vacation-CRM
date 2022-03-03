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
        <v-list v-if="persons.length">
          <v-list-item v-for="(person, id) in persons" :key="id">
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-list-item-title>{{ person.fullname }}</v-list-item-title>
                  <v-list-item-subtitle
                    tag="a"
                    :href="'mailto:' + person.email"
                    >{{ person.email }}</v-list-item-subtitle
                  >
                </v-col>
                <v-spacer />
                <v-col cols="2">
                  <div v-if="person.inTeams && person.inTeams.length === 0">
                    <v-chip
                      v-for="(team, index) in person.inTeams"
                      :key="index"
                    >
                      {{ getTeamLabel(team) }}
                    </v-chip>
                  </div>
                  <small v-else>Пока не в команде</small>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <span v-else> Не добавлено ни одного сотрудника </span>
      </v-col>
    </v-row>
    <ImportModal
      :show="showImportModal"
      @cancel="onCancel"
      @submit="onSubmit"
    />
  </layout>
</template>




<script>
import layout from "../layouts/Main.vue";
import ImportModal from "../components/ImportModal.vue";

export default {
  components: {
    layout,
    ImportModal,
  },
  data: () => ({
    showImportModal: false,
    importItems: [{ title: "Excel (.xlsx)", type: "excel" }],
    persons: [],
    teams: [
      { id: 1, label: "iField" },
      { id: 2, label: "Dimensions" },
      { id: 4, label: "Tiburon" },
    ],
  }),
  mounted() {
    const persons = localStorage.getItem('persons')

    if (persons) this.persons = JSON.parse(persons)
  },
  methods: {
    onImport(type) {
      this.showImportModal = true;
    },
    closeModal() {
      this.showImportModal = false;
    },
    onCancel() {
      this.closeModal()
    },
    onSubmit(persons) {
      this.persons = persons
      this.savePersons(persons)
      this.closeModal()
    },
    savePersons(persons) {
      localStorage.setItem("persons", JSON.stringify(persons))
    },
    getTeamLabel(teamId) {
      const notFoundText = "Команда id: ";
      const team = this.teams.filter((t) => t.id === teamId);

      return team.length ? team[0].label : notFoundText + teamId;
    },
  },
};
</script>