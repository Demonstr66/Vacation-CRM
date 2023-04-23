<template>
  <div class="d-flex flex-column justify-start fill-height">
    <span class="subtitle-1 text-truncate font-weight-medium">
      {{ user.fullName }}

      <app-self-chip v-if="user.uid === currentUID"/>
    </span>
    <div class="text--secondary" v-if="!simple && showEmail || showTeam || showPost">
      <div v-if="showPost">
        <span class="font-weight-bold">Должность: </span>
        <employee-post-title :id="user.post"/>
      </div>
      <div v-if="showTeam">
        <span class="font-weight-bold">Команда: </span>
        <employee-team-title :id="user.team"/>
      </div>
      <div v-if="showEmail">
        <span class="font-weight-bold">Email: </span>
        <app-employee-email :email="user.email"/>

      </div>
    </div>
  </div>
</template>
<script>
import AppSelfChip from "@/components/UI/app-self-chip"
import EmployeePostTitle from "@/components/UI/app-employee-post-title"
import EmployeeTeamTitle from "@/components/UI/app-employee-team-title"
import {currentUID} from "@/mixins/ComputedData";
import AppEmployeeEmail from "@/components/UI/app-employee-email";

export default {
  name: 'app-table-employee-info',
  components: {AppEmployeeEmail, AppSelfChip, EmployeePostTitle, EmployeeTeamTitle},
  mixins: [currentUID],
  props: {
    user: {},
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