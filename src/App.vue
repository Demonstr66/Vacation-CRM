<template>
  <v-app id="vuetify-app">
    <v-system-bar v-if="sandboxMode" app class="justify-center" color="error">
      <span class="mr-2">Выбор роли:</span>
      <v-btn-toggle v-model="sandBoxRole" class="mr-2" color="warning" mandatory>
        <v-btn v-for="role in $options.ROLES" :key="role.id" outlined text x-small>
          {{ role.text }}
        </v-btn>
      </v-btn-toggle>
      <v-btn class="white--text font-weight-bold" small text @click="sandBoxOff">
        ЗАРКЫТЬ
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-system-bar>

    <component :is="layout" :loading="!appReady" :title="title">
      <router-view></router-view>
    </component>
    <app-message/>
  </v-app>
</template>

<script>
import MainLayout from "@/layouts/Main.vue";
import MainEmptyLayout from "@/layouts/MainEmpty"
import EmptyLayout from "@/layouts/Empty.vue";
import AppMessage from "@/components/Message";
import {appReady} from "@/mixins/ComputedData";
import {Message} from "@/plugins/servises/Message";
import {Roles} from "@/plugins/servises/Roles";
import {mapGetters} from "vuex";

export default {
  ROLES: Object.values(Roles.roles),
  components: {
    MainLayout,
    EmptyLayout,
    MainEmptyLayout,
    AppMessage
  },
  mixins: [appReady],
  data: () => ({
    sandBoxRole: -1,
  }),
  computed: {
    ...mapGetters({'sandboxMode': 'sandboxMode', currentUserRole: 'currentUser/role'}),
    userRole() {
      const roleType = this.currentUserRole
      const role = roleType && this.$options.ROLES.find(role => role.type === roleType)
      return role ? role.id : -1
    },
    role() {
      if (this.sandboxMode) {
        return this.sandBoxRole
      } else {
        return this.userRole
      }
    },
    layout() {
      return this.$route.meta && this.$route.meta.layout || ""
    },
    title() {
      return this.$route.meta && this.$route.meta.title || ""
    },
  },
  errorCaptured(err, vm, info) {
    Message.errorMessage(err)
    return true
  },
  methods: {
    sandBoxOff() {
      this.$store.dispatch('sandboxModeOff')
    }
  },
  watch: {
    userRole(val) {
      this.sandBoxRole = val
    },
    role(val) {
      console.log('ROLE CHANGED', val)
      const user = this.$store.getters['currentUser/get']

      if (user) {
        let permissions = this.$store.getters['workspace/permissions']
        if (!permissions) permissions = {}
        if (!permissions[val]) permissions[val] = Roles.defaultPermissions[val]

        const rules = Roles.defineAbilitiesFor(user, permissions[val])
        this.$ability.update(rules)
      }
    }
  }
};
</script>

<style lang="css">
#vuetify-app {
  background: linear-gradient(-45deg, #ee7752, #e0e18b, #97cfdb, #23a6d5);
  background-size: 500% 500%;
  animation: gradient 40s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

