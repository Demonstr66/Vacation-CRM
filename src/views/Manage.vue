<template>
  <div>
    <v-data-table
      v-for="(item, idx) in items"
      :key="item.sid"
      :headers="headers"
      :items="item.vacations"
    >
      <template v-slot:top="items">
        {{ item.title }}
      </template>
      <template v-slot:item.uid="{item}">
        <div>
          {{ users[item.uid].fullName }}
        </div>
      </template>
      <template v-slot:item.start="{item}">
        <div>
          <v-icon>mdi-calendar</v-icon>
          {{ item.start | makeWeekDay | lowerCase }}
          <span class="font-weight-bold">{{ item.start | normalizeDate }}</span> -
          {{ item.end | makeWeekDay | lowerCase }}
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
        <v-menu
          v-if="$vuetify.breakpoint.smAndDown"
          content-class="no-sheet"
          offset-y
          top

        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <div class="d-flex flex-column white">
            <icon-btn-with-tip
              color="success"
              icon="mdi-check"
              @click="onAccept(item.id)"
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
          </div>
        </v-menu>
        <div v-else>
          <icon-btn-with-tip
            color="success"
            icon="mdi-check"
            @click="onAccept(item.id)"
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
        </div>
      </template>
    </v-data-table>
    <Alert
      :show="rejectAlertShow"
      @cancel="onCancelAlert"
      @submit="onReject"
    >
      Отпуск будет откланён. Продолжить?
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
  </div>
</template>

<script>
import {allVacations, currentUID, schedules, users} from "@/mixins/ComputedData";
import {lowerCase, makeWeekDay, normalizeDate} from "@/mixins/Filters";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import Alert from "@/components/Modals/Alert";
import {defVacation} from "@/plugins/schema";

export default {
  components: {Alert, IconBtnWithTip},
  mixins: [schedules, allVacations, lowerCase, makeWeekDay, normalizeDate, users, currentUID],
  name: "Manage",
  data: () => ({
    items: [],
    rejectAlertShow: false,
    rejectComment: '',
    selectedItem: null,
    headers: [
      {
        text: 'Имя',
        value: 'uid',
        cellClass: 'pa-0 px-2',
        class: 'text-no-wrap',
        align: 'start',
        groupable: false
      },
      {
        text: 'Даты',
        value: 'start',
        class: 'text-no-wrap',
        align: 'center',
      },
      {
        text: 'Дней',
        value: 'days',
        class: 'text-no-wrap',
        align: 'center',
      },
      {
        text: 'Статус',
        value: 'approved',
        align: 'center',
        class: 'pa-0 text-no-wrap',
        cellClass: 'fit-content',
      },
      {
        text: '',
        value: 'action',
        align: 'end',
        cellClass: 'px-0 fit-content border-left',
        sortable: false,
        groupable: false
      },
    ]
  }),
  created() {
    let vacations = this.allVacations
    let items = []

    for (let sid in vacations) {
      const needApproval = Object.values(vacations[sid]).filter(v => v.status === 1)
      if (needApproval.length == 0) continue

      items.push({
        title: this.schedules[sid].title,
        vacations: needApproval
      })
    }

    this.items = items
  },
  methods: {
    getUserShortName() {

    },
    showRejectAlert(item) {
      this.selectedItem = {...item}
      this.rejectAlertShow = true
    },
    onCancelAlert() {
      this.rejectAlertShow = false
      this.selectedItem = null
    },
    onReject() {
      this.$store.dispatch(
        'vacations/update',
        defVacation(
          this.selectedItem,
          {
            status: 3,
            comment: this.rejectComment,
            statusChangeByUid: this.currentUID,
            statusChangeAt: this.$moment().toISOString()
          }
        )
      )
    },
    onAccept(id) {

    },
  }
}
</script>

<style scoped>

</style>