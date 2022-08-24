<template>
  <div>
    <v-progress-linear v-if="!appReady" indeterminate></v-progress-linear>
    <template v-else>


      <v-data-table
        :expanded="expanded"
        :headers="headers"
        :items="classedV"
        :items-per-page="-1"
        hide-default-footer
        no-data-text="Отпуска ещё не добавлены"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <VacationEventsDetails :cols="headers.length" :events="item.events"/>
        </template>
        <template v-slot:top="item">
          <div class="d-flex flex-column">
            <span class="headline">{{ schedule.title }}</span>
            <span
              :class="schedule.isActive ? 'error--text' : 'info--text'"
              class="caption"
              v-text="schedule.isActive
                  ? 'Редактирование не доступно'
                  : 'Доступно для редактирования'"
            >
          </span>
          </div>
          <div class="d-flex flex-row mt-2 align-end">
            <app-shield
              :text="daysApproved"
              footer="дней одобрено"
              header="Всего"
              icon="mdi-calendar"
              icon-color="success"
            />
            <app-shield
              :text="daysWithDoc"
              footer="отпуска по заявлению"
              header="Всего"
              icon="mdi-calendar"
            />
            <app-shield
              :text="daysWithoutDoc"
              footer="отпуска без заявления"
              header="Всего"
              icon="mdi-calendar"
            />
            <v-spacer/>
            <v-btn class="ma-2" color="primary" text @click="onAddVocation">
              добавить отпуск
            </v-btn>
          </div>
        </template>
        <template v-slot:item.start="{item}">
          <VacationRangeLabel :end="item.end" :start="item.start"/>
        </template>
        <template v-slot:item.status="{item}">
          <VacationStatusChip
            :id="'state_' + item.id"
            :status="item.status"
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
        <template v-slot:item.actually="{value}">
          <icon-btn-with-tip
            :color="!value ? 'info': 'secondary'"
            :icon="'mdi-file-document-' + (!value ? 'check' : 'minus')"
          >
            {{ !value ? 'Отпуск по заявлению' : 'Фактический отпуск (без заявления)' }}
          </icon-btn-with-tip>
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
              icon="mdi-content-copy"
              @click="onCopy(item.id)"
            >
              Предложить исправление
            </icon-btn-with-tip>
            <icon-btn-with-tip
              v-if="item.status === 0"
              :disable="item.approved || schedule.isActive"
              :icon="item.approved || schedule.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="onEdit(item.id)"
            >
              Редактировать
            </icon-btn-with-tip>
            <Can :on="item" I='delete'>
              <icon-btn-with-tip
                v-if="item.status === 0"
                color="error"
                icon="mdi-delete"
                @click="onDelete(item.id)"
              >
                Удалить
              </icon-btn-with-tip>
            </Can>
            <icon-btn-with-tip
              v-if="item.status === 0"
              color="info"
              icon="mdi-send"
              @click="onSendToApprove(item.id)"
            >
              Отправить на утверждение
            </icon-btn-with-tip>
            <icon-btn-with-tip
              v-if="item.status === 1"
              color="warning"
              icon="mdi-cancel"
              @click="onCancelApprove(item.id)"
            >
              Отозвать
            </icon-btn-with-tip>
          </RowActions>
        </template>
      </v-data-table>
    </template>
    <Alert
      :show="deleteAlert"
      @cancel="deleteAlertClose"
      @submit="deleteAlertSubmit"
    >
      Отпуск будет удалён. Продолжить?
    </Alert>
    <add-vacation
      :show="addModalVisible"
      :vacation-id="addModalEditItemId"
      @close="closeModal"
    ></add-vacation>
  </div>
</template>

<script>
import {
  appReady,
  getShortUserNameByUID,
  posts,
  templateFile,
  vacationStatuses
} from "@/mixins/ComputedData";
import AddVacation from "@/components/Modals/AddVacation";
import {dataMethods} from "@/mixins/dataHelper";
import {dataToGenerateFile} from "@/plugins/schema";
import {getShortDayLabel, lowerCase, normalizeDate} from "@/mixins/Filters";
import {VacationMethods} from "@/mixins/VacationMethods";
import Vacations from "@/plugins/TableHeaders/Vacations";

import {FileMethods} from "@/mixins/FileMethods";
import Alert from "@/components/Modals/Alert";
import AppShield from "@/views/App/AppShield";
import VacationEventsDetails from "@/components/VacationEventsDetails"
import iconBtnWithTip from "@/components/IconBtnWithTip";
import VacationRangeLabel from "@/views/App/VacationRangeLabel";
import VacationStatusChip from "@/views/App/VacationStatusChip";
import RowActions from "@/components/RowActions";

