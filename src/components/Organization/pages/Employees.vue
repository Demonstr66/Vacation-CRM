<template>
  <app-block-with-right-navbar>
    <template v-slot:main>
      <employees-table
          :dragging="dragging"
          :filters="filters"
          @editEmployee="showEditor"
      />
      <user-editor ref="userEditorModal"/>
      <Can :this="$options.someUser" I="create">
        <import-modal ref="importModal"/>
      </Can>
    </template>
    <template v-slot:sidebar>
      <app-filters v-model="filters" :hide-filters="['vacationStatus']">
        <template v-slot:header="{headerText}">
          <organization-employees-tools
              :inviting="invitingAll"
              :all-users-registered="isAllActive"

              @add="showEditor()"
              @import="showImport"
              @export=""
              @invite-all="inviteAll"
          />
        </template>
      </app-filters>
      <Can :on="$options.someUser" I="updateAccountData">
        <organization-draggable-tasks v-model="dragging"/>
      </Can>
    </template>
  </app-block-with-right-navbar>
</template>

<script>
import {currentUID, tasks, user, users} from "@/mixins/ComputedData";
import UserEditor from "@/components/Modals/UserEditor";
import AppPopup from "@/components/AppPopup";
import AppBlockWithRightNavbar from "@/components/UI/app-block-with-sidebar";
import OrganizationDraggableTasks from "@/components/Organization/organization-draggable-tasks";
import Users from "@/plugins/TableHeaders/Users";
import ImportModal from "@/components/Modals/ImportModal";
import {User} from "@/plugins/servises/User";
import {Message} from "@/plugins/servises/Message";
import AppFilters from "@/components/UI/app-filters";
import {CUSTOM_USER_FILTER} from "@/mixins/Filters";
import OrganizationEmployeesTools from "@/components/Organization/organization-employees-tools";
import EmployeesTable from "@/components/Organization/employees-table";

export default {
  name: 'Employees',
  someUser: new User(),
  mixins: [users, tasks, user, currentUID, CUSTOM_USER_FILTER],
  components: {
    EmployeesTable,
    OrganizationEmployeesTools,
    AppFilters,
    ImportModal,
    OrganizationDraggableTasks,
    AppBlockWithRightNavbar,
    AppPopup,
    UserEditor,
  },
  data() {
    return {
      dragging: false,
      groupBy: null,

      invitingUID: null,
      invitingAll: false,
      filter: {},
      filters: {}
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
    isAllActive() {
      return Object.values(this.users).every(user => user.active)
    }
  },
  methods: {
    async inviteAll() {
      // try {
      //   this.invitingAll = true
      //   let promises = []
      //   for (let uid in this.users) {
      //     let user = this.users[uid]
      //     if (!user.active) {
      //       promises.push(this.invite(user.uid, true))
      //     }
      //   }
      //
      //   await Promise.all(promises)
      //   Message.successMessage('Приглашения отправлены')
      // } catch (e) {
      //   Message.errorMessage(e)
      // } finally {
      //   this.invitingAll = false
      // }
    },
    showEditor(uid) {
      this.$refs.userEditorModal.open(uid)
    },
    showImport() {
      this.$refs.importModal.open()
    },
  },
};
</script>