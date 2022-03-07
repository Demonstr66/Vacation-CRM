<template>
  <BaseModal
    :title="title"
    :show="show"
    :submitDisable="!isValid"
    @reset="reset"
    @submit="onSubmit"
    @cancel="onCancel"
  >
    <v-form class="mt-4">
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="ФИО"
            hide-details="auto"
            :rules="rules"
            v-model="person.fullname"
          >
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
              >@ipsos.com</span
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

        <v-spacer></v-spacer>
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
            v-model="inTeams"
            item-text="label"
            item-value="id"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                label
                small
                class="ma-1"
                @click:close="remove(data.item.id)"
              >
                {{ data.item.label }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-text="data.item.label"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "../components/BaseModal.vue";

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
  },
  components: {
    BaseModal,
  },
  data: () => ({
    person: {
      email: "",
      fullname: "",
    },
    rules: [(value) => !!value || "Заполните поле"],
    teams: [
      { id: 1, label: "iField", count: 1 },
      { id: 2, label: "Dimensions", count: 3 },
      { id: 3, label: "Tiburon", count: 0 },
      { id: 4, label: "Администрация", count: 1 },
      { id: 5, label: "Финансы", count: 3 },
      { id: 6, label: "Обработка", count: 0 },
    ],
    inTeams: [],
  }),
  computed: {
    isValid: function () {
      return this.person.fullname !== "";
    },
  },
  methods: {
    reset() {
      this.person.email = ""
      this.person.fullname = ""
    },
    onSubmit() {
      this.closeModal();
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
    remove(id) {
      const index = this.inTeams.indexOf(id);
      if (index >= 0) this.inTeams.splice(index, 1);
    },
  },
};
</script>
