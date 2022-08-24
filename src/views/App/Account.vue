<template>
  <v-row class="pa-0 ma-0">
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <the-user-info :user="user" solo></the-user-info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <the-account-info :user="user" disable-all></the-account-info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <the-workspace-info
        :workspace="workspace"
        solo
        :disabled="$can('manage', 'Workspace')"
      ></the-workspace-info>
    </v-col>
    <v-col class="pa-0 ma-0" cols="12" md="6">
      <the-template-vacation-file
        :disabled="$can('manage', 'Workspace')"
      ></the-template-vacation-file>
    </v-col>
    <Can I="mange" a="Workspace">
      <v-col class="pa-0 ma-0" cols="12" md="6">
        <workspace-setting></workspace-setting>
      </v-col>
    </Can>
  </v-row>
</template>

<script>
import TheWorkspaceInfo from "@/components/TheWorkspaceInfo";
import TheTemplateVacationFile from "@/components/workspace/TheTemplateVacationFile";
import {user, workspace} from "@/mixins/ComputedData";
import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";
import WorkspaceSetting from "@/components/workspace/Setting";

export default {
  name: 'Account',
  mixins: [user, workspace],
  components: {
    WorkspaceSetting,
    TheTemplateVacationFile,
    TheWorkspaceInfo,
    TheAccountInfo,
    TheUserInfo
  },
};
</script>
