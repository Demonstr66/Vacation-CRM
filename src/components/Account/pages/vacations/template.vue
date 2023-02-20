<template>
  <app-base-sheet>
    <v-card flat>
      <v-card-title>Шаблон заявления</v-card-title>
      <v-card-text>
        <setting-row
            description="Файл должен быть в формате docx. Вы можете использовать ключевые слова"
            label="Шаблон заявления"
        >
          <div class="d-flex align-center flex-wrap justify-end">
            <app-base-sheet class="d-flex align-center grow">
              <div v-if="templateFile.file" class="d-flex align-center grow">
                <div>
                  <v-img
                      aspect-ratio="1"
                      max-width="200px"
                      src="@/assets/docx.png"
                      alt="Файл загружен"
                      width="60px"
                      height="60px"
                  />
                </div>
                <div class="ml-2 text--secondary font-italic">
                  {{ templateFile.name }}
                </div>
              </div>
              <div v-else style="min-height: 60px;" class="d-flex align-center">
                <span class="font-italic text--secondary ml-2 text-body-1">Файл ещё не загружен</span>
              </div>
            </app-base-sheet>
            <div :class="{'grow': $vuetify.breakpoint.mdAndDown}">
              <v-btn block small text color="warning">
                <v-icon>mdi-upload</v-icon>
                Загрузить файл
              </v-btn>
              <v-btn block small text color="info" :disabled="!!templateFile.file">
                <v-icon>mdi-download</v-icon>
                Скачать шаблон
              </v-btn>
              <v-btn block small text color="info" :disabled="!!templateFile.file">
                <v-icon>mdi-file-download</v-icon>
                Скачать пример
              </v-btn>
            </div>
          </div>
        </setting-row>
        <setting-row
            label="Ключевые слова"
            description="Используйте данные ключевые слова. Они будут автоматически заменены в шаблоне. Ключевое слово можно использовать неограниченное количество раз. Обязательно вставлять в фигурных скобках."
        >
          <app-keyword-text
              v-for="[key, val] in keywords"
              :key="key"
              :keyword="key"
              :label="val.title"
              :example="val.test"
          />
        </setting-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import SettingRow from "@/components/Account/setting-row";
import {templateFileData} from "@/plugins/schema";
import AppKeywordText from "@/components/AppKeywordText";

export default {
  name: "template",
  components: {AppKeywordText, SettingRow, AppBaseSheet},
  data() {
    return {
      templateFile: {
        file: '1',
        name: 'Образец.docx'
      }
    }
  },
  computed: {
    keywords() {
      return Object.entries(templateFileData)
    }
  }
}
</script>


