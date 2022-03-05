<template>
  <layout title="Структура">
    <v-row>
      <v-col cols="10">
        <v-tabs v-model="tab">
          <v-tab>Сотрудники</v-tab>
          <v-tab>Команды</v-tab>
          <v-tab>Архив</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="2" class="justify-self-end">
        <v-menu transition="slide-y-transition" bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="purple"
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
              :disabled="tab == 2"
            >
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
      </v-col>
    </v-row>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row v-if="persons.length">
          <v-col cols="10">
            <v-list>
              <v-list-item
                :class="isDrag ? 'dropable' : ''"
                @drop="onDrop"
                @dragover="onDrugOver($event)"
                @dragenter="onDrugEnter($event)"
                @dragleave="onDrugLeave($event)"
                v-for="(person, id) in persons"
                :key="id"
                :data-person="person.id"
              >
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title>{{
                        person.fullname
                      }}</v-list-item-title>
                      <v-list-item-subtitle
                        tag="a"
                        :href="'mailto:' + person.email"
                        >{{ person.email }}</v-list-item-subtitle
                      >
                    </v-col>
                    <v-spacer />
                    <v-col cols="3">
                      <div v-if="person.inTeams && person.inTeams.length !== 0">
                        <v-chip
                          v-for="(team, index) in person.inTeams"
                          :key="index"
                          :color="team.status=='dragg' ? 'accent' : team.status == 'repeat' ? 'success' : ''"
                          class="mb-1 mr-1"
                          close
                          @click:close="onDeleteTeam(person.id, team.id)"
                        >
                          {{ getTeamLabel(team.id) }}
                        </v-chip>
                      </div>
                      <small v-else>Пока не в команде</small>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="2">
            <v-chip
              draggable
              class="ma-1"
              v-for="(team, id) in teams"
              :key="id"
              @dragstart="onDrugStart(team.id)"
              @dragend="onDragEnd"
            >
              {{ team.label }}
            </v-chip>
          </v-col>
        </v-row>
        <span v-else> Не добавлено ни одного сотрудника </span>
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <v-col>
            <v-list v-if="teams.length">
              <v-list-item v-for="(team, id) in teams" :key="id">
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title>
                        {{ team.label }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Участников: {{ team.count }}
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <span v-else> Нет ни одной команды </span>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>{{ tab }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <ImportModal
      :show="showImportModal"
      :availibleFields="personFields"
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
    isDrag: false,
    druggedTeam: null,
    tab: null,
    showImportModal: false,
    importItems: [{ title: "Excel (.xlsx)", type: "excel" }],
    persons: [],
    teams: [
      { id: 1, label: "iField", count: 1 },
      { id: 2, label: "Dimensions", count: 3 },
      { id: 3, label: "Tiburon", count: 0 },
      { id: 4, label: "Администрация", count: 1 },
      { id: 5, label: "Финансы", count: 3 },
      { id: 6, label: "Обработка", count: 0 },
    ],
    personFields: [
      { label: "ФИО", model: "fullname" },
      { label: "E-mail", model: "email" },
      { label: "Табельный номер", model: "id" },
    ],
  }),
  mounted() {
    const persons = localStorage.getItem("persons");

    if (persons) this.persons = JSON.parse(persons);
  },
  methods: {
    onImport(type) {
      this.showImportModal = true;
    },
    closeModal() {
      this.showImportModal = false;
    },
    onCancel() {
      this.closeModal();
    },
    onSubmit(persons) {
      this.persons = persons;
      this.savePersons(persons);
      this.closeModal();
    },
    savePersons(persons) {
      localStorage.setItem("persons", JSON.stringify(persons));
    },
    getTeamLabel(teamId) {
      const notFoundText = "Команда id: ";
      const team = this.teams.filter((t) => t.id === teamId);

      return team.length ? team[0].label : notFoundText + teamId;
    },
    onDrugStart(team) {
      this.isDrag = true;
      this.druggedTeam = team
    },
    onDragEnd(e) {
      this.isDrag = false;
      this.druggedTeam = null
    },
    onDrugEnter(e) {
      const persID = e.target.getAttribute("data-person")
      if ( !persID ) return
      
      e.target.classList.add("select");
      
      let team = {id: this.druggedTeam, status: 'dragg'}

      this.persons = this.persons.map( p => {
        if ( p.id != persID ) return p

        if ( !p['inTeams'] ) p['inTeams'] = []
        
        if ( p.inTeams.find( t => t.id == team.id) ) {
          p.inTeams.map( t => {
            if ( t.id == team.id) t.status = 'repeat'
            
            return t          
          })
        }else {
          p.inTeams.push(team)
        }

        return p
      })
    },
    onDrugOver(e) {
      const persID = e.target.getAttribute("data-person")
      if ( !persID ) return
      e.preventDefault();
    },
    onDrugLeave(e) {
      const persID = e.target.getAttribute("data-person")
      if ( !persID ) return

      e.preventDefault();
      e.target.classList.remove("select");

      this.persons = this.persons.map( p => {
        if ( p.id != persID ) return p

        if ( !p.inTeams ) return

        p.inTeams = p.inTeams.filter( t => {
          if ( t.status == 'dragg') return false

          t.status = 'active'
          return true
        })

        return p
      })

    },
    onDrop(e) {
      const persID = e.target.getAttribute("data-person")
      if ( !persID ) return

      e.preventDefault();
      e.target.classList.remove("select");

      this.persons = this.persons.map( p => {
        if ( p.id != persID ) return p

        if ( !p.inTeams ) return

        p.inTeams = p.inTeams.filter( t => {
          t.status = 'active'
          return true
        })

        return p
      })
    },
    onDeleteTeam(pID, tID) {
      this.persons = this.persons.map( p => {
        if ( p.id == pID) p.inTeams = p.inTeams.filter( t => t.id !== tID)

        return p
      })
    }
  },
};
</script>

<style scoped>
.dropable::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: rgba(138, 255, 255, 0.1);
  border-radius: 15px;
  border: 3px;
  border-color: rgba(109, 255, 255, 0.4);
  border-style: dashed;
}
.select.dropable::after {
  background-color: rgba(133, 241, 241, 0.3);
  border-color: rgba(8, 255, 255, 1);
}
</style>