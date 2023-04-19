<template>
  <app-base-sheet>
    <v-card flat height="100%">
      <v-card-title v-text="'Общие'"/>
      <v-card-text>
        <setting-row label="Управление пространством" description="Измение настроек и параметров пространства">
          <v-select
              :items="$options.userGroups"
              item-text="text"
              item-value="level"
              label="Кто может"
              hide-details
              persistent-hint
          >
            <template v-slot:prepend>
              <input-icon>mdi-account-group</input-icon>
            </template>
          </v-select>
        </setting-row>
        <setting-row label="Управление структурой" description="Управление задачами и командами">
          <v-select
              :items="$options.userGroups"
              item-text="text"
              item-value="level"
              label="Кто может"
              hide-details
              persistent-hint
          >
            <template v-slot:prepend>
              <input-icon>mdi-account-group</input-icon>
            </template>
          </v-select>
        </setting-row>
        <setting-row label="Управление пользователями" description="Создание, редактирование и удаление пользователей">
          <v-select
              :items="$options.userGroups"
              item-text="text"
              item-value="level"
              label="Кто может"
              hide-details
              persistent-hint
          >
            <template v-slot:prepend>
              <input-icon>mdi-account-group</input-icon>
            </template>
          </v-select>
        </setting-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import WorkspaceSetting from "@/components/workspace/Setting";
import SettingRow from "@/components/Account/setting-row";
import InputIcon from "@/components/InputIcon";

export default {
  name: "permission",
  components: {InputIcon, SettingRow, WorkspaceSetting, AppBaseSheet},
  userGroups: [
    {text: 'Только владелец', level: 0},
    {text: 'Владелец и администраторы', level: 1},
    {text: 'Все, кроме пользователей', level: 2},
  ],
  data() {
    return {
      readonly: true
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