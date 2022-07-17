<template>
  <v-card flat>
    <v-form v-model="valid" @submit.prevent="onSave">

      <v-card-title>Область видимости</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col align-self="end" class="text-right">
            <span class="mr-4 mb-2">Лидеры команд</span>
          </v-col>
          <v-col cols="8">
            <v-select
              v-model="teamLeader.visibility"
              :items="fieldsOfView"
              hide-details
              @change.once="isChanged = true"
            >
              <template v-slot:selection="{item}">
                <v-chip
                  label
                  small
                >
                  {{ item.text }}
                </v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col align-self="end" class="text-right">
            <span class="mr-4 mb-2">Пользователи</span>
          </v-col>
          <v-col cols="8">
            <v-select
              v-model="users.visibility"
              :items="fieldsOfView"
              hide-details
              @change.once="isChanged = true"
            >
              <template v-slot:selection="{item}">
                <v-chip
                  label
                  small
                >
                  {{ item.text }}
                </v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>Кто может управлять отпусками</v-card-title>
      <v-card-text>
        <v-select
          v-model="manageVacations"
          :item-disabled="disItem"
          :items="managers"
          chips
          dense
          hide-details
          multiple
          @change.once="isChanged = true"
        >
          <template v-slot:selection="{item}">
            <v-chip
              :disabled="item.value === 0"
              label
              small
            >
              {{ item.text }}
            </v-chip>
          </template>
        </v-select>
      </v-card-text>
      <v-card-title class="text-break">Кто может управлять управлять пользователями?</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col align-self="end" class="text-right">
            <span class="mr-4 mb-2">Администраторы</span>
          </v-col>
          <v-col cols="8">
            <v-select
              v-model="admin.manageUsers"
              :items="crudOptions"
              hide-details
              multiple
              single-line
              @change.once="isChanged = true"
            >
              <template v-slot:selection="{item}">
                <v-chip
                  label
                  small
                >
                  {{ item.text }}
                </v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col align-self="end" class="text-right">
            <span class="mr-4 mb-2">Лидеры команд</span>
          </v-col>
          <v-col cols="8">
            <v-select
              v-model="teamLeader.manageUsers"
              :items="crudOptions"
              hide-details
              multiple
              @change.once="isChanged = true"
            >
              <template v-slot:selection="{item}">
                <v-chip
                  label
                  small
                >
                  {{ item.text }}
                </v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>Кто может управлять пространством</v-card-title>
      <v-card-text>
        <v-select
          v-model="manageWS"
          :item-disabled="disItem"
          :items="managers"
          hide-details
          multiple
          @change.once="isChanged = true"
        >
          <template v-slot:selection="{item}">
            <v-chip
              :disabled="item.value === 0"
              label
              small
            >
              {{ item.text }}
            </v-chip>
          </template>
        </v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!isChanged" color="success" text type="submit">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import {WorkspaceMethods} from "@/mixins/WorkspaceMethods";
import {appReady, workspace} from "@/mixins/ComputedData";

export default {
  name: "WorkspaceSetting",
  mixins: [WorkspaceMethods, workspace, appReady],
  data: () => ({
    valid: false,
    isChanged: false,
    fieldsOfView: [
      {text: "Все", value: 0},
      {text: "Коллеги по команде и задачам", value: 1},
      {text: "Только коллеги по команде", value: 2},
      {text: "Только коллеги по задачам", value: 3},
      {text: "Никакие", value: 99},
    ],
    managers: [
      {text: "Я", value: 0},
      {text: "Администраторы", value: 1},
      {text: "Лидеры команд", value: 2},
    ],
    crudOptions: [
      {text: 'Редактирование', value: 0},
      {text: 'Создание', value: 1},
      {text: 'Удаление', value: 2},
    ],

    manageVacations: [],
    manageWS: [],
    admin: {
      manageUsers: []
    },
    teamLeader: {
      visibility: null,
      manageUsers: []
    },
    users: {
      visibility: null
    }
  }),
  created() {
    if (this.appReady) this.initialize()
  },
  methods: {
    initialize() {
      const privacy = JSON.parse(this.workspace.privacy || "{}")
      let manageWS = [0], manageVacations = [0]

      if (privacy.admins) {
        if (privacy.admins.manageWS) manageWS.push(1)
        if (privacy.admins.manageVacations) manageVacations.push(1)
        this.admin.manageUsers = privacy.admins.manageUsers
      }

      if (privacy.leaders) {
        if (privacy.leaders.manageWS) manageWS.push(2)
        if (privacy.leaders.manageVacations) manageVacations.push(2)
        this.teamLeader.manageUsers = privacy.leaders.manageUsers
        this.teamLeader.visibility = privacy.leaders.visibility
      }else {
        this.teamLeader.visibility = 0
      }

      if (privacy.users) {
        this.users.visibility = privacy.users.visibility
      }else {
        this.users.visibility = 0
      }

      this.manageWS = manageWS
      this.manageVacations = manageVacations
    },
    disItem(val) {
      return val.value === 0
    },
    onSave() {
      let groups = {
        admins: {},
        leaders: {},
        users: {},
      }

      let rules = {visibility: '', manageUsers: '', manageVacations: '', manageWS: ''}

      //Administrators
      rules.visibility = 0
      rules.manageUsers = this.admin.manageUsers
      rules.manageVacations = this.manageVacations.indexOf(1) !== -1
      rules.manageWS = this.manageWS.indexOf(1) !== -1
      groups.admins = {...rules}

      //Leaders
      rules.visibility = this.teamLeader.visibility
      rules.manageUsers = this.teamLeader.manageUsers
      rules.manageVacations = this.manageVacations.indexOf(2) !== -1
      rules.manageWS = this.manageWS.indexOf(2) !== -1
      groups.leaders = {...rules}

      //Users
      rules.visibility = this.users.visibility
      rules.manageUsers = []
      rules.manageVacations = []
      rules.manageWS = []
      groups.users = {...rules}

      let ws = {...this.workspace}
      const privacy = JSON.stringify(groups)
      ws.privacy = privacy

      this.updateWorkspace(ws)
    }
  },
  watch: {
    appReady() {
      this.initialize()
    }
  }
}
</script>
