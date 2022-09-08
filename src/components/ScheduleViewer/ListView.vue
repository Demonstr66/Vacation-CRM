<template>
  <div>
    <v-data-table
      :custom-filter="filter"
      :search="JSON.stringify(filters)"
      :expanded="expanded"
      :group-by.sync="groupBy"
      :headers="headers"
      :items="tree"
      show-expand
    >
      <template v-slot:top>
        <group-tools
          v-model="groupBy"
          :groups="groups"
        />
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <vacation-events-details :cols="headers.length" :events="item.events"/>
      </template>
      <template v-slot:group.header="{toggle, isOpen, groupBy, group, headers, remove}">
        <td :colspan="headers.length">
          <v-btn icon small @click="toggle">
            <v-icon v-if="isOpen">mdi-minus</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
          <span>
                {{ getGroupHeaderText(group, groupBy) }}
              </span>
          <v-btn icon small @click="remove">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </td>
      </template>
      <template v-slot:item.uid="{item}">
        <div class="text-no-wrap">
          {{ users[item.uid].displayName }}
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
      <template v-slot:item.status="{item}">
        <vacation-status-chip
          :status="item.status"
          :statuses="statuses"
        ></vacation-status-chip>
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
          <VacationTools
            :status="item.status"
            @approve="approveVacation(item.id)"
            @reject="rejectVacation(item.id)"
            @cancel="cancelVacation(item.id)"
          />
        </RowActions>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  appReady,
  currentUID,
  getShortUserNameByUID, posts,
  schedules, teams,
  users,
  vacationsBySid
} from "@/mixins/ComputedData";
import {getShortDayLabel, lowerCase, normalizeDate} from "@/mixins/Filters";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import Alert from "@/components/Modals/Alert";
import Manage from "@/plugins/TableHeaders/Manage";
import {VacationMethods} from "@/mixins/VacationMethods";
import RowActions from "@/components/RowActions";
import VacationStatusChip from "@/components/AppStatusChip";
import VacationTools from "@/components/ScheduleViewer/VacationTools";
import VacationEventsDetails from "@/components/VacationEventsDetails";
import GroupTools from "@/components/ScheduleViewer/GroupTools";
import {Vacation} from "@/plugins/servises/Vacation";

export default {
  name: "List",
  components: {
    GroupTools,
    VacationEventsDetails,
    VacationTools, VacationStatusChip, RowActions, Alert, IconBtnWithTip
  },
  mixins: [schedules, vacationsBySid, lowerCase, getShortDayLabel, normalizeDate, users,
    currentUID, appReady, getShortUserNameByUID, posts, teams],
  props: {
    vacations: {},
    filters: {
      type: Array
    }
  },
  inject: ['rejectVacation', 'cancelVacation', 'approveVacation'],
  data: () => ({
    headers: Manage,
    expanded: [],
    groupBy: null,
    groups: [
      {value: 'uid', text: 'Имени'},
      {value: 'post', text: 'Должноcтям'},
      {value: 'team', text: 'Командам'}
    ],
    statuses: Vacation.statuses
  }),
  computed: {
    tree() {
      let tree = this.vacations

      return tree
    }
  },
  methods: {
    filter(value, json, item) {
      const {filters} = this
      if (!filters || !filters.length) return true

      return filters.every(f => f(item))
    },
    getVacationById(id) {
      return this.vacations.find(v => v.id === id)
    },
    getGroupHeaderText(val, [groupBy]) {
      switch (groupBy) {
        case 'uid':
          return this.getShortUserNameByUID(val)
        case 'team':
          return this.teamTitle(val);
        case 'post':
          return this.postTitle(val);

        default:
          return groupBy
      }
    },
    postTitle(id) {
      return this.getTitle(id, this.posts)
    },
    teamTitle(id) {
      return this.getTitle(id, this.teams)
    },
    getTitle(id, items) {
      if (!id) return 'Не назначена'
      if (items === undefined) return 'Без названия'

      const item = items[id]
      return item ? item.title : "Без названия";
    }
  }
}
</script>

<style scoped>

</style>