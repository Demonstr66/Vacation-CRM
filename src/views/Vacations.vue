<template>
      <v-data-iterator
        hide-default-footer
        :items="Object.values(schedules)"
      >
        <template v-slot:item="{item}">
          <base-widget :title="item.title" style="max-width: 400px">

            <v-toolbar dense flat>
              <v-spacer />
              <v-chip v-if="!item.isActive" small label outlined color="success">
                Доступен для редактирования
              </v-chip>
              <v-chip v-else small label outlined color="error">
                График утверждён
              </v-chip>
            </v-toolbar>
            <v-card-actions>
              <v-btn block text color="primary" @click="goto(item.id)">
                открыть
              </v-btn>
            </v-card-actions>
          </base-widget>
        </template>
      </v-data-iterator>
</template>




<script>
import AddVacationModal from "../components/Modals/AddVacation.vue";
import {dateDiff} from "../plugins/utils.js";
import TheCalendar from "@/components/TheCalendar";
import {schedules} from "@/mixins/ComputedData";
import BaseWidget from "@/components/Deportment/BaseWidget";
import IconBtnWithTip from "@/components/IconBtnWithTip";

export default {
  name: 'Vacations',
  mixins: [schedules],
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
  methods: {
    goto(id) {
      this.$router.push({name: 'Vacation', params: {id: id}})
    },
  },
};
</script>