<template>
  <div>
    <v-progress-linear v-if="!appReady" indeterminate></v-progress-linear>
    <v-data-table
      v-else
      :expanded="expanded"
      :headers="headers"
      :items="Object.values(vacations)"
      :items-per-page="-1"
      hide-default-footer
      no-data-text="Отпуска ещё не добавлены"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <VacationEventsDetails :headers="headers" :item="item"/>
      </template>
      <template v-slot:top="item">
        <v-toolbar dense flat>
          <v-toolbar-title class="d-flex flex-column">
            <span>{{ schedule.title }}</span>
            <span
              :class="schedule.isActive ? 'error--text' : 'info--text'"
              class="caption"
              v-text="schedule.isActive
                  ? 'Редактирование не доступно'
                  : 'Доступно для редактирования'"
            >
          </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onAddVocation">
            добавить отпуск
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.start="{item}">
        <div>
          <v-icon>mdi-calendar</v-icon>
          {{ item.start | getShortDayLabel | lowerCase }}
          <span class="font-weight-bold">{{ item.start | normalizeDate }}</span> -
          {{ item.end | getShortDayLabel | lowerCase }}
          <span class="font-weight-bold">{{ item.end | normalizeDate }}</span>
        </div>
      </template>
      <template v-slot:item.status="{item}">
        <v-chip
          :id="'state_' + item.id"
          :color="vacationStatuses[item.status].color"
          label
          outlined
          small
        >
          {{ vacationStatuses[item.status].title }}
        </v-chip>

        <v-tooltip v-if="item.statusChangeByUid" :activator="'#state_'+item.id" bottom>
          <span>
              {{ getUserDisplayName(item.statusChangeByUid) }}:
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
          <v-slide-group>
            <div>
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
              <icon-btn-with-tip
                v-if="item.status === 0"
                color="error"
                icon="mdi-delete"
                @click="onDelete(item.id)"
              >
                Удалить
              </icon-btn-with-tip>
            </div>
            <div>
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
            </div>
          </v-slide-group>
        </RowActions>
      </template>
    </v-data-table>
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
import {appReady, posts, templateFile, vacationStatuses} from "@/mixins/ComputedData";
import AddVacation from "@/components/Modals/AddVacation";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {dataMethods} from "@/mixins/dataHelper";
import {dataToGenerateFile} from "@/plugins/schema";
import {getShortDayLabel, lowerCase, normalizeDate} from "@/mixins/Filters";
import {VacationMethods} from "@/mixins/VacationMethods";
import Vacations from "@/plugins/TableHeaders/Vacations";
import {FileMethods} from "@/mixins/FileMethods";
import Alert from "@/components/Modals/Alert";
import VacationEventsDetails from "@/components/VacationEventsDetails";
import RowActions from "@/components/RowActions";

export default {
  name: 'Vacation',
  components: {RowActions, VacationEventsDetails, Alert, IconBtnWithTip, AddVacation},
  mixins: [dataMethods, VacationMethods, posts, templateFile, getShortDayLabel,
    lowerCase, normalizeDate, vacationStatuses, appReady, FileMethods],
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
    }
  },
  methods: {
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
    getUserDisplayName(uid) {
      return this.$store.getters['users/getDisplayNameByUID'](uid)
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
        data
      })
      this.downloadingItemId = null
    },

    onDelete(item) {
      this.deleteId = item.id
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
