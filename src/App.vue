<template>
  <v-app>
    <component :is="layout" :loading="!appReady" :title="title">
      <router-view></router-view>
    </component>
    <Message/>
  </v-app>
</template>

<script>
import MainLayout from "./layouts/Main.vue";
import EmptyLayout from "./layouts/Empty.vue";
import Message from "./components/Message.vue";
import fullScreen from "@/layouts/fullScreen";
import {appReady} from "@/mixins/ComputedData";

let unsubscribe = null

export default {
  components: {
    MainLayout,
    EmptyLayout,
    Message,
    fullScreen
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

