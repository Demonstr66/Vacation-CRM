<template>
  <BaseModal
    :show="show"
    :submitDisable="!isUploadSuccessful || !!!uploadingUsers.length"
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
        label="Файл Excel ( .xlsx, .xls, .csv )"
        @change="onChange"
        @click:clear="reset"
      ></v-file-input>
      <div v-if="isUploadSuccessful" class="mt-2">
        <div v-if="!uploadingUsers.length">
          <span>Не найдено новых записей. Поля:</span>
          <span v-for="(col, idx) in uniqFields" class="font-weight-bold">
            {{ col.title }};
          </span>
          <span> должны быть уникальными.</span>
        </div>
        <div v-else>
          <span class="font-weight-bold">Количество записей:</span> {{ uploadingUsers.length }}
          <v-row align="center" justify="space-between">
            <v-col class="pb-0 mb-0 font-weight-bold" cols="12" md="auto">Найденные поля:</v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                v-model="allFieldsModel"
                :items="uploadFields"
                dense
                disabled
                item-text="title"
                item-value="model"
                multiple
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="uploadingTeams.length" align="center" justify="space-between">
            <v-col class="pb-0 mb-0" cols="12" md="auto">
            <span class="font-weight-bold">
              Найденные команды:
            </span>
              <br><small>Выберите те, которые хотет добавить</small>
            </v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                v-model="teams"
                :items="uploadingTeams"
                multiple
              >
                <template #selection="{item, index}">
                  <v-chip
                    close
                    color="accent"
                    label
                    outlined
                    small
                    @click:close="teams.splice(index, 1)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="uploadingPosts.length" align="center" justify="space-between">
            <v-col class="pb-0 mb-0" cols="12" md="auto">
            <span class="font-weight-bold">
              Найденные должности:
            </span>
              <br><small>Выберите те, которые хотет добавить</small>
            </v-col>
            <v-col class="pb-0 mb-0" cols="12" md="7">
              <v-select
                v-model="posts"
                :items="uploadingPosts"
                multiple
              >
                <template #selection="{item, index}">
                  <v-chip
                    close
                    color="accent"
                    label
                    outlined
                    small
                    @click:close="posts.splice(index, 1)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-select>
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
import {IImport} from "@/plugins/servises/IImport";

export default {
  components: {
    BaseModal,
  },
  ModalController: null,
  props: {
    dataType: {
      type: String,
    },
    title: {
      type: String,
      default: "Выберите файл",
    },
  },
  data: () => ({
    availableFields: IImport.users.fields,
    show: false,

    uploadFields: [],
    uploadingTeams: [],
    uploadingPosts: [],
    uploadingUsers: [],

    teams: [],
    posts: [],


    isFileUploading: false,
    isUploadSuccessful: false,
    isUploadError: false,
    uploadError: '',
    isLoading: false,
    file: null,
  }),
  computed: {
    allFieldsModel() {
      return this.uploadFields.map(f => f.model)
    },
    requiredFields() {
      return this.availableFields.filter(x => !!x.required)
    },
    uniqFields() {
      return this.availableFields.filter(x => !!x.unique)
    },
    optionalFields() {
      return this.availableFields.filter(x => !!!x.required)
    },
  },
  methods: {
    open() {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      this.show = true
      this.$options.ModalController = {resolve, reject}
      return result
    },
    onChange() {
      this.clearError()
      if (!this.file) return

      this.isLoading = true
      IImport.users.upload(this.file)
        .then(({users, teams, posts, fields}) => {
          this.uploadingUsers = users
          this.uploadingTeams = teams
          this.uploadingPosts = posts
          this.posts = [...posts]
          this.teams = [...teams]
          this.uploadFields = fields

          this.isFileUploading = true
          this.isUploadSuccessful = true
        })
        .catch(err => {
          this.isUploadError = true
          this.uploadError = err.message
        })
        .finally(() => this.isLoading = false)
    },
    clearError() {
      this.isUploadError = false
      this.uploadError = ''
    },
    reset() {
      console.log('reset')
      this.isFileUploading = false;
      this.isUploadSuccessful = false;
      this.uploadingUsers = []
      this.uploadingTeams = []
      this.teams = []
      this.uploadingPosts = []
      this.posts = []
      this.uploadFields = []

      this.file = null;
      this.clearError()
    },
    onSubmit() {
      const {uploadingUsers, uploadingTeams, uploadingPosts, teams, posts} = this
      if (!uploadingUsers.length) return

      const users = uploadingUsers.map(user => {
        if (!teams.includes(user.team) && uploadingTeams.includes(user.team) || !user.team) {
          user.team = ''
        }

        if (!posts.includes(user.post) && uploadingPosts.includes(user.post) || !user.post) {
          user.post = ''
        }

        return user
      })

      IImport.users.save(users, teams, posts)
        .then(() => {
          this.closeModal()
        })

    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.reset()
      this.show = false
      this.$options.ModalController.resolve(false)
    },
  },
};
</script>