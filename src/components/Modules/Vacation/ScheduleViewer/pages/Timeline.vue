<template>
  <div>
    Timeline view
  </div>
</template>
<!--<template>-->
<!--  <div>-->
<!--    <app-group-toolbar v-model="groupBy">-->
<!--      <btn-open-sidebar/>-->
<!--    </app-group-toolbar>-->
<!--    <template v-if="!tree.length">-->
<!--      <v-divider class="mt-5"/>-->
<!--      <div-->
<!--          class="text-center my-3 subtitle-2 font-weight-regular"-->
<!--          style="color: rgba(0, 0, 0, 0.38);"-->
<!--      >-->
<!--        <span v-if="vacations.length">Не найдено подходящих записей</span>-->
<!--        <span v-else>Отсутствуют данные</span>-->
<!--      </div>-->
<!--      <v-divider/>-->
<!--    </template>-->
<!--    <the-timeline-->
<!--        v-else-->
<!--        :exception="exception || []"-->
<!--        :items="tree"-->
<!--        :year="parseInt(year)"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import TheTimeline from "@/components/Modules/Vacation/ScheduleViewer/timeline-base";-->
<!--import {convertUsersToTree} from "@/plugins/utils";-->
<!--import {posts, tasks, teams} from "@/mixins/ComputedData";-->
<!--import AppGroupToolbar from "@/components/UI/app-group-toolbar";-->
<!--import BtnOpenSidebar from "@/components/UI/btn-open-sidebar";-->

<!--export default {-->
<!--  name: "TimelineView",-->
<!--  components: {BtnOpenSidebar, AppGroupToolbar, TheTimeline},-->
<!--  mixins: [teams, tasks, posts],-->
<!--  props: {-->
<!--    filters: {-->
<!--      type: Array-->
<!--    },-->
<!--    vacations: {},-->
<!--    year: {-->
<!--      type: [String, Number]-->
<!--    },-->
<!--    exception: {-->
<!--      type: Array-->
<!--    }-->
<!--  },-->
<!--  data: () => ({-->
<!--    hideEmptyGroups: true,-->
<!--    groupBy: null,-->
<!--    maxTotalDays: 28,-->
<!--    groups: [-->
<!--      {value: 'tasks', text: 'Задачам'},-->
<!--      {value: 'posts', text: 'Должноcтям'},-->
<!--      {value: 'teams', text: 'Командам'}-->
<!--    ],-->
<!--  }),-->
<!--  computed: {-->
<!--    filteredVacations() {-->
<!--      return this.vacations.filter(this.filter)-->
<!--    },-->
<!--    tree() {-->
<!--      const {filteredVacations, groupBy, hideEmptyGroups} = this-->
<!--      const users = [...this.groupVacationsByUser(Object.values(filteredVacations))]-->
<!--      let tree = [...convertUsersToTree(users, groupBy, this.getHeaders(groupBy))]-->

<!--      if (hideEmptyGroups && groupBy) {-->
<!--        tree = tree.filter(node => node.children && node.children.length)-->
<!--      }-->

<!--      tree = tree.map(node => {-->
<!--        let active = 0,-->
<!--            sending = 0,-->
<!--            total = 0-->
<!--        node.events.map(e => {-->
<!--          if (e.status == 2) {-->
<!--            active += e.days-->
<!--          } else if (e.status == 1) {-->
<!--            sending += e.days-->
<!--          }-->
<!--        })-->

<!--        total = sending + active-->
<!--        let percent = Math.round(total * 100 / this.maxTotalDays)-->
<!--        if (percent > 100) {-->
<!--          percent = 100-->
<!--        }-->

<!--        node.total = {-->
<!--          total,-->
<!--          active,-->
<!--          sending,-->
<!--          percent-->
<!--        }-->

<!--        return node-->
<!--      })-->

<!--      return tree-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    filter(item) {-->
<!--      const {filters} = this-->
<!--      if (!filters || !filters.length) {-->
<!--        return true-->
<!--      }-->

<!--      return filters.every(f => f(item))-->
<!--    },-->
<!--    getVacationById(id) {-->
<!--      return this.vacations.find(v => v.id === id)-->
<!--    },-->
<!--    groupVacationsByUser(vacations) {-->
<!--      let users = {}-->
<!--      vacations.map(v => {-->
<!--        if (!users[v.uid]) {-->
<!--          users[v.uid] = {-->
<!--            uid: v.uid,-->
<!--            user: {...this.$store.getters['users/getUserById'](v.uid)},-->
<!--            events: []-->
<!--          }-->
<!--          users[v.uid].title = users[v.uid].user.displayName-->
<!--        }-->

<!--        users[v.uid].events.push({...v})-->
<!--      })-->

<!--      return Object.values(users)-->
<!--    },-->
<!--    getHeaders(groupBy) {-->
<!--      if (['tasks', 'teams', 'posts'].indexOf(groupBy) !== -1) {-->
<!--        return Object.values(this[groupBy])-->
<!--      }-->

<!--      return null-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->