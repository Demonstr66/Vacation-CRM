<template>
  <BaseModal
      :show="show"
      :submitDisable="!isUploadSuccessful || !!!importingUsers.length"
      :title="title"
      @cancel="onCancel"
      @reset="reset"
      @submit="onSubmit"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          Поддерживаются файлы Excel и CSV.<br>
          В первой строке выбранного фала, должны быть заголовки полей.<br/>
        </v-col>
        <v-col :class="{'text-center': $vuetify.breakpoint.mdAndUp}">
          Доступные поля
          <v-row class="text-left">
            <v-col v-if="requiredFields.length" cols="12" sm="6">
              <span class="error--text float-start">Обязательные:</span>
              <ul class="d-inline-block">
                <li v-for="(field, idx) in requiredFields" :key="idx">
              <span class="font-weight-bold">
                {{ field.model }}:
              </span>
                  {{ field.title }}
                </li>
              </ul>
            </v-col>
            <v-col v-if="optionalFields.length" cols="12" sm="6">
              <span class="primary--text float-start">Опционально:</span>
              <ul class="d-inline-block">
                <li v-for="(field, idx) in optionalFields" :key="idx">
              <span class="font-weight-bold">
                {{ field.model }}:
              </span>
                  {{ field.title }}
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-file-input
          v-model="file"
          :error="isUploadError"
          :error-messages="uploadError"
          :loading="isLoading"
          accept=".xlsx,.xls,.csv"
          class="mt-2"
          placeholder="Файл Excel ( .xlsx, .xls, .csv )"
          type="get"
          @change="onChange"
          @click:clear="reset"
      ></v-file-input>
      <div v-if="isUploadSuccessful" class="mt-2">
        <div v-if="importingUsers.length == 0">
          <span>Не найдено новых записей. Поля:</span>
          <span v-for="(col, idx) in uniqFields" class="font-weight-bold">
            {{ col.title }};
          </span>
          <span> должны быть уникальными.</span>
        </div>
        <div v-else>
          <span class="font-weight-bold">Количество записей:</span> {{ importingUsers.length }}
          <v-row align="center" justify="space-between">
            <v-col class="pb-0 mb-0 font-weight-bold" cols="12" md="auto">Найденные поля:</v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                  v-model="allFieldsModel"
                  :items="fields"
                  dense
                  disabled
                  item-text="title"
                  item-value="model"
                  multiple
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="!!newItems.teams.length" align="center" justify="space-between">
            <v-col class="pb-0 mb-0" cols="12" md="auto">
            <span class="font-weight-bold">
              Найденные команды:
            </span>
              <br><small>Выберите те, которые хотет добавить</small>
            </v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                  v-model="newItems.selectedTeams"
                  :items="newItems.teams"
                  chips
                  deletable-chips
                  item-text="title"
                  item-value="id"
                  multiple
                  small-chips
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="!!newItems.posts.length" align="center" justify="space-between">
            <v-col class="pb-0 mb-0" cols="12" md="auto">
            <span class="font-weight-bold">
              Найденные должности:
            </span>
              <br><small>Выберите те, которые хотет добавить</small>
            </v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                  v-model="newItems.selectedPosts"
                  :items="newItems.posts"
                  chips
                  deletable-chips
                  item-text="title"
                  item-value="id"
                  multiple
                  small-chips
              ></v-select>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else-if="isFileUploading" class="ml-8 error--text">
        Ошибка: не найдено подходящих полей
      </div>
    </v-card-text>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {excelToArray, parseArrayData} from "@/plugins/utils";
import {importHelper} from "@/mixins/importHelper";
import {users} from "@/mixins/ComputedData"

export default {
  mixins: [importHelper, users],
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    availableFields: {
      type: Array,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Выберите файл",
    },
  },
  data: () => ({
    isFileUploading: false,
    isUploadSuccessful: false,
    isUploadError: false,
    uploadError: '',
    isLoading: false,
    file: null,
    fields: [],
    importingUsers: [],
  }),
  computed: {
    allFieldsModel() {
      return this.fields.map(f => f.model)
    },
    requiredFields() {
      return this.availableFields.filter(x => !!x.required)
    },
    uniqFields() {
      return this.availableFields.filter(x => !!x.uniq)
    },
    optionalFields() {
      return this.availableFields.filter(x => !!!x.required)
    },
  },
  methods: {
    onChange(get) {
      if (!file) return;

      this.isLoading = true;

      excelToArray(file)
          .then(data => parseArrayData(data, this.availableFields, Object.values(this.users)))
          .then((data) => {
            this.fields = Object.values(data.cols)
            return Promise.resolve(data)
          })
          .then(({items: users, cols}) => this.mixParseTeamsInArray(users, cols))
          .then(({users, cols}) => this.mixParsePostsInArray(users, cols))
          .then(({users}) => {
            this.importingUsers = users
            this.isUploadSuccessful = true
          })
          .catch(err => {
            console.error(err)
            this.isUploadError = true
            this.uploadError = err.message
          })
          .finally(() => {
            this.isLoading = false
          })
    },
    saveData(users, newItems) {
      const teams = newItems.teams.filter(team =>
          newItems.selectedTeams.some(st => st == team.id))

      const unUsedTeams = newItems.teams.filter(team =>
          !newItems.selectedTeams.some(st => st == team.id))

      const posts = newItems.posts.filter(post =>
          newItems.selectedPosts.some(sp => sp == post.id))
      const unUsedPosts = newItems.posts.filter(post =>
          !newItems.selectedPosts.some(sp => sp == post.id))

      users = users.map(user => {
        if (user.team && unUsedTeams.find(ut => ut.id == user.team)) user.team = null
        if (user.post && unUsedPosts.find(up => up.id == user.post)) user.post = null

        return user
      })

      this.mixSaveAllImportData({users, teams, posts})
    },
    clearError() {
      this.isUploadError = false
      this.uploadError = ''
    },
    reset() {
      this.isFileUploading = false;
      this.isUploadSuccessful = false;
      this.fields = [];
      this.importingUsers = [];
      this.file = null;
      this.clearError()
    },
    onSubmit() {
      if (!this.importingUsers.length) return

      this.saveData(this.importingUsers, this.newItems);
      this.closeModal();
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>