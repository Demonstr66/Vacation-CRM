<template>
  <div>
    <v-progress-linear v-if="!dataIsReady" indeterminate></v-progress-linear>
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
        <td :colspan="headers.length">
          <div v-if="!!item.history">
            <v-timeline
              dense
            >
              <v-timeline-item
                small
                v-for="(historyItem, idx) in item.history"
                :key="idx"
              >
                <v-card
                  flat

                >
                  <v-card-title>
                    {{historyItem.statusChangeByUid}}
                  </v-card-title>
                  <v-card-subtitle>
                    {{$moment(historyItem.statusChangeAt).format('YYYY-MM-DD hh:mm')}}
                  </v-card-subtitle>
                  <blockquote>
                    {{historyItem.comment}}
                  </blockquote>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
          <div v-else>
            История отсутсвует
          </div>
        </td>
      </template>
      <template v-slot:top="item">
        <v-toolbar dense flat>
          <v-toolbar-title class="d-flex flex-column">
            <span>{{ schedule ? schedule.title : '' }}</span>
            <span :class="schedule && schedule.isActive ? 'error--text' : 'info--text'"
                  class="caption">
            {{
                schedule && schedule.isActive
                  ? 'Редактирование не доступно'
                  : 'Доступно для редактирования'
              }}
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
          {{ item.start | makeWeekDay | lowerCase }}
          <span class="font-weight-bold">{{ item.start | normalizeDate }}</span> -
          {{ item.end | makeWeekDay | lowerCase }}
          <span class="font-weight-bold">{{ item.end | normalizeDate }}</span>
        </div>
      </template>
      <template v-slot:item.status="{item}">
        <v-chip
          :id="item.id"
          :color="getStatusColor(item.status)"
          label
          outlined
          small
        >
          {{ vacationStatuses[item.status] }}
        </v-chip>
        <v-tooltip v-if="item.statusChangeByUid" :activator="'#'+item.id" bottom>
          <span>
              {{ getUserShortName(item.statusChangeByUid) }}:
              {{ $moment(item.statusChangeAt).format('YYYY-MM-DD hh:mm') }}
          </span>
          <br/>
          <span v-if="item.comment" class="font-italic">
            {{ item.comment }}
          </span>
        </v-tooltip>
      </template>
      <template v-slot:item.actually="{value}">
        <icon-btn-with-tip
          :color="!value ? 'success': 'error'"
          :icon="!value ? 'mdi-text-box-check' : 'mdi-text-box-remove'"
        >
          {{ !value ? 'Отпуск по заявлению' : 'Фактический отпуск (без заявления)' }}
        </icon-btn-with-tip>
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
              v-if="item.status === 3"
              icon="mdi-content-copy"
              @click="onCopy(item.id)"
            >
              Предложить исправление
            </icon-btn-with-tip>
            <icon-btn-with-tip
              :disable="item.approved || schedule.isActive"
              :icon="item.approved || schedule.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="onEdit(item.id)"
            >
              Редактировать
            </icon-btn-with-tip>
            <icon-btn-with-tip
              :disable="item.approved || schedule.isActive"
              color="error"
              icon="mdi-delete"
              @click="onDelete(item)"
            >
              Удалить
            </icon-btn-with-tip>
            <icon-btn-with-tip
              v-if="!!templateFile"
              :disable="item.actually"
              :loading="item.id == downloadingItemId"
              color="info"
              icon="mdi-download"
              @click="downloadVacation(item.id)"
            >
              Скачать заявление
            </icon-btn-with-tip>
          </div>
        </v-menu>
        <div v-else>
          <icon-btn-with-tip
            v-if="item.status === 3"
            icon="mdi-content-copy"
            @click="onCopy(item.id)"
          >
            Предложить исправление
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="item.approved || schedule.isActive"
            :icon="item.approved || schedule.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
            @click="onEdit(item.id)"
          >
            Редактировать
          </icon-btn-with-tip>
          <icon-btn-with-tip
            :disable="item.approved || schedule.isActive"
            color="error"
            icon="mdi-delete"
            @click="onDelete(item)"
          >
            Удалить
          </icon-btn-with-tip>
          <icon-btn-with-tip
            v-if="!!templateFile"
            :disable="item.actually"
            :loading="item.id == downloadingItemId"
            color="info"
            icon="mdi-download"
            @click="downloadVacation(item.id)"
          >
            Скачать заявление
          </icon-btn-with-tip>
        </div>
      </template>
    </v-data-table>
    <add-vacation
      :show="addModalVisible"
      :vacation-id="addModalEditItemId"
      @close="closeModal"
    ></add-vacation>
  </div>
</template>

<script>
import {posts, schedules, templateFile, vacationStatuses} from "@/mixins/ComputedData";
import AddVacation from "@/components/Modals/AddVacation";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {dataMethods} from "@/mixins/dataHelper";
import {vacationMethods} from "@/mixins/workspaceHelper";
import {dataToGenerateFile} from "@/plugins/schema";
import {lowerCase, makeWeekDay, normalizeDate} from "@/mixins/Filters";

export default {
  name: 'Vacation',
  components: {IconBtnWithTip, AddVacation},
  mixins: [schedules, dataMethods, vacationMethods, posts, templateFile, makeWeekDay,
    lowerCase, normalizeDate, vacationStatuses],
  data: () => ({
    expanded: [],
    schedule: null,
    uid: null,
    vacations: {},
    addModalVisible: false,
    addModalEditItemId: null,
    headers: [
      {text: 'Даты', value: 'start', align: 'start'},
      {text: 'Дней', value: 'days', align: 'start'},
      {text: 'Статус', value: 'status', align: 'center'},
      {text: 'Тип', value: 'actually', align: 'center'},
      {
        text: '',
        value: 'action',
        align: 'end',
        sortable: false,
      },
    ],
    downloadingItemId: null
  }),
  created() {
    this.$nextTick(() => {
      if (this.dataIsReady) this.initialize()
    })
  },
  computed: {
    dataIsReady() {
      return this.$store.getters['vacations/isReady'] &&
        this.$store.getters["schedules/isReady"] &&
        this.$store.getters["users/isReady"]
    },
  },
  methods: {
    initialize() {
      const id = this.$route.params.id
      const uid = this.$route.params.uid
      if (!uid || !id) return

      const vacations = this.$store.getters['vacations/getByUid'](uid)
      const user = this.$store.getters['users/getUserById'](uid)
      const schedule = this.schedules[id]

      if (!user || !schedule) this.redirect()

      this.schedule = schedule
      this.vacations = vacations[id] || {}
      this.uid = uid
      this.user = user


    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return '';
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
          return 'error';
      }
    },
    getUserShortName(uid) {
      return this.$store.getters['users/getUserById'](uid).displayName
    },

    async downloadVacation(id) {
      this.downloadingItemId = id

      const {start, end, days} = this.vacations[id]

      const postId = this.user.post
      const postObject = postId ? this.posts[postId] : null
      const post = postObject ? postObject.title : ''

      let data = dataToGenerateFile(this.user, {
        post,
        date: this.$moment().format('YYYY-MM-DD'),
        vstart: start,
        vend: end,
        vdays: days
      })

      await this.$store.dispatch('templateFile/generate', data)
      this.downloadingItemId = null
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
    onDelete(item) {
      this.mixDeleteVacation(item)
    },
    redirect() {
      this.$router.replace({name: 'Vacations'})
    }
  },
  watch: {
    dataIsReady(val) {
      if (val) this.initialize()
    }
  }
}
</script>
