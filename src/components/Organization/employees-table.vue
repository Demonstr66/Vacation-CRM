<template>
  <app-base-sheet>
    <v-data-table
        :items="Object.values(users)"
        item-key="uid"
        :search="JSON.stringify(filters)"
        :custom-filter="CUSTOM_USER_FILTER"
        :group-by.sync="groupBy"
        :headers="headers"
        :item-class="() => 'dropRow'"
        class="th-xs-pa-0 table-d-block"
        dense
    >
      <template v-slot:top>
        <app-group-toolbar v-model="groupBy">
          <btn-open-sidebar/>
        </app-group-toolbar>
      </template>
      <template v-slot:group.header="data">
        <app-table-group-header :data="data" :header="getGroupHeaderText(data.group, data.groupBy)"/>
      </template>
      <template v-slot:item.fullName="{item}">
        <app-table-user-info :user="item"/>
      </template>
      <template v-slot:item.post="{item}">
        <employee-post-title :id="item.post"/>
      </template>
      <template v-slot:item.team="{item}">
        <employee-team-title :id="item.team"/>
      </template>
      <template v-slot:item.tasks="{item}">
        <employee-tasks
            :dragging="dragging"
            :tasks="item.tasks"
            :editable="$can('updateAccountData', item)"
            @add="(taskId) => addTask(item.uid, taskId)"
            @remove="(taskId) => removeTask(item.uid, taskId)"
        />
      </template>
      <template v-slot:item.active="{item}">
        <employee-active-status
            :uid="item.uid"
            :active="item.active"
            :disable="!$can('updateAccountData', item)"
        />
      </template>
      <template v-slot:item.action="{item}">
        <row-actions>
          <employee-tools
              :disable="disableTools(item)"
              :uid="item.uid"
              @deleteEmployee="deleteEmployee"
              @editEmployee="(val) => $emit('editEmployee', val)"
          />
        </row-actions>
      </template>
      <template v-if="!$vuetify.breakpoint.smAndUp" v-slot:item="{item}">
        <app-table-employee-info-mobile
            :user="item"
            :disable="disableTools(item)"
            show-team
            show-post

            @addTask="(taskId) => addTask(item.uid, taskId)"
            @removeTask="(taskId) => removeTask(item.uid, taskId)"
            @deleteEmployee="deleteEmployee"
            @editEmployee="(val) => $emit('editEmployee', val)"
        />
        <v-divider/>
      </template>
    </v-data-table>
  </app-base-sheet>
</template>
<script>
import AppBaseSheet from "@/components/UI/app-base-sheet"
import AppGroupToolbar from "@/components/UI/app-group-toolbar"
import AppTableGroupHeader from "@/components/UI/app-table-group-header"
import AppTableUserInfo from "@/components/UI/app-table-employee-info"
import BtnOpenSidebar from "@/components/UI/btn-open-sidebar"
import EmployeePostTitle from "@/components/UI/app-employee-post-title"
import EmployeeTeamTitle from "@/components/UI/app-employee-team-title"
import RowActions from "@/components/RowActions"
import {users} from "@/mixins/ComputedData";
import {CUSTOM_USER_FILTER} from "@/mixins/Filters";
import Users from "@/plugins/TableHeaders/Users";
import EmployeeTasks from "@/components/Organization/employee-tasks";
import EmployeeActiveStatus from "@/components/Organization/employee-active-status";
import EmployeeTools from "@/components/Organization/employee-table-tools";
import AppTableEmployeeInfoMobile from "@/components/UI/app-table-employee-info-mobile";
import {Post} from "@/plugins/servises/Post";
import {Team} from "@/plugins/servises/Team";

export default {
  name: 'employees-table',
  components: {
    AppTableEmployeeInfoMobile,
    EmployeeTools,
    EmployeeActiveStatus,
    EmployeeTasks,
    AppBaseSheet,
    AppGroupToolbar,
    AppTableGroupHeader,
    AppTableUserInfo,
    BtnOpenSidebar,
    EmployeePostTitle,
    EmployeeTeamTitle,
    RowActions
  },
  mixins: [users, CUSTOM_USER_FILTER],
  props: {
    filters: {
      type: Object,
      default: () => {
      },
    },
    dragging: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupBy: null
    }
  },
  computed: {
    headers() {
      const screenSize = this.$vuetify.breakpoint.name
      return Users.filter(header => {
        if (header.visible && header.visible.length) {
          return header.visible.indexOf(screenSize) !== -1
        }
        return true
      })
    },
  },
  methods: {
    disableTools(item) {
      return {
        edit: !this.canEditEmployee(item),
        delete: !this.canDeleteEmployee(item)
      }
    },
    deleteEmployee(uid) {
      this.users[uid].delete()
    },
    canEditEmployee(employee) {
      return this.$can('updateAccountData', employee) ||
          this.$can('updatePersonalData', employee) ||
          this.$can('updateUserRole', employee) ||
          this.$can('updateTeam', employee)
    },
    canDeleteEmployee(employee) {
      return this.$can('delete', employee) && employee.uid !== this.currentUID
    },
    getGroupHeaderText(val, [groupBy]) {
      switch (groupBy) {
        case 'active':
          return val ? 'Зарегистрирован' : 'Не зарегистрирован';
        case 'team':
          return Team.getTitle(val)
        case 'post':
          return Post.getTitle(val)
        default:
          return groupBy
      }
    },
    addTask(uid, id) {
      this.users[uid].Task.add(id)
    },
    removeTask(uid, id) {
      this.users[uid].Task.remove(id)
    },
  }
}
</script>