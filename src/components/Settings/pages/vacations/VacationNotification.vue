<template>
  <app-base-sheet>
    <v-card flat height="100%">
      <v-card-title v-text="'Уведомления'"/>
      <v-card-text>
        <setting-row
            label="Интервалы"
            description="За сколько дней до начала отпуска присылать уведомления. Можно выбрать неограниченное число интервалов"
        >
          <v-select
              v-model="selectedDays"
              :items="days"
              item-text="text"
              item-value="value"
              multiple
              label="Получать уведомления"
              persistent-hint
              hide-details
              dense
              single-line
          >
            <template v-slot:prepend>
              <input-icon>mdi-bell</input-icon>
            </template>
            <template v-slot:selection="{item}">
              <v-chip
                  label
                  small
                  close
                  @click:close="onCloseDayItem(item.value)"
              >
                {{ item.text }}
              </v-chip>
            </template>
          </v-select>
          <div class="d-flex">
            <v-spacer/>
            <btn-submit @click="saveDaysInterval()"/>
          </div>
        </setting-row>
        <setting-row description="Шаблон письма. Вы можете использовать ключевые слова" label="Шаболн письма">
          <rich-text-editor :height="250" :buttons-display="{imageButton: false}" @valid="saveEmailTemplate"/>
        </setting-row>
        <setting-row
            expanded
            description="Используйте данные ключевые слова. Они будут автоматически заменены в шаблоне. Ключевое слово можно использовать неограниченное количество раз. Обязательно вставлять в фигурных скобках."
            label="Ключевые слова">
          <app-keyword-text
              v-for="val in $options.pipings"
              :key="val.key"
              :keyword="val.key"
              :label="val.description"
              :example="val.example"
          />
        </setting-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import Template from "@/components/Settings/pages/vacations/VacationTemplate";
import InputIcon from "@/components/InputIcon";
import SettingRow from "@/components/Settings/setting-row";
import AppKeywordText from "@/components/AppKeywordText";
import BtnSubmit from "@/components/UI/btn-submit";

export default {
  name: "v-notification",
  components: {BtnSubmit, AppKeywordText, SettingRow, InputIcon, Template, AppBaseSheet},
  pipings: [
    {key: 'fullName', description: 'Полное ФИО', example: 'Иванов Иван Иванович'},
    {key: 'displayName', description: 'Сокращенное имя (если указано)', example: 'Иванов И. И.'},
    {key: 'startDate', description: 'Дата начала отпуска', example: '"20" января 1970г.'},
    {key: 'endDate', description: 'Дата окончания отпуска', example: '"30" января 1970г.'},
    {key: 'days', description: 'Количество дней отпуска', example: '10'},
    {key: 'daysBefore', description: 'Дней до начала отпуска', example: '3'},
  ],
  data() {
    return {
      selectedDays: []
    }
  },
  computed: {
    days() {
      let days = []
      for (let i = 1; i <= 30; i++) {
        days.push({value: i, text: i + ' ' + this.getNoun(i, 'день', 'дня', 'дней')})
      }
      return days
    }
  },
  methods: {
    onUpdate(text) {
      this.text = text
    },
    onCloseDayItem(id) {
      this.selectedDays = this.selectedDays.filter(x => x !== id)
    },
    getNoun(number, one, two, five) {
      let n = Math.abs(number);
      n %= 100;
      if (n >= 5 && n <= 20) {
        return five;
      }
      n %= 10;
      if (n === 1) {
        return one;
      }
      if (n >= 2 && n <= 4) {
        return two;
      }
      return five;
    },
    saveDaysInterval() {
      alert('Saved days:' + this.selectedDays.join(', '))
    },
    saveEmailTemplate(data) {
      alert('Save template\n' + data)
    }
  }
}
</script>

<style scoped>

</style>