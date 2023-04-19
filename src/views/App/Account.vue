<template>
  <app-block-with-right-navbar left side-block-width="300">
    <template v-slot:main>
      <router-view/>
    </template>
    <template v-slot:navbar>
      <account-nav :items="$options.links"/>
    </template>
  </app-block-with-right-navbar>
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
  links: [
    {header: 'Основные'},
    {text: 'Личные данные', to: {name: 'profile'}, icon: ''},
    {text: 'Параметры пространства', to: {name: 'workspace'}, icon: ''},
    {text: 'Настройка прав', to: {name: 'permission'}, icon: ''},
    {divider: true},
    {header: 'Отпуска'},
    {text: 'Шаблон для заявления', to: {name: 'v-template'}, icon: ''},
    {text: 'Уведомления', to: {name: 'v-rss'}, icon: ''},
  ],
  data() {
    return {}
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