class Vacation {
  constructor(args) {
    for (let key in args) this[key] = args[key]
  }
}

export default {
  name: 'Vacation',
  components: {
    AppShield,
    Alert, AddVacation,
    VacationEventsDetails,
    iconBtnWithTip,
    VacationRangeLabel,
    RowActions,
    VacationStatusChip
  },
  mixins: [dataMethods, VacationMethods, posts, templateFile, getShortDayLabel,
    lowerCase, normalizeDate, vacationStatuses, appReady, FileMethods, getShortUserNameByUID],
  data: () => ({
    schedule: null,
    user: null,

    uid: null,
    sid: null,

    deleteAlert: false,
    deleteId: null,

    addModalVisible: false,
    addModalEditItemId: null,
    headers: Vacations,
    downloadingItemId: null,
    expanded: [],
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  computed: {
    vacations() {
      if (!this.sid || !this.uid) return {}

      return this.$store.getters['vacations/getBySidByUid'](this.sid, this.uid)
    },
    classedV() {
      let vs = Object.values(this.vacations)

      vs = vs.map(v => new Vacation(v))
      return vs
    },
    daysWithDoc() {
      const vacations = Object.values(this.vacations)
      let days = 0

      vacations.map(v => {
        if (!v.actually) {
          days += v.days
        }
      })

      return this.addDayLabel(days)
    },
    daysWithoutDoc() {
      const vacations = Object.values(this.vacations)
      let days = 0

      vacations.map(v => {
        if (v.actually) {
          days += v.days
        }
      })

      return this.addDayLabel(days)
    },
    daysApproved() {
      const vacations = Object.values(this.vacations)
      let days = 0

      vacations.map(v => {
        if (v.approved) {
          days += v.days
        }
      })

      return this.addDayLabel(days)
    },
  },
  methods: {
    addDayLabel(days) {
      if (days % 100 >= 10 && days % 100 <= 20 || days % 10 === 0) return days + ' дней'
      if (days % 10 === 1) return days + ' день'
      if (days % 10 <= 3) return days + ' дня'

      return days + ' дней'
    },
    initialize() {
      const sid = this.$route.params.id
      const uid = this.$route.params.uid
      if (!uid || !sid) return

      const user = this.$store.getters['users/getUserById'](uid)
      const schedule = this.$store.getters['schedules/getById'](sid)

      if (!user || !schedule) this.redirect()

      this.schedule = schedule
      this.user = user
      this.uid = uid
      this.sid = sid
    },
    async downloadApplication(id) {
      this.downloadingItemId = id

      const {start, end, days} = this.vacations[id]

      const postId = this.user.post
      const postObject = postId ? this.posts[postId] : null
      const post = postObject ? postObject.title : ''

      let data = dataToGenerateFile(this.user, {
        post,
        date: this.$moment().format('YYYY-MM-DD'),
        start: start,
        finish: end,
        days: days
      })

      await this.downloadWithDataFile({
        fullPath: this.templateFile.fullPath,
        data,
        fileName: 'Заявление на очередной оплачиваемый отпуск ' +
          this.getShortUserNameByUID(this.uid)
      })
      this.downloadingItemId = null
    },

    onDelete(id) {
      this.deleteId = id
      this.deleteAlert = true
    },
    deleteAlertClose() {
      this.deleteId = null
      this.deleteAlert = false
    },
    deleteAlertSubmit() {
      this.deleteVacation({id: this.deleteId, sid: this.sid})
      this.deleteAlertClose()
    },


    onEdit(id) {
      this.addModalEditItemId = id
      this.$nextTick(() => {
        this.showModal()
      })
    },
    onCopy(id) {
      this.addModalEditItemId = id
      this.$nextTick(() => {
        this.showModal()
      })
    },
    onSendToApprove(id) {
      let data = {...this.vacations[id]}
      data.status = 1
      this.updateVacation(data, {type: 'sendToApprove'})
    },
    onCancelApprove(id) {
      let data = {...this.vacations[id]}
      data.status = 0
      this.updateVacation(data, {type: 'cancelApproval'})
    },
    onAddVocation() {
      this.showModal();
    },
    showModal() {
      this.addModalVisible = true;
    },
    closeModal() {
      this.addModalVisible = false;
      this.addModalEditItemId = null
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
