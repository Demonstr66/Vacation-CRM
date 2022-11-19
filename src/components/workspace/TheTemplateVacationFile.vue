<template>
  <app-base-sheet>
    <v-card flat>
      <v-card-title v-if="!hideTitle">Шаблон заявления</v-card-title>
      <v-card-text>
        <v-row>
          <Can I="manage" on="Workspace">
            <v-col v-if="!disabled" :cols="12 / cols">
              <v-file-input
                v-model="newTempFile"
                :color="!!templateFile ? 'warning' : ''"
                :messages="!!templateFile ? 'Существующий файл будет заменён' : ''"
                accept=".docx"
                class="mt-2"
                placeholder="Шаблон файла для отпуска"
                single-line
                truncate-length="25"
              >
                <template v-slot:append-outer>
                  <icon-btn-with-tip icon="mdi-help-circle-outline">

                <span>Загрузите шаблон для отпуска.<br>
                  Используйте в шаблоне ключевые слова для
                  подстановки
                  значений:
                </span>
                    <ul>
                      <li v-for="(tempKey, idx) in templateKeys" :key="idx">
                    <span class="font-italic">
                      <span>+++</span>{{ tempKey.key }}<span>+++</span>
                    </span> - {{ tempKey.title }}
                      </li>
                    </ul>
                  </icon-btn-with-tip>
                </template>
              </v-file-input>
              <v-expand-transition>
                <div v-if="!!newTempFile">
                  <v-btn block color="success" text @click="onUploadFile">
                    Загрузить
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-col>
          </Can>
          <v-col :cols="12 / cols">
            <v-sheet class="pa-3 text-center" elevation="0" outlined rounded>
              <v-row v-if="isLoading">
                <v-col cols="3">
                  <v-skeleton-loader max-height="120px"
                                     max-width="96px" type="image">
                  </v-skeleton-loader>
                </v-col>
                <v-col class="d-flex flex-column justify-space-between" cols="9">
                  <v-skeleton-loader v-for="idx in 5"
                                     :key="idx"
                                     max-width="300px" type="text">
                  </v-skeleton-loader>
                </v-col>
              </v-row>
              <v-fade-transition v-else-if="templateFile && Object.keys(templateFile).length != 0">
                <v-row>
                  <v-col>
                    <v-sheet class="text-left text-md-center" elevation="0" width="100%">
                      <v-card class="d-flex" elevation="0" flat>
                        <v-img aspect-ratio="1" max-width="200px" src="@/assets/docx.png">
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
                          <Can I="manage" on="Workspace">
                            <icon-btn-with-tip
                              v-if="!disabled"
                              btnClass="float-end" color="error"
                              icon="mdi-close"
                              small
                              @click="onDeleteFile">
                              Удалить
                            </icon-btn-with-tip>
                          </Can>
                          <icon-btn-with-tip btnClass="float-end" color="primary"
                                             icon="mdi-download"
                                             small
                                             @click="onDownloadFile(templateFile)">
                            Скачать
                          </icon-btn-with-tip>
                        </div>
                      </v-card>
                      <div :title="templateFile.name" class="font-italic">
                        {{ templateFile.name | truncate30 }}
                      </div>
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <div style="min-width: fit-content;">
                      <ul class="text-left">
                        <li v-for="(tempKey, idx) in templateKeys" :key="idx">
                  <span class="font-italic">
                    <span>+++</span>{{ tempKey.key }}<span>+++</span>
                  </span> - {{ tempKey.title }}
                        </li>
                      </ul>
                      <v-btn :loading="isExampleLoading" block text
                             @click="downloadExample(templateFile)">Скачать
                        пример
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-fade-transition>
              <span v-else>
                        Файл ещё не загружен
                      </span>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {templateFile} from "@/mixins/ComputedData";
import {FileMethods} from "@/mixins/FileMethods";
import {truncate30} from "@/mixins/Filters";
import {templateFileData} from "@/plugins/schema";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import {api} from "@/plugins/api";
import store from "@/store";
import FileDownload from "js-file-download";
import {Message} from "@/plugins/servises/Message";
import {dateToFileFormat} from "@/plugins/utils";

export default {
  name: 'TheTemplateVacationFile',
  mixins: [templateFile, FileMethods, truncate30],
  components: {AppBaseSheet, IconBtnWithTip},
  props: {
    cols: {
      type: Number,
      default: 1,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    isLoading: false,
    isDeleting: false,
    isDownloading: false,
    isExampleLoading: false,
    newTempFile: null
  }),
  computed: {
    templateKeys() {
      const data = templateFileData
      const keys = Object.keys(data)
      let values = Object.values(data)
      values = values.map((v, idx) => {
        v.key = keys[idx];
        return v
      })
      return values
    }
  },
  methods: {
    async onUploadFile() {
      if (!!this.templateFile) await this.deleteFile(this.templateFile)

      this.isLoading = true
      await this.uploadFile(this.newTempFile)
      this.newTempFile = null
      this.isLoading = false
    },
    async onDownloadFile() {
      this.isDownloading = true
      try {
        const fullPath = this.$store.getters['templateFile/fullPath']

        const {data} = await api.file.downloadOrigin(fullPath)

        const fileName = fullPath.split('/').reverse()[0]
        await FileDownload(data, fileName)
      } catch (e) {
        Message.errorMessage(e)
      } finally {
        this.isDownloading = false
      }
    },
    async downloadExample() {
      this.isExampleLoading = true
      try {
        const fullPath = this.$store.getters['templateFile/fullPath']
        const {data} = await api.file.download(
          fullPath,
          'Иванов Иван Иванович',
          'Специалист',
          dateToFileFormat(Date.now()),
          dateToFileFormat(this.$moment().add(7, 'days')),
          '7',
          dateToFileFormat(Date.now()),
        )

        const type = fullPath.split('.').reverse()[0]
        const fileName = `Пример заполненного заявления.${type}`
        await FileDownload(data, fileName)
      } catch (e) {
        Message.errorMessage(e)
      } finally {
        this.isExampleLoading = false
      }
    },
    async onDeleteFile() {
      this.isDeleting = true
      await this.deleteFile(this.templateFile)
      this.isDeleting = false
    },
  }
}
</script>
