<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="700px">
      <v-card>
        <v-toolbar color="primary" dark>Новый отпуск</v-toolbar>
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
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
                    ><v-chip
                      large
                      label
                      :color="rangeLength == 0 ? '' : 'success'"
                      >{{ rangeLength }}</v-chip
                    >
                  </div>
                </div>
                <div>
                  <small>
                    Выбранные даты будут будут отправлены на утверждение
                    руководителю и будут видны для всех сотрудников сразу после
                    отправки
                  </small>
                  <v-divider />
                  <small class="red--text">
                    * Обравтите внимание, что окончательно даты будут
                    зарезервированы за Вами только после утверждения
                    руководителем
                  </small>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="onCancel"> Отмена </v-btn>
          <v-btn
            :disabled="dates.length != 2"
            color="success"
            text
            @click="onSubmit"
          >
            Отправить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { dateDiff } from "../plugins/utils.js";

export default {
  props: {
    color: {
      type: String,
      default: "primary",
    },
    show: Boolean,
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
    onCancel() {
      this.$emit("cancel");
      this.reset();
    },
    onSubmit() {
      this.$emit("submit", this.dates);
      this.reset();
    },
  },
};
</script>