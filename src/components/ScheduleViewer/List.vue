<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
    >
      <template v-slot:item.uid="{item}">
        <div>
          {{ users[item.uid].fullName }}
        </div>
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
      <template v-slot:item.approved="{item}">
        <div>
          <v-tooltip v-if="item.approved" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip color="success" label outlined small
                      v-bind="attrs"
                      v-on="on">
                Утдверждено
              </v-chip>
            </template>
            <span>
              Утверждено: {{ getUserShortName(item.approvedBy) }}
            </span>
          </v-tooltip>
          <v-chip v-else color="warning" label outlined small>
            Ожидает подтверждения
          </v-chip>
        </div>
      </template>
      <template v-slot:item.action="{item}">
        <RowActions>
            <icon-btn-with-tip
              color="success"
              icon="mdi-check"
              @click="showAcceptAlert(item)"
            >
              Утвердить
            </icon-btn-with-tip>
            <icon-btn-with-tip
              color="error"
              icon="mdi-close"
              @click="showRejectAlert(item)"
            >
              Отклонить
            </icon-btn-with-tip>
        </RowActions>
      </template>
    </v-data-table>
    <Alert
      :show="rejectAlertShow"
      @cancel="onCancelAlert"
      @submit="onReject"
    >
      Отпуск будет отклонён. Продолжить?
      <v-form @submit>
        <v-textarea
          v-model="rejectComment"
          class="mt-2"
          hide-details
          no-resize
          placeholder="Комментарий"
          solo
        >

        </v-textarea>
      </v-form>
    </Alert>
    <Alert
      :show="acceptAlertShow"
      @cancel="onCancelAlert"
      @submit="onAccept"
    >
      Утвердить отпуск?
    </Alert>
  </div>
</template>

<script>
import {
  allVacations,
  appReady,
  currentUID,
  schedules,
  users,
  vacationsBySid
} from "@/mixins/ComputedData";
import {lowerCase, getShortDayLabel, normalizeDate} from "@/mixins/Filters";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import Alert from "@/components/Modals/Alert";
import {defVacation} from "@/plugins/schema";
import Manage from "@/plugins/TableHeaders/Manage";
import {VacationMethods} from "@/mixins/VacationMethods";
import RowActions from "@/components/RowActions";

export default {
  components: {RowActions, Alert, IconBtnWithTip},
  mixins: [schedules, vacationsBySid, lowerCase, getShortDayLabel, normalizeDate, users,
    currentUID, appReady, VacationMethods],
  name: "List",
  data: () => ({
    rejectAlertShow: false,
    acceptAlertShow: false,
    rejectComment: '',
    selectedItem: null,
    headers: Manage
  }),
  computed: {
    items() {
      const sid = this.$route.params.id
      const title = (this.schedules[sid] || {}).title
      const vacations = this.vacationsBySid(sid)

      const items = Object.values(vacations).filter(v => v.status === 1)

      console.log(items, sid, title)
      return items
    }
  },
  methods: {
    showRejectAlert(item) {
      this.selectedItem = {...item}
      this.rejectAlertShow = true
    },
    showAcceptAlert(item) {
      this.selectedItem = {...item}
      this.acceptAlertShow = true
    },
    onCancelAlert() {
      this.rejectAlertShow = false
      this.acceptAlertShow = false
      this.selectedItem = null
    },
    onReject() {
      const now = this.$moment().toISOString()
      let data = defVacation(
        this.selectedItem,
        {
          status: 99,
          comment: this.rejectComment,
          statusChangeByUid: this.currentUID,
          statusChangeAt: now
        }
      )
      let event = {type: 'reject', comment: this.rejectComment}

      this.updateVacation(data, event).then(() => {
        this.onCancelAlert()
      })
    },
    onAccept() {
      const now = this.$moment().toISOString()
      let data = defVacation(
        this.selectedItem,
        {
          status: 2,
          comment: this.rejectComment,
          statusChangeByUid: this.currentUID,
          statusChangeAt: now
        }
      )
      let event = {type: 'approved'}

      this.updateVacation(data, event).then(() => {
        this.onCancelAlert()
      })
    },
  }
}
</script>

<style scoped>

</style>