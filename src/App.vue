<template>
  <v-app>
    <component :is="layout" :title="title">
      <router-view></router-view>
    </component>
    <Message />
    <v-overlay :value="isLoading" color="accent" opacity=".4" z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>



<script>
import MainLayout from "./layouts/Main.vue";
import EmptyLayout from "./layouts/Empty.vue";
import Message from "./components/Message.vue";

export default {
  components: {
    MainLayout,
    EmptyLayout,
    Message,
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    layout() {
      return this.$route.meta && this.$route.meta.layout
        ? this.$route.meta.layout
        : "EmptyLayout";
    },
    title() {
      return this.$route.meta && this.$route.meta.title
        ? this.$route.meta.title
        : "Страница";
    },
  },
  async created() {
    this.isLoading = true;
    await this.$store.dispatch("onLoadHandeler");
    this.isLoading = false;
  },
};
</script>

