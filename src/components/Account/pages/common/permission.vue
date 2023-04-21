<template>
  <div>
    <app-base-sheet>
      <v-card flat height="100%">
        <v-card-title v-text="'Общие'"/>
        <v-card-text>
          <setting-row label="Управление пространством" description="Измение настроек и параметров пространства">
            <account-permission-select v-model="commonRules.workspace"/>
          </setting-row>
          <setting-row label="Управление структурой" description="Управление задачами и командами">
            <account-permission-select v-model="commonRules.structure"/>
          </setting-row>
          <setting-row label="Управление пользователями"
                       description="Создание, редактирование и удаление пользователей">
            <account-permission-select v-model="commonRules.users"/>
          </setting-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <btn-submit @click="save('common', commonRules)"/>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </app-base-sheet>
    <app-base-sheet>
      <v-card flat height="100%">
        <v-card-title v-text="'Модуль отпусков'"/>
        <v-card-text>
          <setting-row label="Управление графиком" description="Создание, измениени и удаления графика отпусков">
            <account-permission-select v-model="vacationRules.schedule"/>
          </setting-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <btn-submit @click="save('vacation', vacationRules)"/>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </app-base-sheet>
  </div>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import SettingRow from "@/components/Account/setting-row";
import InputIcon from "@/components/InputIcon";
import AccountPermissionSelect from "@/components/Account/account-permission-select";
import BtnSubmit from "@/components/UI/btn-submit";

export default {
  name: "permission",
  components: {BtnSubmit, AccountPermissionSelect, InputIcon, SettingRow, AppBaseSheet},
  data() {
    return {
      readonly: true,
      commonRules: {
        workspace: [4],
        structure: [4],
        users: [4]
      },
      vacationRules: {
        schedule: [4]
      }
    }
  },
  methods: {
    save(key, data) {
      alert(`Save ${key} rules: \n${Object.entries(data).map(([key, val]) => `${key}: ${val}`).join('\n')}`)
    }
  }
}
</script>

<style scoped>
.flex-basis-50 {
  flex: 1 1 50% !important;
  max-width: 200px !important;
}
</style>