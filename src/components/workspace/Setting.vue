<template>
  <app-base-sheet>
    <v-card flat height="100%" class="d-flex flex-column">
      <v-card-title>Управление правами</v-card-title>
      <v-card-text>
        <v-expansion-panels mandatory>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $options.ROLES[0].text }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <app-privacy-form
                  ref="userPermission"
                  readonly
                  :privacy="permissions[0]"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $options.ROLES[1].text }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <app-privacy-form
                  ref="leaderPermission"
                  :privacy="permissions[1]"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $options.ROLES[2].text }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <app-privacy-form
                  ref="adminPermission"
                  :privacy="permissions[2]"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $options.ROLES[3].text }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <app-privacy-form
                  ref="ownerPermission"
                  readonly
                  :privacy="permissions[3]"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-btn text small color="error" @click="sandboxOn" class="mt-2">
          Включить режим просмотра
        </v-btn>
      </v-card-text>
      <v-card-actions class="mt-auto justify-center">
        <v-btn color="success" text @click="onSave">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </app-base-sheet>
</template>

<script>
import {WorkspaceMethods} from "@/mixins/WorkspaceMethods";
import {appReady, workspace} from "@/mixins/ComputedData";
import AppPrivacyForm from "@/components/workspace/AppPrivacyForm";
import {Roles} from "@/plugins/servises/Roles";
import AppBaseSheet from "@/components/UI/app-base-sheet";
import {Workspace} from "@/plugins/servises/Workspace";

export default {
  name: "WorkspaceSetting",
  components: {AppBaseSheet, AppPrivacyForm},
  mixins: [WorkspaceMethods, workspace, appReady],
  ROLES: Object.values(Roles.roles),
  PRIVACY: Roles.defaultPermissions,
  data: () => ({
    valid: false,
  }),
  created() {
    if (this.appReady) {
      this.initialize()
    }
  },
  computed: {
    permissions() {
      let permissions = this.$store.getters['workspace/permissions']
      for (let id in this.$options.ROLES) {
        if (!permissions[id]) {
          permissions[id] = Roles.defaultPermissions[id]
        }
      }

      return permissions
    }
  },
  methods: {
    sandboxOn() {
      this.$store.dispatch('sandboxModeOn')
    },
    initialize() {
    },

    onSave() {
      const ws = this.$store.getters['workspace/get']

      this.$options.ROLES.map(role => {
        let component = this.$refs[role.type + 'Permission']
        if (component) {
          ws.permissions[role.id] = component.getData()
        }
      })

      ws.update(undefined, 'Правила сохранены')
    }
  },
  watch: {
    appReady() {
      this.initialize()
    }
  }
}
</script>

