<template>
  <app-block-with-right-navbar left side-block-width="300">
    <template v-slot:main>
      <router-view/>
    </template>
    <template v-slot:navbar>
      <account-nav :items="links"/>
    </template>
  </app-block-with-right-navbar>

  <!--  <div>-->
  <!--    <app-base-sheet class="text-center text-h6">-->
  <!--      Личные данные-->
  <!--    </app-base-sheet>-->

  <!--    <div class="d-grid grid-auto-col">-->
  <!--      <template v-if="!appReady">-->
  <!--        <app-base-sheet>-->
  <!--          <v-skeleton-loader loading min-height="250px" type="image"/>-->
  <!--        </app-base-sheet>-->
  <!--        <app-base-sheet>-->
  <!--          <v-skeleton-loader loading min-height="250px" type="image"/>-->
  <!--        </app-base-sheet>-->
  <!--        <app-base-sheet>-->
  <!--          <v-skeleton-loader loading min-height="250px" type="image"/>-->
  <!--        </app-base-sheet>-->
  <!--      </template>-->
  <!--      <template v-else>-->
  <!--        <the-user-info-->
  <!--          :disabled="!$can('updatePersonalData', user)"-->
  <!--          :user="user"-->
  <!--          solo-->
  <!--        />-->
  <!--        <the-account-info-->
  <!--          :user="user"-->
  <!--          solo-->
  <!--          disable-all-->
  <!--        />-->
  <!--        &lt;!&ndash;        <app-base-sheet>&ndash;&gt;-->
  <!--        &lt;!&ndash;          <v-card flat>&ndash;&gt;-->
  <!--        &lt;!&ndash;            <v-card-title>Управление</v-card-title>&ndash;&gt;-->
  <!--        &lt;!&ndash;            <v-card-text class="d-flex flex-column align-start justify-end">&ndash;&gt;-->
  <!--        &lt;!&ndash;              &lt;!&ndash;              <v-btn text color="error">Сменить пароль</v-btn>&ndash;&gt;&ndash;&gt;-->
  <!--        &lt;!&ndash;              &lt;!&ndash;              <v-btn text color="error">Сменить почту</v-btn>&ndash;&gt;&ndash;&gt;-->
  <!--        &lt;!&ndash;              <v-btn color="error" text @click="onDeleteAccount">удаление аккаунта</v-btn>&ndash;&gt;-->
  <!--        &lt;!&ndash;            </v-card-text>&ndash;&gt;-->
  <!--        &lt;!&ndash;          </v-card>&ndash;&gt;-->
  <!--        &lt;!&ndash;        </app-base-sheet>&ndash;&gt;-->
  <!--      </template>-->
  <!--    </div>-->

  <!--    <app-base-sheet class="text-center mt-5 text-h6">-->
  <!--      Параметры пространства-->
  <!--    </app-base-sheet>-->

  <!--    <div class="d-grid  grid-auto-col">-->
  <!--      <template v-if="!appReady">-->
  <!--        <app-base-sheet>-->
  <!--          <v-skeleton-loader-->
  <!--            min-height="250px" type="image"-->
  <!--          />-->
  <!--        </app-base-sheet>-->
  <!--        <app-base-sheet>-->
  <!--          <v-skeleton-loader-->
  <!--            min-height="250px" type="image"-->
  <!--          />-->
  <!--        </app-base-sheet>-->
  <!--      </template>-->
  <!--      <template v-else>-->
  <!--        <the-workspace-info-->
  <!--          :disabled="!$can('manage', 'Workspace')"-->
  <!--          :workspace="workspace"-->
  <!--        />-->
  <!--        <the-template-vacation-file/>-->
  <!--      </template>-->
  <!--    </div>-->


  <!--    <Can I="manage" on="Workspace">-->
  <!--      <app-base-sheet class="text-center mt-5 text-h6">-->
  <!--        Управление правами доступа-->
  <!--      </app-base-sheet>-->
  <!--      <app-base-sheet v-if="!appReady">-->
  <!--        <v-skeleton-loader-->
  <!--          min-height="250px" type="image"-->
  <!--        />-->
  <!--      </app-base-sheet>-->
  <!--      <workspace-setting v-else/>-->
  <!--    </Can>-->
  <!--  </div>-->
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
import AccountNav from "@/components/Account/account-nav";
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";

export default {
  name: 'Account',
  mixins: [workspace, appReady],
  components: {
    AppBlockWithRightNavbar,
    AccountNav,
    AppBaseSheet,
    WorkspaceSetting,
    TheTemplateVacationFile,
    TheWorkspaceInfo,
    TheAccountInfo,
    TheUserInfo
  },
  data() {
    return {
      links: [
        {header: 'Основные'},
        {id: 0, text: 'Личные данные', to: {name: 'profile'}, icon: ''},
        {id: 1, text: 'Параметры пространства', to: {name: 'workspace'}, icon: ''},
        {divider: true},
        {header: 'Отпуска'},
        {id: 2, text: 'Шаблон для заявления', to: {name: 'v-template'}, icon: ''},
        {id: 3, text: 'Уведомления', to: {name: 'v-rss'}, icon: ''},
        {id: 4, text: 'Безопасность', to: {name: 'v-permission'}, icon: ''},
      ]
    }
  },
  computed: {
    user() {
      return new User(this.$store.getters['currentUser/get'])
    }
  },
  methods: {
    onDeleteAccount() {
      const user = new User(this.user)
      this.$store.dispatch('auth/singOut')
          .then((res) => {
            return this.$store.dispatch('clearModulesData')
          })
          .then((res) => {
            return this.$store.dispatch('app/setLogoutState')
          })
          .then((res) => {
            user.delete()
            this.$router.push({name: 'Login'})
          })
          .catch((err) => {
            this.errorMessage(err)
          })

    }
  }
};
</script>

<style lang="scss" scoped>

.fix-col {
  max-width: 300px;
}

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