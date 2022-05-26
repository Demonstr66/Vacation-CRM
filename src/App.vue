<template>
  <v-app>
    <component :is="layout" :title="title" :loading="loading">
      <router-view></router-view>
    </component>
    <Message />
  </v-app>
</template>

<script>
import MainLayout from "./layouts/Main.vue";
import EmptyLayout from "./layouts/Empty.vue";
import Message from "./components/Message.vue";
import Loading from "@/layouts/Loading";
import fullScreen from "@/layouts/fullScreen";

let unsubscribe = null

export default {
  components: {
    MainLayout,
    EmptyLayout,
    Message,
    Loading,
    fullScreen
  },
  data: () =>({
    loading: true,
    unsubscribe: null
  }),
  created() {
    unsubscribe = this.$store.subscribe((mutation, state) => {
      if (state.ready) this.appLoaded()
    })
  },
  computed: {
    layout() {
      return this.$route.meta && this.$route.meta.layout
        ? this.$route.meta.layout
        : "";
    },
    title() {
      return this.$route.meta && this.$route.meta.title
        ? this.$route.meta.title
        : "";
    },
  },
  methods: {
    appLoaded() {
      this.loading = false
      if (unsubscribe) unsubscribe()
    },
  }
};
</script>

