<template>
  <div>
    <app-base-sheet class="flex-grow-1 d-flex flex-column justify-center">
      <span class="display-1 ml-2">{{ schedule && schedule.title }}</span>
      <div
        :class="schedule && schedule.isActive ? 'error--text' : 'info--text'"
        class="caption ml-1"
        v-text="schedule && schedule.isActive
                  ? 'Редактирование не доступно'
                  : 'Доступно для редактирования'"
      >
      </div>
    </app-base-sheet>

    <v-progress-linear v-if="!appReady" indeterminate></v-progress-linear>
    <app-block-with-right-navbar
      v-else
      no-hide-sidebar
      side-block-width="200"
    >
      <template #main>
        <app-base-sheet>
          <v-data-table
            :expanded="expanded"
            :headers="$options.HEADERS"
            :items="Object.values(vacations)"
            :items-per-page="-1"
            hide-default-footer
            no-data-text="Отпуска ещё не добавлены"
            show-expand
          >
            <template v-slot:expanded-item="{ headers, item }">
              <VacationEventsDetails :cols="headers.length" :events="item.events"/>
            </template>
            <template v-slot:top="item">
              <div class="d-flex justify-end">
                <v-btn
                  v-if="!schedule.isActive" class="ma-2" color="primary" text
                  @click="openAddModal()">
                  добавить отпуск
                </v-btn>
              </div>
            </template>
            <template v-slot:item.start="{item}">
              <VacationRangeLabel :end="item.end" :start="item.start"/>
            </template>
            <template v-slot:item.status="{item}">
              <app-status-chip
                :id="'state_' + item.id"
                :status="item.status"
                :statuses="$options.STATUSES"
              />

              <v-tooltip v-if="item.statusChangeByUid" :activator="'#state_'+item.id" bottom>
          <span>
              {{ getShortUserNameByUID(item.statusChangeByUid) }}:
              {{ $moment(item.statusChangeAt).format('YYYY-MM-DD HH:mm') }}
          </span>
                <br/>
                <span v-if="item.comment" class="font-italic">
            {{ item.comment }}
          </span>
              </v-tooltip>
            </template>
            <template v-slot:item.comment="{value}">
              <span v-if="value" class="font-italic font-weight-light">
                {{ value }}
              </span>
              <span v-else>
                Нет
              </span>
            </template>
            <template v-slot:item.action="{item}">
              <RowActions>
                <icon-btn-with-tip
                  v-if="!!templateFile"
                  :disable="item.actually"
                  :loading="item.id == downloadingItemId"
                  color="info"
                  icon="mdi-download"
                  @click="downloadApplication(item.id)"
                >
                  Скачать заявление
                </icon-btn-with-tip>
                <icon-btn-with-tip
                  v-if="item.status === 99"
                  :disable="schedule.isActive"
                  icon="mdi-content-copy"
                  @click="openAddModal(item.id)"
                >
                  Предложить исправление
                </icon-btn-with-tip>
                <icon-btn-with-tip
                  v-if="item.status === 0"
                  :disable="item.approved || schedule.isActive"
                  :icon="item.approved || schedule.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
                  @click="openAddModal(item.id)"
                >
                  Редактировать
                </icon-btn-with-tip>
                <Can :on="item" I='delete'>
                  <icon-btn-with-tip
                    v-if="item.status === 0"
                    :disable="schedule.isActive"
                    color="error"
                    icon="mdi-delete"
                    @click="onDelete(item.id)"
                  >
                    Удалить
                  </icon-btn-with-tip>
                </Can>
                <icon-btn-with-tip
                  v-if="item.status === 0"
                  :disable="schedule.isActive"
                  color="info"
                  icon="mdi-send"
                  @click="item.sendToApprove()"
                >
                  Отправить на утверждение
                </icon-btn-with-tip>
                <icon-btn-with-tip
                  v-if="item.status === 1"
                  :disable="schedule.isActive"
                  color="warning"
                  icon="mdi-cancel"
                  @click="item.cancelSend()"
                >
                  Отозвать
                </icon-btn-with-tip>
              </RowActions>
            </template>
          </v-data-table>
        </app-base-sheet>
      </template>
      <template #navbar>
        <div :class="{'flex-column': $vuetify.breakpoint.mdAndUp}" class="d-flex justify-start">
          <app-shield
            :text="addDayLabel(approvedDaysCount)"
            header="Одобрено"
            icon="mdi-calendar"
            icon-color="success"
          />
          <app-shield
            :text="addDayLabel(allDaysCount)"
            footer="дней добавлено"
            header="Всего"
            icon="mdi-calendar"
          />
          <app-shield
            :text="addDayLabel(rejectedDaysCount)"
            header="Отклонено"
            icon="mdi-calendar"
            icon-color="error"
          />
        </div>
      </template>
    </app-block-with-right-navbar>

    <app-popup
      ref="deletePopup"
    >
      Отпуск будет удалён. Продолжить?
    </app-popup>
    <add-vacation
      ref="addVacationModal"
    ></add-vacation>
  </div>
