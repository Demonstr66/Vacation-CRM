<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="click">open</v-btn>
    <v-btn @click="click2">close</v-btn>
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
      this.$store.dispatch("setMessage", {
        type: "success",
        code: 'Hi' + Date.now(),
      });
    },
    click2() {
      this.$store.dispatch("logUser");
    },
  },
};
</script>