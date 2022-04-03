<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="click">Test()</v-btn>
    <v-btn @click="click2">console user</v-btn>
    <br />
  </div>
</template>




<script>
import { mapState, mapGetters } from "vuex";

export default {
  data: () => ({
    snackbar: false,
    start: null,
    end: null,
    duration: null,
  }),
  methods: {
    async click() {
      this.$store.dispatch("workspace/db/test");
    },
    click2() {
      this.$store.dispatch("logUser");
    },
  },
};
</script>