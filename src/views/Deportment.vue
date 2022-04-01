<template>
  <div>
    <v-row>
      <v-col cols="10">
        <v-tabs v-model="tab">
          <v-tab>Сотрудники</v-tab>
          <v-tab>Команды</v-tab>
          <v-tab>Архив</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="2" class="justify-self-end">
        <v-btn color="primary" dark icon @click="this.addBtnOnClick">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
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
              <v-list-item-title @click="onExport(item.type)">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-tabs-items v-model="tab">
      <v-tab-item transition="fade-transition">
        <v-row v-if="persons && persons.length">
          <v-col cols="10">
            <v-list max-height="80vh" class="overflow-y-auto">
              <v-list-item
                dense
                :class="isDrag ? 'dropable' : ''"
                @drop="onDrop"
                @dragover="onDrugOver($event)"
                @dragenter="onDrugEnter"
                @dragleave="onDrugLeave"
                v-for="(person, id) in persons"
                :key="id"
                :data-person="person.uid"
              >
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title
                        >{{ person.fullName }}

                        <v-chip
                          outlined
                          label
                          x-small
                          class="ml-2"
                          :color="
                            person.role == 'admin'
                              ? 'warning'
                              : person.role == 'owner'
                              ? 'success'
                              : person.role == 'leader'
                              ? 'accent'
                              : ''
                          "
                        >
                          {{ person.role }}
                        </v-chip>
                      </v-list-item-title>
                      <v-list-item-subtitle
                        tag="a"
                        :href="'mailto:' + person.email"
                      >
                        {{ person.email }}
                      </v-list-item-subtitle>
                    </v-col>
                    <v-spacer />
                    <v-col cols="3">
                      <div v-if="person.teams && person.teams.length !== 0">
                        <v-chip
                          v-for="(team, index) in person.teams"
                          :key="index"
                          :color="
                            team.status == 'dragg'
                              ? 'accent'
                              : team.status == 'repeat'
                              ? 'success'
                              : ''
                          "
                          class="mb-1 mr-1"
                          close
                          label
                          small
                          @click:close="onDeleteTeam(person.uid, team.id)"
                        >
                          {{ getTeamTitle(team.id) }}
                        </v-chip>
                      </div>
                      <small v-else>Пока не в команде</small>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col
                      class="text-center mr-2"
                      style="max-width: fit-content"
                      align-self="center"
                    >
                      <icon-btn-with-tip
                        v-if="person.status === 'active'"
                        icon="mdi-check-decagram"
                        color="success"
                      >
                        Зарегистрирован
                      </icon-btn-with-tip>
                      <icon-btn-with-tip
                        v-else
                        icon="mdi-account-plus"
                        color="primary"
                      >
                        Пригласить
                      </icon-btn-with-tip>
                      <icon-btn-with-tip
                        icon="mdi-account-edit"
                        color="primary"
                        @click="onEdit(person.uid)"
                      >
                        Редактировать
                      </icon-btn-with-tip>
                      <icon-btn-with-tip
                        icon="mdi-archive-arrow-down"
                        color="error"
                        @click="onDeleteUser(person.uid)"
                      >
                        Заархивировать
                      </icon-btn-with-tip>
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
              class="ma-1 v-chip--clickable"
              v-for="(team, id) in teams"
              :key="id"
              @dragstart="onDrugStart(team.id)"
              @dragend="onDragEnd"
              label
            >
              {{ team.title }}
            </v-chip>
          </v-col>
        </v-row>
        <span v-else> Не добавлено ни одного сотрудника </span>
      </v-tab-item>
      <v-tab-item transition="fade-transition">
        <v-row>
          <v-col>
            <v-list v-if="teams && teams.length">
              <v-list-item v-for="(team, id) in teams" :key="id">
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title>
                        {{ team.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        ID: {{ team.id }}
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
      <v-tab-item transition="fade-transition">
        <v-card flat>
          <v-card-text>
            <v-list max-height="80vh" class="overflow-y-auto">
              <v-list-item
                dense
                v-for="(person, id) in archive"
                :key="id"
                :data-person="person.uid"
              >
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title>
                        {{ person.fullName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ person.email }}
                      </v-list-item-subtitle>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="1">
                      <icon-btn-with-tip
                        icon="mdi-restore-alert"
                        color="primary"
                        @click="onRecover(person.uid)"
                      >
                        Восстановаить
                      </icon-btn-with-tip>
                      <icon-btn-with-tip
                        icon="mdi-close"
                        color="error"
                        @click="onRecover(person.uid)"
                      >
                        Удалить
                      </icon-btn-with-tip>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <ImportModal
      v-if="showImportModal"
      :dataType="importType"
      :title="importTitle"
      :show="showImportModal"
      :availibleFields="availibleFields"
      @close="closeModal"
    />
    <ExportModal
      v-if="showExportModal"
      :show="showExportModal"
      :availibleFields="personFields"
    />

    <PersonEditorModal
      v-if="personEditor.show"
      :show="personEditor.show"
      :options="personEditor.options"
      @close="closeModal"
    />
    <AlertModal
      v-if="isAlertShow"
      :show="isAlertShow"
      @cancel="closeModal"
      @submit="onSubmitDeleteUser(deleatingUser)"
    />
  </div>
</template>

<script>
import layout from "../layouts/Main.vue";
import ImportModal from "../components/ImportModal.vue";
import ExportModal from "../components/ExportModal.vue";
import PersonEditorModal from "../components/PersonEditorModal.vue";
import AlertModal from "../components/AlertModal.vue";
import IconBtnWithTip from "../components/IconBtnWithTip.vue";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    layout,
    ImportModal,
    ExportModal,
    PersonEditorModal,
    AlertModal,
    IconBtnWithTip,
  },
  data: () => ({
    isDrag: false,
    isAlertShow: false,
    deleatingUser: null,
    druggedTeam: null,
    tab: null,
    showImportModal: false,
    showExportModal: false,
    personEditor: {
      show: false,
      options: {},
    },
    importItems: [{ title: "Excel (.xlsx)", type: "excel" }],
    personFields: [
      { label: "ФИО", model: "fullName" },
      { label: "E-mail", model: "email" },
      { label: "Табельный номер", model: "tabId" },
      { label: "Должность", model: "post" },
      { label: "Команды", model: "teams" },
    ],
    teamFields: [
      { label: "ID", model: "id" },
      { label: "Название", model: "title" },
    ],
  }),
  computed: {
    ...mapState({
      baseP: (state) => state.db.importInfo.persons,
      teams: (state) => state.db.importInfo.teams,
      archive: (state) => state.db.importInfo.archive,
    }),
    ...mapGetters(["getPersonById"]),
    persons: {
      get: function () {
        return this.baseP;
      },
      set: function (val) {
        this.$store.commit("setPersons", val);
      },
    },
    availibleFields: function () {
      return this.tab == 0 ? this.personFields : this.teamFields;
    },
    importType: function () {
      return this.tab == 0 ? "persons" : "teams";
    },
    importTitle: function () {
      return this.tab == 0 ? "Добавление сотрудников" : "Добавление команд";
    },
  },
  methods: {
    getTeamTitle(tId) {
      return this.teams.find((t) => t.id == tId).title;
    },
    onImport(type) {
      this.showImportModal = true;
    },
    onExport(type) {
      this.showExportModal = true;
    },
    onEdit(persId) {
      this.personEditor.options = this.getPersonById(persId);
      this.showEditorModal();
    },
    closeModal() {
      this.showImportModal = false;
      this.showExportModal = false;
      this.personEditor.show = false;
      this.isAlertShow = false;
    },
    addBtnOnClick() {
      this.personEditor.options = {};
      this.showEditorModal();
    },
    showEditorModal() {
      this.personEditor.show = true;
    },
    showAlert() {
      this.isAlertShow = true;
    },
    onDrugStart(tId) {
      this.isDrag = true;
      this.druggedTeam = tId;
    },
    onDragEnd(e) {
      this.isDrag = false;
      this.druggedTeam = null;
    },
    onDrugEnter(e) {
      const persID = e.target.getAttribute("data-person");
      if (!persID) return;

      e.target.classList.add("select");

      let team = { id: this.druggedTeam, status: "dragg" };

      this.persons.map((p) => {
        if (p.uid != persID) return p;

        if (!p["teams"]) p["teams"] = [];

        if (p.teams.find((t) => t.id == team.id)) {
          p.teams.map((t) => {
            if (t.id == team.id) t.status = "repeat";

            return t;
          });
        } else {
          p.teams.push(team);
        }

        return p;
      });
    },
    onDrugOver(e) {
      const persID = e.target.getAttribute("data-person");
      if (!persID) return;

      e.preventDefault();
    },
    onDrugLeave(e) {
      const persID = e.target.getAttribute("data-person");
      if (!persID) return;

      e.target.classList.remove("select");

      this.persons.map((p) => {
        if (p.uid != persID) return p;

        if (!p.teams) return;

        p.teams = p.teams.filter((t) => {
          if (t.status == "dragg") return false;

          t.status = "active";
          return true;
        });

        return p;
      });
    },
    onDrop(e) {
      const persID = e.target.getAttribute("data-person");
      if (!persID) return;

      e.target.classList.remove("select");

      let isNewTeam = false;

      this.persons = this.persons.map((p) => {
        if (p.uid != persID) return p;

        if (!p.teams || !p.teams.length) return;

        p.teams = p.teams.filter((t) => {
          if (t.status == "dragg") isNewTeam = true;

          t.status = "active";
          return true;
        });

        return p;
      });

      if (isNewTeam) {
        this.$store.dispatch("addTeamToPerson", {
          personId: persID,
          teamId: this.druggedTeam,
        });
        // .then(this.$store.dispatch("fetchData"));
      }
    },
    onDeleteTeam(personId, teamId) {
      this.$store.dispatch("removeTeamToPerson", {
        personId,
        teamId,
      });
    },
    onDeleteUser(uid) {
      this.deleatingUser = uid;
      this.showAlert();
    },
    onSubmitDeleteUser(uid) {
      this.removeUser(uid);
      this.closeModal();
      this.deleatingUser = null;
    },
    removeUser(uid) {
      this.$store
        .dispatch("deleteUser", uid)
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Пользователь перемещён в архив",
          })
        )
        .catch((err) =>
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          })
        );
    },
    onRecover(uid) {
      this.$store
        .dispatch("restoreUser", uid)
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Пользователь восстановлен",
          })
        )
        .catch((err) =>
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          })
        );
    },
  },
};
</script>

<style scoped>
.dropable::after {
  position: absolute;

  margin: 6px;

  top: 0;
  left: 0;

  width: 100%;
  height: 90%;

  width: -webkit-fill-available;
  height: -webkit-fill-available;

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