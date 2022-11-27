<template>
  <app-base-sheet
    v-if="!filteredSchedules.length"
    class="text-center my-5 subtitle-1"
    style="color: black;"
  >
      <span>
        Отсутсвуют данные
      </span>
  </app-base-sheet>
  <div v-else class="d-grid">
    <base-widget
      v-for="item in filteredSchedules"
      :key="item.id"
    >
      <v-card-title class="justify-space-between text-no-wrap text-truncate">
        <span :title="item.title">{{ item.title }}</span>
        <app-status-chip
          :status="item.status"
          :statuses="$options.STATUSES"
        ></app-status-chip>
      </v-card-title>
      <div class="d-flex flex-wrap">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="flex-basis-250 d-flex flex-nowrap justify-space-between mx-2 align-baseline"
        >
          <span class="pa-0">{{ field.title }}:</span>
          <v-spacer class="mx-1 border-bottom-dotted"/>
          <span class="font-weight-bold subtitle-1 pa-0">
            {{ field.dataHandler(item.id) }}
          </span>
        </div>
      </div>
      <v-card-actions class="px-0">
        <v-btn block color="primary" text @click="goto(item.id)" tag="a" :to="{name: 'Vacation', params: {uid, id: item.id}}">
          открыть
        </v-btn>
      </v-card-actions>
    </base-widget>
  </div>
</template>


<script>
import AddVacationModal from "../components/Modals/AddVacation.vue";
import TheCalendar from "@/components/TheCalendar";
import {schedules} from "@/mixins/ComputedData";
import BaseWidget from "@/components/Administration/BaseWidget";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import {Schedule} from "@/plugins/servises/Schedule";
import AppStatusChip from "@/components/AppStatusChip";

export default {
  name: 'TheVacations',
  STATUSES: Schedule.statuses,
  props: {
    vacations: {
      required: true
    },
    uid: {
      required: true
    }
  },
  mixins: [schedules],
  components: {
    AppStatusChip,
    AppBaseSheet,
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
    filteredSchedules() {
      return Object.values(this.schedules).filter(schedule => !schedule.isDraft)

    },
    fields() {
      return [
        {
          title: 'Отпусков',
          dataHandler: (id) => this.getVacationsCount(id)
        },
        {
          title: 'Отпусков одобрено',
          dataHandler: (id) => this.getVacationsCount(id, false, true)
        },
        {
          title: 'Отпусков на утверждении',
          dataHandler: (id) => this.getVacationsCount(id, true, false)
        },
        {
          title: 'Дней всего',
          dataHandler: (id) => this.getVacationsDays(id)
        },
        {
          title: 'Дней одобрено',
          dataHandler: (id) => this.getVacationsDays(id, false, true)
        },
        {
          title: 'Дней на утверждении',
          dataHandler: (id) => this.getVacationsDays(id, true, false)
        },
      ]
    }
  },
  methods: {
    getVacations(id, isSending, isApproved) {
      let currentVacations = Object.values(this.vacations[id] || {})

      if (isSending) currentVacations = currentVacations.filter(v => v.isSending())
      if (isApproved) currentVacations = currentVacations.filter(v => v.approved)

      return currentVacations
    },
    getVacationsCount(id, isSending = false, isApproved = false) {
      return this.getVacations(id, isSending, isApproved).length
    },
    getVacationsDays(id, isSending = false, isApproved = false) {
      const vacations = this.getVacations(id, isSending, isApproved)
      return vacations
        .reduce((sum, val) => {
          return sum + val.days
        }, 0)
    },
    goto(id) {
      this.$router.push({name: 'Vacation', params: {uid: this.uid, id}})
    },
  },
};
</script>
<style lang="scss" scoped>
.flex-basis-250 {
  flex: 1 1 250px;
}

.border-bottom-dotted {
  border-bottom: thin dotted #a4a4a4;
}

.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(95%, 1fr));
  }
}
</style>