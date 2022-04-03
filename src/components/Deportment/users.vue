<template>
  <div>
    <v-row v-if="persons && persons.length">
      <v-col cols="12" lg="10">
        <v-list max-height="80vh" class="overflow-y-auto">
          <v-list-item
            dense
            :class="{ dropable: isDrag }"
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
                        person.role != 'admin'
                          ? person.role != 'owner'
                            ? person.role == 'leader'
                              ? 'warning'
                              : 'accent'
                            : 'success'
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
                    v-if="person.active"
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
  </div>
</template>
      <script>
import AlertModal from "../AlertModal.vue";
import IconBtnWithTip from "../IconBtnWithTip.vue";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    AlertModal,
    IconBtnWithTip,
  },
  created() {
    this.users = this.$store.getters["workspace/users"];
  },
  data: () => ({
    isDrag: false,
    isAlertShow: false,
    deleatingUser: null,
    druggedTeam: null,
    showImportModal: false,
    showExportModal: false,
    personEditor: {
      show: false,
      options: {},
    },
    users: [],
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
      baseP: (state) => state.workspace.users,
      teams: (state) => state.workspace.users.teams || [],
    }),
    persons: {
      get: function () {
        return Object.values(this.baseP);
      },
      set: function (val) {
        this.$store.commit("workspace/setUsers", val);
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
    onEdit(uid) {
      this.$emit("editUser", this.getUserById(uid));
    },
    getUserById(uid) {
      return this.baseP[uid] || {};
    },
    closeModal() {
      this.showImportModal = false;
      this.showExportModal = false;
      this.personEditor.show = false;
      this.isAlertShow = false;
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