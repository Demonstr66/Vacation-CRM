<template>
  <div>
    <app-base-sheet class="text-center text-h6">
      Личные данные
    </app-base-sheet>

    <div class="d-grid grid-auto-col">
      <template v-if="!appReady">
        <app-base-sheet>
          <v-skeleton-loader loading type="image" min-height="250px"/>
        </app-base-sheet>
        <app-base-sheet>
          <v-skeleton-loader loading type="image" min-height="250px"/>
        </app-base-sheet>
      </template>
      <template v-else>
        <the-user-info
          :disabled="!$can('updatePersonalData', user)"
          :user="user"
          solo
        />
        <the-account-info
          :user="user"
          disable-all
        />
      </template>
    </div>

    <app-base-sheet class="text-center mt-5 text-h6">
      Параметры пространства
    </app-base-sheet>

    <div class="d-grid  grid-auto-col">
      <template v-if="!appReady">
        <app-base-sheet>
          <v-skeleton-loader
            type="image" min-height="250px"
          />
        </app-base-sheet>
        <app-base-sheet>
          <v-skeleton-loader
            type="image" min-height="250px"
          />
        </app-base-sheet>
      </template>
      <template v-else>
        <the-workspace-info
          :disabled="!$can('manage', 'Workspace')"
          :workspace="workspace"
        />
        <the-template-vacation-file/>
      </template>
    </div>


    <Can I="manage" on="Workspace">
      <app-base-sheet class="text-center mt-5 text-h6">
        Управление правами доступа
      </app-base-sheet>
      <app-base-sheet v-if="!appReady">
        <v-skeleton-loader
          type="image" min-height="250px"
        />
      </app-base-sheet>
      <workspace-setting v-else/>
    </Can>
  </div>
</template>

<script>
import TheWorkspaceInfo from "@/components/TheWorkspaceInfo";
import TheTemplateVacationFile from "@/components/workspace/TheTemplateVacationFile";
import {appReady, workspace} from "@/mixins/ComputedData";
import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";
import WorkspaceSetting from "@/components/workspace/Setting";
import {User} from "@/plugins/servises/User";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: 'Account',
  mixins: [workspace, appReady],
  components: {
    AppBaseSheet,
    WorkspaceSetting,
    TheTemplateVacationFile,
    TheWorkspaceInfo,
    TheAccountInfo,
    TheUserInfo
  },
  computed: {
    user() {
      return new User(this.$store.getters['currentUser/get'])
    }
  }
};
</script>

<style lang="scss" scoped>
.d-grid {
  display: grid;
}

.grid-auto-col {
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(95%, 1fr));
  }
}
</style>