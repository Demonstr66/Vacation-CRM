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
              <v-btn block small text color="warning" class="justify-start">
                <v-icon>mdi-upload</v-icon>
                Загрузить файл
              </v-btn>
              <v-btn block small text color="info" :disabled="!!!templateFile.file" class="justify-start">
                <v-icon>mdi-download</v-icon>
                Скачать
              </v-btn>
              <v-btn block small text color="info" :disabled="!!!templateFile.file" class="justify-start">
                <v-icon>mdi-file-download</v-icon>
                Скачать пример
              </v-btn>
            </div>
          </div>
        </setting-row>
        <setting-row
            expanded
            label="Ключевые слова"
            description="Используйте данные ключевые слова. Они будут автоматически заменены в шаблоне. Ключевое слово можно использовать неограниченное количество раз. Обязательно вставлять в фигурных скобках."
        >
          <app-keyword-text
              v-for="(keyword, idx) in keywords"
              :key="idx"
              :keyword="keyword[0]"
              :label="keyword[1].title"
              :example="keyword[1].test"
          />
        </setting-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import SettingRow from "@/components/Settings/setting-row";
import {templateFileData} from "@/plugins/schema";
import AppKeywordText from "@/components/AppKeywordText";

export default {
  name: "v-template",
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


