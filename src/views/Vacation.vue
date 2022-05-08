<template>
  <div>
    <v-data-table
      v-if="!!schedule"
      :headers="headers"
      :items="vacations"
      no-data-text="Отпуска ещё не добавлены"
    >
      <template v-slot:top>
        <v-toolbar dense flat>
          <v-toolbar-title class="d-flex flex-column">
            <span>{{ schedule.title }}</span>
            <span :class="schedule.isActive ? 'error--text' : 'info--text'" class="caption">
            {{
                schedule.isActive
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
          {{ item.start | weekDayFilter | lowerCase }}
          <span class="font-weight-bold">{{ item.start | dateFilter }}</span> -
          {{ item.end | weekDayFilter | lowerCase }}
          <span class="font-weight-bold">{{ item.end | dateFilter }}</span>
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
              :loading="item.id == loading"
              color="info"
              icon="mdi-download"
              @click="downloadVacation(item.id)"
            >
              Заявление
            </icon-btn-with-tip>
          </div>
        </v-menu>
        <div v-else>
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
            :loading="item.id == loading"
            color="info"
            icon="mdi-download"
            @click="downloadVacation(item.id)"
          >
            Заявление
          </icon-btn-with-tip>
        </div>
      </template>
    </v-data-table>
    <add-vacation
      v-if="addModal.visible"
      :existVacations="vacations.filter(v => v.id !== addModal.item.id)"
      :schedule="schedule || {}"
      :show="addModal.show"
      :vacation="addModal.item"
      @close="closeModal"
    ></add-vacation>
  </div>
</template>

<script>
import {myVacations, posts, schedules, templateFile, user} from "@/mixins/ComputedData";
import {dateDiff} from "@/plugins/utils";
import AddVacation from "@/components/Modals/AddVacation";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {dataMethods} from "@/mixins/dataHelper";
import {vacationMethods} from "@/mixins/workspaceHelper";
import {dataToGenerateFile} from "@/plugins/schema";

export default {
  name: 'Vacation',
  components: {IconBtnWithTip, AddVacation},
  mixins: [schedules, myVacations, dataMethods, vacationMethods, user, posts, templateFile],
  data: () => ({
    schedule: null,
    addModal: {
      show: false,
      visible: false,
      item: {}
    },
    headers: [
      {text: 'Даты', value: 'start', align: 'start'},
      {text: 'Дней', value: 'days', align: 'start'},
      {text: 'Статус', value: 'approved', align: 'center'},
      {text: 'Тип', value: 'actually', align: 'center'},
      {
        text: 'Действия',
        value: 'action',
        align: 'end',
        sortable: false
      },

    ],
    loading: null
  }),
  created() {
    this.initialize()
  },
  computed: {
    vacations() {
      try {
        return Object.values(this.myVacations[this.schedule.id] || {})
      } catch (e) {
        return []
      }
    }
  },
  methods: {
    getUserShortName(uid) {
      return this.$store.getters['users/getUserById'](uid).displayName
    },
    async downloadVacation(id) {
      this.loading = id
      const vacation = this.vacations.find(v => v.id === id)

      let data = dataToGenerateFile(this.user, {
        post: this.user.post ? this.posts[this.user.post].title : '',
        date: this.$moment().format('YYYY-MM-DD'),
        vstart: vacation.start,
        vend: vacation.end,
        vdays: vacation.days
      })
      await this.$store.dispatch('templateFile/generate', data)
      this.loading = null
    },
    initialize() {
      const id = this.$route.params.id
      this.schedule = this.schedules[id]
      if (!this.schedule) this.$router.replace({name: 'Vacations'})
    },
    onEdit(id) {
      this.addModal.item = this.myVacations[this.schedule.id][id]
      this.showModal()
    },
    onAddVocation() {
      this.showModal();
    },
    showModal() {
      this.addModal.visible = true;
      this.$nextTick(() => {
        this.addModal.show = true;
      })
    },
    closeModal() {
      this.addModal.show = false;
      this.addModal.item = {};

      this.$nextTick(() => {
        this.addModal.visible = false;
      })
    },
    onSubmitModal(dates) {
      this.addItem(dates);
      this.closeModal();
    },
    onDelete(item) {
      this.mixDeleteVacation(item)
    },
    addItem(dates) {
      const [start, end] = dates;
      const length = dateDiff(...dates);

      const item = {
        interval: {start, end, length},
        isApproved: false,
      };

      let items = localStorage.getItem("items") || [];

      if (items.length) items = JSON.parse(items);

      items.push(item);

      this.items = items;

      localStorage.setItem("items", JSON.stringify(items));
    },
  },
  filters: {
    weekDayFilter(val) {
      const weekDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return weekDay[new Date(val).getDay()]
    },
    dateFilter(val) {
      return val.split('-').reverse().join('.')
    },
    lowerCase(val) {
      return val.toLowerCase()
    }
  }
}
</script>
