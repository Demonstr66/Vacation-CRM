<template>
  <v-app id="vuetify-app">
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

let unsubscribe = null

export default {
  components: {
    MainLayout,
    EmptyLayout,
    MainEmptyLayout,
    AppMessage
  },
  mixins: [appReady],
  computed: {
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
  watch: {
    async appReady(val) {
      if (val) {
        const rules = await this.$store.dispatch('initAbilities')
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

