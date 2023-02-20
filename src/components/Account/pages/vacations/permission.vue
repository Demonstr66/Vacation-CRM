<template>
  <app-base-sheet>
    <setting-row label="Управление Отпусками" description="Настройка действий с отпусками пользователей">
      <v-checkbox
          class="mr-2" dense hide-details
          label="Отмена решения"
          :disabled="readonly"
      />
      <v-select
          :items="$options.userGroups"
          class="mt-4"
          dense
          label="Управление отпусками"
          messages="Утверждение / Отклонение"
          outlined
          persistent-placeholder
          :disabled="readonly"

      />

      <small class="error--text">* Моя команда - команда где пользователь назначен лидером</small>
    </setting-row>
    <setting-row description="Настройка действий с графиком отпусков" label="Управление графиками">
      <v-checkbox class="flex-basis-50" dense hide-details label="Создание"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Изменение"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Удаление"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Активация"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Деактивация"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Утверждение"
                  :disabled="readonly"
      />
      <v-checkbox class="flex-basis-50" dense hide-details label="Отмена решения"
                  :disabled="readonly"
      />
    </setting-row>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import WorkspaceSetting from "@/components/workspace/Setting";
import SettingRow from "@/components/Account/setting-row";

export default {
  name: "permission",
  components: {SettingRow, WorkspaceSetting, AppBaseSheet},
  userGroups: [
    {text: 'Все', value: 'all'},
    {text: 'Моя и вложенные команды *', value: 'subTeams'},
    {text: 'Только моя команда *', value: 'team'},
    {text: 'Запрещено', value: 'none'},
  ],
}
</script>

<style scoped>

</style>