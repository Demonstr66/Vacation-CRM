<template>
  <app-base-sheet>
    <v-card flat height="100%">
      <v-card-title v-text="'Уведомления'"/>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="6">
            <v-select
                v-model="selectedDays"
                :items="days"
                item-text="text"
                item-value="value"
                multiple
                label="Получать уведомления"
                persistent-hint
                hint="Вы можете выбрать, за сколько времени до наступления отпуска будут приходить уведомления"
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
            <div class="mt-6">
              <div>
                <input-icon class="v-input__prepend-outer">mdi-email</input-icon>
                <span class="text-body-1">Шаблон письма</span>
              </div>
              <rich-text-editor :height="250" class="ml-8" :buttons-display="{imageButton: false}"/>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="mt-6">
              <div>
                <input-icon class="v-input__prepend-outer">mdi-key</input-icon>
                <span class="text-body-1">Доступные подстановки</span>
              </div>
              <div>
                <ul>
                  <li v-for="(pip, idx) in pipings" :key="idx">
                    <span class="text-body-2 font-weight-bold">{ {{ pip.key }} }</span>
                    <span class="text-body-2"> - {{ pip.description }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import Template from "@/components/Account/pages/vacations/template";
import InputIcon from "@/components/InputIcon";

export default {
  name: "notification",
  components: {InputIcon, Template, AppBaseSheet},
  data() {
    return {
      selectedDays: [],
      pipings: [
        {key: 'fullName', description: 'Полное ФИО', example: 'Иванов Иван Иванович'},
        {key: 'displayName', description: 'Сокращенное имя (если указано)', example: 'Иванов И. И.'},
        {key: 'startDate', description: 'Дата начала отпуска', example: '"20" января 1970г.'},
        {key: 'endDate', description: 'Дата окночания отпуска', example: '"30" января 1970г.'},
        {key: 'days', description: 'Количество дней отпуска', example: '10'},
        {key: 'daysBefore', description: 'Дней до начала отпуска', example: '3'},
      ]
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
    }
  }
}
</script>

<style scoped>

</style>