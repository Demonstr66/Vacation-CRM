<template>
  <div>
    <app-base-sheet>
      <v-card-title>Настройка отпускных дней</v-card-title>
    </app-base-sheet>
    <app-block-with-right-navbar>
      <template v-slot:main>
        <app-base-sheet>
          <app-group-toolbar v-model="groupBy" :hide-groups="['active']">
            <btn-open-sidebar/>
          </app-group-toolbar>
          <v-data-table
              :items="Object.values(users)"
              :custom-filter="CUSTOM_USER_FILTER"
              :search="JSON.stringify(filters)"
              item-key="uid"
              :headers="$options.headers"
              :options="{itemsPerPage: 15}"
              :group-by.sync="groupBy"
              dense
          >
            <template v-slot:group.header="data">
              <app-table-group-header :data="data" :header="getGroupHeader(data.groupBy[0], data.group)"/>
            </template>
            <template v-slot:item.vacationDays="{item}">
              <input-num-with-controls :min="-50" :disabled="!editMode"/>
            </template>
          </v-data-table>
        </app-base-sheet>
      </template>
      <template v-slot:sidebar>
        <app-user-filter v-model="filters" :hide-filters="['vacationStatus']">
          <template v-slot:header="{headerText}">
            <v-btn text outlined :color="editMode ? 'deep-orange' : 'primary'" block @click="toggleEditMode">
              <v-icon v-if="!editMode" color="primary">mdi-lock</v-icon>
              <v-icon v-else color="deep-orange">mdi-lock-open-variant</v-icon>
              Редактирование
            </v-btn>
            <v-btn text outlined color="primary" block class="mt-1" @click="addDays">
              Начислить дни
            </v-btn>
            <btn-submit block class="mt-1" :disabled="!allowSave"/>
          </template>
        </app-user-filter>
      </template>
    </app-block-with-right-navbar>
  </div>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import AppBlockWithRightNavbar from "@/components/UI/app-block-with-sidebar";
import {users} from "@/mixins/ComputedData";
import vacationStats from "@/plugins/TableHeaders/VacationStats";
import InputNumWithControls from "@/components/Modules/Vacation/VacationStatistic/input-num-with-controls";
import AppUserFilter from "@/components/UI/app-filters";
import AppGroupToolbar from "@/components/UI/app-group-toolbar";
import BtnOpenSidebar from "@/components/UI/btn-open-sidebar";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import BtnSubmit from "@/components/UI/btn-submit";
import {CUSTOM_USER_FILTER} from "@/mixins/Filters";
import AppTableGroupHeader from "@/components/UI/app-table-group-header";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";


export default {
  name: "VacationStatistic",
  components: {
    AppTableGroupHeader,
    BtnSubmit,
    IconBtnWithTip,
    BtnOpenSidebar,
    AppGroupToolbar, AppUserFilter, InputNumWithControls, AppBlockWithRightNavbar, AppBaseSheet
  },
  headers: vacationStats,
  mixins: [users, CUSTOM_USER_FILTER],
  data() {
    return {
      days: 0,
      expanded: [],
      editMode: false,
      groupBy: null,
      filters: {},
      allowSave: false
    }
  },
  methods: {
    addDays() {
      this.allowSave = true
    },
    toggleEditMode() {
      this.editMode = !this.editMode
      this.allowSave = true
    },
    getGroupHeader(key, id) {
      switch (key) {
        case 'post':
          return Post.getTitle(id);
        case 'team':
          return Team.getTitle(id);
        default:
          return id;
      }
    }
  }
}
</script>

<style scoped>
</style>