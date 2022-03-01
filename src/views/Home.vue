<template>
  <v-container class="mx-4 mt-6">
    <div class="title">График отпусков</div>
    <v-sheet color="white" elevation="5">
      <v-row dense align-content="stretch">
        <v-col v-for="(month, index) in monthes" :key="index">
          <v-card class="mx-2 mb-2">
            <v-card-title>
              {{ month.label }}
            </v-card-title>
            <v-calendar
              ref="calendar"
              v-model="value"
              locale="ru"
              :weekdays="weekdays"
              :type="type"
              :events="events"
              :event-more="false"
              min-weeks="5"
              :show-month-on-first="false"
              :start="month.start"
              :end="month.end"
            >
              <template v-slot:event="{ event }">
                <span>
                  {{ event.name }}
                </span>
              </template>
            </v-calendar>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    type: "custom-weekly",
    mode: "stack",
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    value: "",
    monthes: [
      { start: "2022-01-01", end: "2022-01-31", label: "Январь" },
      { start: "2022-02-01", end: "2022-02-28", label: "Февраль" },
      { start: "2022-03-01", end: "2022-03-31", label: "Март" },
    ],
    items: [{ message: "Foo" }, { message: "Bar" }],
    events: [
      {
        name: "Event 1",
        start: new Date("2022-01-05"),
        end: new Date("2022-01-10"),
        color: "blue",
      },
      {
        name: "Event 2",
        start: new Date("2022-01-15"),
        end: new Date("2022-01-20"),
        color: "red",
      },
      {
        name: "Event 3",
        start: new Date("2022-01-08"),
        end: new Date("2022-01-17"),
        color: "green",
      },
      {
        name: "Event 4",
        start: new Date("2022-01-20"),
        end: new Date("2022-02-17"),
        color: "black",
      },
    ],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
  }),
};
</script>
