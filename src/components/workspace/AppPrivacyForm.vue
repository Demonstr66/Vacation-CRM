<template>
  <v-form>
    <div class="d-grid grid-auto-col">
      <div class="group flex-basis-50">
        <span class="label text-no-wrap">Общие</span>
        <v-switch v-model="manageWorkspace" dense hide-details inset
                  label="Управление пространстовом"
                  :disabled="readonly"
        />
        <v-switch v-model="manageStructure" dense hide-details inset
                  label="Управление структурой организации"
                  :disabled="readonly"
        />
        <v-switch v-model="updateUserRole" dense hide-details inset
                  label="Назначение Администраторов"
                  :disabled="readonly"
        />
      </div>
      <div class="group flex-basis-50">
        <span class="label text-no-wrap">Управление пользователями</span>
        <v-checkbox v-model="manageUsers.create" class="mr-2" dense hide-details
                    label="Создание / Удаление"
                    :disabled="readonly"

        />
        <v-checkbox v-model="manageUsers.updateTeam" class="mr-2" dense hide-details
                    label="Назначение в команды"
                    :disabled="readonly"

        />
        <v-select
          v-model="manageUsers.update"
          :items="$options.userGroups"
          class="mt-3"
          dense
          hide-details
          label="Редактирование"
          outlined
          persistent-placeholder
          :disabled="readonly"

        />
        <v-select
          v-model="manageUsers.vacations"
          :items="$options.userGroups"
          class="mt-4"
          dense
          label="Управление отпусками"
          messages="Создание / Редактирование / Отправка отпусков пользователя"
          outlined
          persistent-placeholder
          :disabled="readonly"

        />
        <small class="error--text">* Моя команда - команда где пользователь назначен лидером</small>
      </div>
      <div class="group flex-basis-50">
        <span class="label text-no-wrap">Управление Отпусками</span>
        <v-checkbox v-model="manageVacations.cancel" class="mr-2" dense hide-details
                    label="Отмена решения"
                    :disabled="readonly"
        />
        <v-select
          v-model="manageVacations.resolve"
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
      </div>
      <div class="group flex-basis-50">
        <span class="label text-no-wrap">Управление графиками</span>
        <div class="d-flex flex-wrap justify-space-between">
          <v-checkbox class="flex-basis-50" dense hide-details label="Создание"
                      v-model="manageSchedules.create"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Изменение"
                      v-model="manageSchedules.update"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Удаление"
                      v-model="manageSchedules.delete"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Активация"
                      v-model="manageSchedules.activate"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Деактивация"
                      v-model="manageSchedules.deactivate"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Утверждение"
                      v-model="manageSchedules.approve"
                      :disabled="readonly"
          />
          <v-checkbox class="flex-basis-50" dense hide-details label="Отмена решения"
                      v-model="manageSchedules.cancel"
                      :disabled="readonly"
          />
        </div>
      </div>
    </div>
  </v-form>
</template>
<script>
export default {
  name: 'app-privacy-form',
  userGroups: [
    {text: 'Все', value: 'all'},
    {text: 'Моя и вложенные команды *', value: 'subTeams'},
    {text: 'Только моя команда *', value: 'team'},
    {text: 'Запрещено', value: 'none'},
  ],
  props: {
    privacy: {
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    manageWorkspace: false,
    manageStructure: false,
    updateUserRole: false,
    manageUsers: {
      create: false,
      delete: false,
      updateTeam: false,
      update: 'none',
      vacations: 'none',
    },
    manageSchedules: {
      create: false,
      update: false,
      delete: false,
      activate: false,
      deactivate: false,
      approve: false,
      cancel: false,
    },
    manageVacations: {
      cancel: false,
      resolve: 'none',
    }
  }),
  methods: {
    getData() {
      let res = {}
      for (let key in this.$options.data()) {
        res[key] = this[key]
      }
      return res
    }
  },
  watch: {
    privacy: {
      immediate: true,
      handler(val) {
        if (val) Object.assign(this, val)
      }
    }
  }
}
</script>
<style lang="scss">
.group {
  position: relative;
  border: thin solid #bdbdbd;
  padding: 8px;
  border-radius: 4px;
  margin-top: 16px;

  & .label {
    position: absolute;
    top: -12px;
    left: 30px;
    padding: 0 4px;
    background-color: white;
    width: fit-content;
  }

  .flex-basis-50 {
    flex: 1 1 50% !important;
    max-width: 200px !important;
  }
}

.d-grid {
  display: grid;
  grid-gap: 10px;
}

.grid-auto-col {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(95%, 1fr));
  }
}
</style>