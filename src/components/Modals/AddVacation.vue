<template>
  <BaseModal
    title="Новый отпуск"
    :submitDisable="dates.length != 2"
    :show="show"
    :result="dates"
    @reset="reset"
  >
      <v-row class="mt-2">
        <v-col cols="6" >
          <v-date-picker
            v-model="dates"
            range
            locale="ru"
            no-title
            elevation="2"
            first-day-of-week="1"
            multiple
            :picker-date.sync="pickerDate"
            :events="events"
            :allowed-dates="isDayAllowed"
          >
            <v-btn width="100%" color="primary" @click="dates = []"
              >Сбросить</v-btn
            >
          </v-date-picker>
        </v-col>
        <v-col cols="6" class="d-flex flex-column justify-space-between">
          <div>
            <v-text-field
              v-model="dateRangeText"
              label="Даты"
              prepend-icon="mdi-calendar"
              readonly
            ></v-text-field>
            <div class="d-flex align-center justify-center">
              <span class="text-h4">Дней:</span
              ><v-chip large label :color="rangeLength == 0 ? '' : 'success'">{{
                rangeLength
              }}</v-chip>
            </div>
          </div>
          <div>
            <small>
              Выбранные даты будут будут отправлены на утверждение руководителю
              и будут видны для всех сотрудников сразу после отправки
            </small>
            <v-divider />
            <small class="red--text">
              * Обратите внимание, что окончательно даты будут зарезервированы
              за Вами только после утверждения руководителем
            </small>
          </div>
        </v-col>
      </v-row>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import { dateDiff } from "../../plugins/utils";

export default {
  components: {
    BaseModal,
  },
  props: {
    color: {
      type: String,
      default: "primary",
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    dates: [],
    events: ["2022-03-05", "2022-03-06"],
    pickerDate: null,
  }),
  computed: {
    dateRangeText() {
      return this.dates.length ? "C " + this.dates.join(" по ") : "";
    },
    rangeLength() {
      if (this.dates.length !== 2) return "0";

      return dateDiff(...this.dates);
    },
  },
  methods: {
    isDayAllowed: function (date) {
      const now = this.$moment();
      const currDate = this.$moment(date);

      return currDate >= now;
    },
    reset() {
      this.dates = [];
      this.pickerDate = null;
    },
  },
};
</script>