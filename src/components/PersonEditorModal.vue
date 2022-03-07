<template>
  <BaseModal
    :title="title"
    :show="show"
    :submitDisable="!isValid"
    
    @submit="onSubmit"
    @cancel="onCancel"
  >
    <v-form class="mt-4">
      <v-row>
        <v-col cols="6">
          <v-text-field label="ФИО" :rules="rules" v-model="person.fullName">
            <span slot="prepend" class="error--text mx-2">*</span>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Email"
            hide-details="auto"
            v-model="person.email"
          >
            <span
              class="accent--text"
              label
              slot="append"
              v-if="person.email.indexOf('@') == -1"
              >{{ domen }}</span
            >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="align-end">
        <v-col cols="6">
          <v-text-field
            label="Табельный номер"
            hide-details="auto"
            prepend-icon="mdi-numeric"
          >
          </v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field label="Должность" hide-details="auto"> </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            label="Команда"
            prepend-icon="mdi-account-group"
            small-chips
            clearable
            deletable-chips
            dense
            multiple
            :items="teams"
            v-model="person.teams"
            item-text="title"
            item-value="id"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                label
                link
                small
                class="ma-1"
                :color="isLeaderOfTeam(data.item.id) ? 'success' : ''"
                @click.stop="onClickTeamLeader(data.item.id)"
                @click:close="remove(data.item.id)"
              >
                {{ data.item.title }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-text="data.item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
      <span v-show="person.teamLeader.length">
        Тимлидер команд:
        <span
          v-for="(team, id) in person.teamLeader"
          :key="id"
          class="mr-2 accent--text"
        >
          {{ getTeamTitle(team) }};
        </span>
      </span>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "../components/BaseModal.vue";
import { mapState } from "vuex";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Новый сотрудник",
    },
    options: {
      default: {},
    },
  },
  components: {
    BaseModal,
  },
  data: () => ({
    person: {
      uid: "",
      fullName: "",
      email: "",
      post: "",
      tabId: "",
      teamLeader: [],
      teams: []
    },
    domen: "@ipsos.com",
    rules: [(value) => !!value || "Заполните поле"],
  }),
  computed: {
    ...mapState({ teams: "teams" }),
    isValid: function () {
      return this.person.fullName !== "";
    },
    personTeams: function() {
      return this.person.teams.map( t => ({id: t, status: 'active'}))
    }
  },
  beforeMount() {
      let data = this.options
      if (data.uid) this.person.uid = data.uid;
      if (data.fullName) this.person.fullName = data.fullName;
      if (data.email) this.person.email = data.email;
      if (data.post) this.person.post = data.post;
      if (data.tabId) this.person.tabId = data.tabId;
      if (data.teams) this.person.teams = data.teams.map(t => t.id);
      if (data.teamLeader) this.person.teamLeader = data.teamLeader;
  },
  methods: {
    getTeamTitle(tId) {
      return this.teams.find((t) => t.id == tId).title;
    },
    onClickTeamLeader(teamId) {
      if (this.person.teamLeader.indexOf(teamId) == -1)
        this.person.teamLeader.push(teamId);
      else
        this.person.teamLeader = this.person.teamLeader.filter(
          (t) => t != teamId
        );
    },
    isLeaderOfTeam(teamId) {
      return this.person.teamLeader.indexOf(teamId) > -1;
    },
    async onSubmit() {
      let func = this.person.uid == "" ? "addPersonsToBase" : "updatePerson";

      let person = this.person
      if (person.email && person.email.indexOf("@") == -1) person.email += this.domen;
      person.teams = this.personTeams
      
      await this.$store
        .dispatch(func, this.person)
        .then(this.$store.dispatch("getDataFromBase"));

      this.closeModal();
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
    remove(id) {
      this.person.teams = this.person.teams.filter((t) => t != id);
      this.person.teamLeader = this.person.teamLeader.filter((t) => t != id);
    },
  },
};
</script>
