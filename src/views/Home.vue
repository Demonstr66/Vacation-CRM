<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="Test1">Test1</v-btn>
    <v-btn @click="Test2">logUser</v-btn>
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
    async Test1() {
      this.$store.dispatch("workspace/storage/generate", {
        fullName: 'Филиппов Дмитрий Олегович',
        post: 'Старший спец',
        date: 'сегодня',
        vstart: 'завтра',
        vend: 'послезавтра',
        vdays: '2',
      });
    },
    Test2() {
      this.$store.dispatch("logUser");
    },
  },
};
</script>