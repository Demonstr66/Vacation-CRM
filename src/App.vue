<template>
  <v-app>
    <component :is="layout" :title="title">
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
import store from "@/store";

export default {
  components: {
    MainLayout,
    EmptyLayout,
    Message,
    Loading
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    layout() {
      return this.$route.meta && this.$route.meta.layout
        ? this.$route.meta.layout
        : "Loading";
    },
    title() {
      return this.$route.meta && this.$route.meta.title
        ? this.$route.meta.title
        : "Добро пожаловать";
    },
  },
  async created() {
    // this.$store.dispatch('onBeforeLoadingHandler')
    // this.$store.dispatch("onLoadHandler");
    // this.$store.dispatch("beforeLoading");
  },
};
</script>

