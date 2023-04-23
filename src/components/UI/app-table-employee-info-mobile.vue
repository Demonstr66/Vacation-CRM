<template>
  <div style="max-width: 100%" class="d-flex justify-space-between align-center mt-2">
    <div style="max-width: 100%" class=" text-truncate">
      <div class="text-subtitle-2 text-no-wrap px-2">
        <span class=" font-weight-bold">{{ user.fullName }}</span>
        <app-self-chip v-if="user.uid === currentUID"/>
      </div>
      <template v-if="!simple && showEmail || showTeam || showPost">
        <div class="text-body-2 text-no-wrap px-2" v-if="showPost">
          <span class="font-weight-medium text--secondary">Должность:</span>
          <employee-post-title :id="user.post"/>
        </div>
        <div class="text-body-2 text-no-wrap px-2" v-if="showTeam">
          <span class="font-weight-medium text--secondary">Команда:</span>
          <employee-team-title :id="user.team"/>
        </div>
        <div class="text-body-2 text-no-wrap px-2" v-if="showEmail">
          <app-employee-email :email="user.email"/>
        </div>
      </template>
      <div class="text-body-2 text-no-wrap px-2 text-center">
        <employee-tasks :tasks="user.tasks"/>
        <!--        <v-chip-group v-if="user.tasks && user.tasks.length" column>-->
        <!--          <v-chip-->
        <!--              v-for="task in user.tasks"-->
        <!--              :key="task + user.uid"-->
        <!--              class="mx-1"-->
        <!--              small-->
        <!--              label-->
        <!--          >-->
        <!--            {{ getTaskTitle }}-->
        <!--          </v-chip>-->
        <!--        </v-chip-group>-->
      </div>
    </div>
    <row-actions>
      <employee-active-status
          :uid="user.uid"
          :active="user.active"
          :disable="!$can('updateAccountData', user)"
      />
      <employee-table-tools
          :disable="disable"
          :uid="user.uid"
          @deleteEmployee="(val) => $emit('deleteEmployee', val)"
          @editEmployee="(val) => $emit('editEmployee', val)"

          @add="(taskId) => $emit('addTask', taskId)"
          @remove="(taskId) => $emit('removeTask', taskId)"
      />
    </row-actions>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import RowActions from "@/components/RowActions"
import AppSelfChip from "@/components/UI/app-self-chip";
import EmployeePostTitle from "@/components/UI/app-employee-post-title";
import EmployeeTeamTitle from "@/components/UI/app-employee-team-title";
import EmployeeTasks from "@/components/Organization/employee-tasks";
import EmployeeActiveStatus from "@/components/Organization/employee-active-status";
import EmployeeTableTools from "@/components/Organization/employee-table-tools";
import {currentUID} from "@/mixins/ComputedData";
import AppEmployeeEmail from "@/components/UI/app-employee-email";

export default {
  name: 'app-table-employee-info-mobile',
  components: {
    AppEmployeeEmail,
    EmployeeTableTools,
    EmployeeActiveStatus,
    EmployeeTasks, EmployeeTeamTitle, EmployeePostTitle, AppSelfChip, IconBtnWithTip, RowActions
  },
  mixins: [currentUID],
  props: {
    user: {},
    disable: {
      type: Object,
      validator: function (val) {
        return val.hasOwnProperty('edit') && val.hasOwnProperty('delete')
      }
    },
    simple: {
      type: Boolean,
      default: false
    },
    showEmail: {
      type: Boolean,
      default: true
    },
    showTeam: {
      type: Boolean,
      default: false
    },
    showPost: {
      type: Boolean,
      default: false
    }
  }
}
</script>