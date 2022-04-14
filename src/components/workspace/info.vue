<template>
  <v-card flat>
    <v-form ref="workspaceForm" @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Настройки Пространства</v-card-title>
      <v-card-text>
        <v-row v-if="!!workspace">
          <v-col :cols="12 / cols">
            <div class="d-flex align-center">
              <v-text-field
                  v-model.trim="workspace.id"
                  dense
                  disabled
                  label="ID пространства"
                  name="workspace"
                  single-line
                  @change.once="onChange"
              >
                <template v-slot:prepend>
                  <v-icon color="blue-grey lighten-1">mdi-identifier</v-icon>
                </template>
              </v-text-field>
              <icon-btn-with-tip icon="mdi-help-circle-outline">
                Код может понадобитьсья при регистрации,<br>
                чтобы присоедениться к Вашему пространству
              </icon-btn-with-tip>
              <icon-btn-with-tip icon="mdi-content-copy">
                Копировать
              </icon-btn-with-tip>
            </div>
          </v-col>
          <v-col :cols="12 / cols">
            <v-text-field
                v-model.trim="workspace.name"
                :disabled="disabled"
                dense
                label="Название организации"
                name="name"
                single-line
                @change.once="onChange"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-sitemap</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col :cols="12 / cols">
            <v-text-field
                v-model.trim="domen"
                :disabled="disabled"
                dense
                label="Домен для почты по умолчанию"
                name="domen"
                single-line
                @change.once="onChange"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-at</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col :cols="12 / cols">
            <v-file-input
                v-model="templateFile"
                :color="!!file ? 'warning' : ''"
                :messages="!!file ? 'Существующий файл будет заменён' : ''"
                accept=".docx"
                class="mt-2"
                placeholder="Шаблон файла для отпуска"
                single-line
                type="file"
            >

            </v-file-input>
            <v-expand-transition>
              <div v-if="!!templateFile">
                <v-btn block color="success" text @click="uploadFile">
                  Загрузить
                </v-btn>
              </div>
            </v-expand-transition>
          </v-col>
          <v-col :cols="12 / cols">
            <v-sheet class="pa-3 text-left" elevation="0" outlined rounded>
              <v-skeleton-loader v-if="isLoading" max-height="120px" max-width="96px"
                                 type="image">

              </v-skeleton-loader>
              <v-fade-transition v-else-if="!!file">
                <div class="d-flex justify-space-between">
                  <v-sheet elevation="0">
                    <v-card class="d-flex" elevation="0" flat>
                      <v-img aspect-ratio="1" src="@/assets/docx.png" width="100px">
                        <v-fade-transition>
                          <v-overlay v-if="isDeleting || isDownloading"
                                     :color="isDownloading ? 'success' : 'error'"
                                     :value="true"
                                     absolute
                          >
                            <v-progress-circular
                                indeterminate
                                size="48"
                            ></v-progress-circular>
                          </v-overlay>
                        </v-fade-transition>
                      </v-img>
                      <div class="d-flex flex-column">
                        <icon-btn-with-tip btnClass="float-end" color="error"
                                           icon="mdi-close"
                                           small
                                           @click="deleteFile(file)">
                          Удалить
                        </icon-btn-with-tip>
                        <icon-btn-with-tip btnClass="float-end" color="primary" icon="mdi-download"
                                           small
                                           @click="downloadFile(file)">
                          Скачать
                        </icon-btn-with-tip>
                      </div>
                    </v-card>
                    <span>{{ file.name }}</span>
                  </v-sheet>
                  <div>
                    <ul>
                      <li><span class="font-italic">{%fullName%}</span> - ФИО
                      </li>
                      <li><span class="font-italic">{%post%}</span> - Должность
                      </li>
                      <li><span class="font-italic">{%date%}</span> - Текущая дата
                      </li>
                      <li><span class="font-italic">{%vstart%}</span> - Дата начала отпуска
                      </li>
                      <li><span class="font-italic">{%vend%}</span> - Дата конца отпуска
                      </li>
                      <li><span class="font-italic">{%vdays%}</span> - Дней отпуска
                      </li>
                    </ul>
                  </div>
                </div>
              </v-fade-transition>
              <span v-else>
                Файл ещё не загружен
              </span>
            </v-sheet>
          </v-col>
          <v-col :cols="12 / cols">
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!noaction && !disabled">
        <v-spacer></v-spacer>
        <v-btn :disabled="!isChanged" color="success" text type="submit">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {defWorkspace} from "@/plugins/schema";
import {workspaceMethods} from "@/mixins/workspaceHelper";
import {file, workspace} from "@/mixins/computedData";

export default {
  components: {IconBtnWithTip},
  mixins: [workspaceMethods, workspace, file],
  props: {
    disabled: {
      type: [Boolean],
      default: false,
    },
    notitle: {
      type: Boolean,
      default: false,
    },
    noaction: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    isChanged: false,
    templateFile: null,
    isLoading: false,
    isDeleting: false,
    isDownloading: false
  }),
  computed: {
    domen: {
      get() {
        return this.workspace.domen
      },
      set(val) {
        let isAt = val.indexOf('@') != -1
        let needAt = val != ''
        this.workspace.domen = (!isAt && needAt ? '@' : '') + val
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.disabled || this.noaction) return;

      this.mixSaveWorkspace(false, this.workspace)
          .then(res => {
            console.log("res", res)
          })
          .catch(err => {
            console.log("err", err)
          })
    },
    async uploadFile() {
      console.log('this.uploadFile')
      if (!!this.file) await this.deleteFile(this.file)

      this.isLoading = true
      await this.mixUploadFile(this.templateFile)
      this.templateFile = null
      this.isLoading = false
    },
    async downloadFile(file) {
      this.isDownloading = true
      await this.mixDownloadFile(file)
      this.isDownloading = false
    },
    async deleteFile(file) {
      console.log('this.deleteFile')
      this.isDeleting = true
      await this.mixDeleteFile(file)
      this.isDeleting = false
    },
    onChange() {
      this.isChanged = true;
      this.$emit("change");
    },
    reset() {
      this.$refs.workspaceForm.reset();
      this.user = defWorkspace();
    },
    getData() {
      return this.workspace
    },
    validate() {
      return this.$refs.workspaceForm.validate()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>