<template>
  <v-data-iterator
    :items="Object.values(schedules)"
    hide-default-footer
  >
    <template v-slot:item="{item}">
      <base-widget
        :title="item.title"
        class="inline-block-fluid"
      >
        <v-row
          v-for="(field, index) in fields"
          :key="index"
          class="ma-0 pa-0 mt-3"
          justify="space-between"
        >
          <v-col class="pa-0" cols="auto">{{ field.title }}:</v-col>
          <v-col class="font-weight-bold subtitle-1 pa-0" cols="auto">
            {{ field.dataHandler(item.id, field.actually) }}
          </v-col>
        </v-row>

        <v-row class="ma-0 pa-0 mt-3" justify="space-between">
          <v-col class="pa-0" cols="auto">Статус:</v-col>
          <v-col class="pa-0" cols="auto">
            <v-chip v-if="!item.isActive" color="warning" label outlined small>
              Доступен для редактирования
            </v-chip>
            <v-chip v-else color="success" label outlined small>
              График утверждён
            </v-chip>
          </v-col>
        </v-row>
        <v-card-actions class="px-0">
          <v-btn block color="primary" text @click="goto(item.id)">
            открыть
          </v-btn>
        </v-card-actions>
      </base-widget>
    </template>
  </v-data-iterator>
</template>


<script>
import AddVacationModal from "../components/Modals/AddVacation.vue";
import TheCalendar from "@/components/TheCalendar";
import {myVacations, schedules} from "@/mixins/ComputedData";
import BaseWidget from "@/components/Deportment/BaseWidget";
import IconBtnWithTip from "@/components/IconBtnWithTip";

export default {
  name: 'Vacations',
  mixins: [schedules, myVacations],
  components: {
    IconBtnWithTip,
    BaseWidget,
    TheCalendar,
    AddVacationModal,
  },
  data: () => ({
    items: [],
    isModalVisible: false,
  }),
  computed: {
    fields() {
      return [
        {title: 'Отпусков', actually: false, dataHandler: this.getVacationsCount},
        {title: 'Дней суммарно', actually: false, dataHandler: this.getVacationsDays},
        {title: 'Отпусков (без заявления)', actually: true, dataHandler: this.getVacationsCount},
        {
          title: 'Дней суммарно (без заявления)', actually: true, dataHandler:
          this.getVacationsDays
        },
      ]
    }
  },
  methods: {
    getVacationsCount(id, actually) {
      return Object.values(this.myVacations[id] || {}).filter(v => v.actually === actually).length
    },
    getVacationsDays(id, actually) {
      return Object.values(this.myVacations[id] || {})
        .filter(v => v.actually === actually)
        .reduce((sum, val) => {
          return sum + val.days
        }, 0)
    },
    goto(id) {
      this.$router.push({name: 'Vacation', params: {id: id}})
    },
  },
};
</script>
<style lang="css" scoped>
.inline-block-fluid {
  display: inline-block;
  margin: 8px;
  max-width: 500px;
}
</style>