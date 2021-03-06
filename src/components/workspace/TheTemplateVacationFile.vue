<template>
  <v-card flat>
    <v-card-title v-if="!hideTitle">Шаблон заявления</v-card-title>
    <v-card-text>
      <v-row>
        <v-col :cols="12 / cols">
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
                      <span>&#123;</span>{{ tempKey.key }}<span>&#125;</span>
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
                        <icon-btn-with-tip btnClass="float-end" color="error"
                                           icon="mdi-close"
                                           small
                                           @click="onDeleteFile">
                          Удалить
                        </icon-btn-with-tip>
                        <icon-btn-with-tip btnClass="float-end" color="primary" icon="mdi-download"
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
                    <span>&#123;</span>{{ tempKey.key }}<span>&#125;</span>
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
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {templateFile} from "@/mixins/ComputedData";
import {FileMethods} from "@/mixins/FileMethods";
import {truncate30} from "@/mixins/Filters";
import {templateFileData} from "@/plugins/schema";

export default {
  name: 'TheTemplateVacationFile',
  mixins: [templateFile, FileMethods, truncate30],
  components: {IconBtnWithTip},
  props: {
    cols: {
      type: Number,
      default: 1,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
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
      values = values.map( (v, idx) => {v.key = keys[idx]; return v})
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
    async onDownloadFile(file) {
      this.isDownloading = true
      await this.downloadFile(file)
      this.isDownloading = false
    },
    async downloadExample(file) {
      this.isExampleLoading = true

      let testData = templateFileData
      for (key in testData) {
        let test = testData[key].test
        testData[key] = typeof test === 'function' ? test() : test
      }

      await this.downloadWithDataFile({
        fullPath: file.fullPath,
        data: testData
      })

      this.isExampleLoading = false
    },
    async onDeleteFile() {
      this.isDeleting = true
      await this.deleteFile(this.templateFile)
      this.isDeleting = false
    },
  }
}
</script>
