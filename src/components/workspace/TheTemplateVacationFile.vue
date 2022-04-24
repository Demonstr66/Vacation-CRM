<template>
  <v-card flat>
    <v-card-title v-if="!notitle">Шаблон заявления</v-card-title>
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
              type="get"
          >
            <template v-slot:append-outer>
              <icon-btn-with-tip icon="mdi-help-circle-outline">

          <span>Загрузите шаблон для отпуска.<br>
            Используйте в шаблоне ключевые слова для
            подстановки
            значений:</span>
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
              <v-btn block color="success" text @click="uploadFile">
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
              <div class="d-flex justify-space-between">
                <v-sheet elevation="0" width="100%" class="text-left text-md-center">
                  <v-card class="d-flex" elevation="0" flat>
                    <v-img aspect-ratio="1" src="@/assets/docx.png" max-width="200px">
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
                                         @click="deleteFile">
                        Удалить
                      </icon-btn-with-tip>
                      <icon-btn-with-tip btnClass="float-end" color="primary" icon="mdi-download"
                                         small
                                         @click="downloadFile(templateFile)">
                        Скачать
                      </icon-btn-with-tip>
                    </div>
                  </v-card>
                  <div :title="templateFile.name" class="font-italic">
                    {{ templateFile.name | truncateFileName }}
                  </div>
                </v-sheet>
                <div style="min-width: fit-content;">
                  <ul class="text-left">
                    <li v-for="(tempKey, idx) in templateKeys" :key="idx">
                  <span class="font-italic">
                    <span>&#123;</span>{{ tempKey.key }}<span>&#125;</span>
                  </span> - {{ tempKey.title }}
                    </li>
                  </ul>
                  <v-btn :loading="isExampleLoading" block text @click="downloadExample">Скачать
                    пример
                  </v-btn>
                </div>
              </div>
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
import {workspaceMethods} from "@/mixins/workspaceHelper";

export default {
  name: 'TheTemplateVacationFile',
  mixins: [templateFile, workspaceMethods],
  components: {IconBtnWithTip},
  props: {
    cols: {
      type: Number,
      default: 1,
    },
    notitle: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isLoading: false,
    isDeleting: false,
    isDownloading: false,
    isExampleLoading: false,
    newTempFile: null,
    templateKeys: [
      {key: 'fullName', title: 'ФИО'},
      {key: 'post', title: 'Должность'},
      {key: 'date', title: 'Текущая дата'},
      {key: 'vstart', title: 'Дата начала отпуска'},
      {key: 'vend', title: 'Дата конца отпуска'},
      {key: 'vdays', title: 'Дней отпуска'},
    ]
  }),
  methods: {
    async uploadFile() {
      console.log('this.uploadFile')
      if (!!this.templateFile) await this.deleteFile(this.templateFile)

      this.isLoading = true
      await this.mixUploadFile(this.newTempFile)
      this.newTempFile = null
      this.isLoading = false
    },
    async downloadFile(get) {
      this.isDownloading = true
      console.log(file)
      await this.mixDownloadFile(file)
      this.isDownloading = false
    },
    async downloadExample() {
      this.isExampleLoading = true
      await this.$store.dispatch('workspace/storage/generate', {
        fullName: 'Филиппов Дмитрий Олегович',
        post: 'Старший специалист по программированию и обработке данных',
        date: '"04" апреля 2022г.',
        vstart: '"05" апреля 2022г.',
        vend: '"06" апреля 2022г.',
        vdays: '2',
      })

      this.isExampleLoading = false
    },
    async deleteFile() {
      console.log('this.deleteFile')
      this.isDeleting = true
      await this.mixDeleteFile(this.templateFile)
      this.isDeleting = false
    },
  },
  filters: {
    truncateFileName(val) {
      if (!val) return
      const maxLength = 30
      if (val.length <= maxLength) return val

      const reverseArr = val.split('').reverse()
      const format = reverseArr.slice(0, reverseArr.indexOf('.') + 4).reverse().join('')

      const name = val.slice(0, maxLength - (format.length + 3))

      return name + '...' + format
    }
  }
}
</script>