</template>

<script>
import {appReady, getShortUserNameByUID, templateFile} from "@/mixins/ComputedData";
import AddVacation from "@/components/Modals/AddVacation";
import Vacations from "@/plugins/TableHeaders/Vacations";
import AppShield from "@/components/AppShield";
import VacationEventsDetails from "@/components/VacationEventsDetails"
import iconBtnWithTip from "@/components/IconBtnWithTip";
import VacationRangeLabel from "@/components/VacationRangeLabel";
import AppStatusChip from "@/components/AppStatusChip";
import RowActions from "@/components/RowActions";
import {Vacation} from "@/plugins/servises/Vacation";
import AppPopup from "@/components/AppPopup";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";

export default {
  name: 'Vacation',
  components: {
    AppBlockWithRightNavbar,
    AppBaseSheet,
    AppPopup,
    AppShield,
    AddVacation,
    VacationEventsDetails,
    iconBtnWithTip,
    VacationRangeLabel,
    RowActions,
    AppStatusChip
  },
  mixins: [templateFile, appReady, getShortUserNameByUID],
  UID: null,
  SID: null,
  HEADERS: Vacations,
  STATUSES: Vacation.statuses,
  data: () => ({
    schedule: null,
    user: null,

    downloadingItemId: null,
    expanded: [],
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  computed: {
    vacations() {
      const {SID, UID} = this.$options
      return this.$store.getters['vacations/getBySidByUid'](SID, UID)
    },
    allDaysCount() {
      return this.sumDays(Object.values(this.vacations))
    },
    approvedDaysCount() {
      let vacations = Object.values(this.vacations)
        .filter(v => v.approved)
      return this.sumDays(vacations)
    },
    rejectedDaysCount() {
      let vacations = Object.values(this.vacations)
        .filter(v => v.isRejected())
      return this.sumDays(vacations)
    }
  },
  methods: {
    initialize() {
      const sid = this.$route.params.id
      const uid = this.$route.params.uid

      const user = this.$store.getters['users/getUserById'](uid)
      const schedule = this.$store.getters['schedules/getById'](sid)

      if (!user || !schedule) this.redirect()

      this.schedule = schedule
      this.user = user
      this.$options.UID = uid
      this.$options.SID = sid
    },
    addDayLabel(days) {
      if (days % 100 >= 10 && days % 100 <= 20 || days % 10 === 0) return days + ' дней'
      if (days % 10 === 1) return days + ' день'
      if (days % 10 <= 4) return days + ' дня'

      return days + ' дней'
    },
    sumDays(vacations) {
      let days = 0

      vacations.map(v => days += v.days)

      return days
    },
    async downloadApplication(id) {
      this.downloadingItemId = id
      this.vacations[id].downloadApplication().then(this.downloadingItemId = null)
    },
    async onDelete(id) {
      let result = await this.$refs.deletePopup.open()
      if (result) {
        this.vacations[id].delete()
      }
    },
    openAddModal(id) {
      this.$refs.addVacationModal.open(id)
    },
    redirect() {
      this.$router.replace({name: 'Vacations'})
    }
  },
  watch: {
    appReady() {
      this.initialize()
    }
  }
}
</script>
