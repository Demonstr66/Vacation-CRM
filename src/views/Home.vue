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
import { teams } from "../mixins/computedData";

export default {
  mixins: [teams],
  data: () => ({
    snackbar: false,
    start: null,
    end: null,
    duration: null,
  }),
  methods: {
    async click() {
      // this.$store.dispatch("workspace/db/test");
      console.log(this.teams)
    },
    click2() {
      this.$store.dispatch("logUser");
    },
  },
};
</script>