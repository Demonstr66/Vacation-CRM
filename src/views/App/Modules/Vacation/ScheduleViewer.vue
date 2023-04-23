<template>
  <div>
    <schedule-header v-if="!!schedule" :title="schedule.title" :editable="!schedule.isApprove"/>
    <app-tabs-nav :tabs="$options.TABS"/>
    <v-progress-linear v-if="!schedule" indeterminate></v-progress-linear>
    <app-block-with-sidebar v-else>
      <template v-slot:main>
        <app-base-sheet>
          <router-view
              :exception="schedule.exception"
              :vacations="vacations"
              :year="schedule.year"
          />
        </app-base-sheet>
      </template>
      <template v-slot:sidebar>
        <app-filters v-model="filter"/>
      </template>
    </app-block-with-sidebar>
    <app-popup ref="rejectPopup" show-comment>
      Отпуск будет отклонён. Продолжить?
    </app-popup>
    <app-popup ref="approvePopup">
      Утвердить отпуск?
    </app-popup>
    <app-popup ref="cancelPopup" show-comment>
      Отозвать решение?
    </app-popup>
  </div>
</template>

<script>
import {appReady, schedules} from "@/mixins/ComputedData";

import AppPopup from "@/components/AppPopup";
import TimelineView from "@/components/Modules/Vacation/ScheduleViewer/pages/Timeline";
import ListView from "@/components/Modules/Vacation/ScheduleViewer/pages/List";
import AppBaseSheet from "@/components/UI/app-base-sheet";
import AppBlockWithSidebar from "@/components/UI/app-block-with-sidebar";
import AppFilters from "@/components/UI/app-filters";
import Tools from "@/plugins/tools";
import ScheduleHeader from "@/components/Modules/Vacation/schedule-header";
import AppTabsNav from "@/components/UI/app-tabs-nav";

export default {
  name: 'ScheduleViewer',
  components: {AppTabsNav, ScheduleHeader, AppFilters, AppPopup, AppBlockWithSidebar, AppBaseSheet},
  mixins: [schedules, appReady],
  TABS: [
    {name: 'ScheduleViewerList', title: 'Список', component: 'ListView'},
    {name: 'ScheduleViewerTimeline', title: 'Таймлайн', component: 'TimelineView'},
  ],
  data() {
    return {
      schedule: null,
      filter: {}
    }
  },
  created() {
    if (this.appReady) {
      this.initialize()
    }
  },
  computed: {
    vacations() {
      const scheduleId = this.$route.params.id

      let vacations = Object.values(this.$store.getters['vacations/getBySid'](scheduleId))

      vacations = vacations.map(vacation => {
        let user = this.$store.getters['users/getUserById'](vacation.uid)
        vacation.team = user.team
        vacation.post = user.post
        return vacation
      })

      vacations = vacations.filter(vacation => !vacation.isDraft())

      return vacations
    }
  },
  provide() {
    return {
      approveVacation: this.onApprove,
      rejectVacation: this.onReject,
      cancelVacation: this.onCancel,
    }
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) {
        this.$router.replace({name: 'ScheduleHome'})
      }
    },
    async onReject(id) {
      let result = await this.$refs.rejectPopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).reject(result.comment)
      }
    },
    async onApprove(id) {
      let result = await this.$refs.approvePopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).approve()
      }
    },
    async onCancel(id) {
      let result = await this.$refs.cancelPopup.open()

      if (result) {
        this.vacations.find(vacation => vacation.id === id).cancel(result.comment)
      }
    }
  },
  watch: {
    appReady() {
      this.initialize()
    },
  }
}
</script>
