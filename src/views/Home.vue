<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="testMSg">toast</v-btn>
    <br/>
  </div>
</template>


<script>
import {teams} from "@/mixins/ComputedData";
import MainTools from "@/components/user/tools/main";

export default {
  components: {MainTools},
  mixins: [teams],
  data: () => ({
    snackbar: false,
    start: null,
    end: null,
    duration: null,
  }),
  methods: {
    testMSg() {
      this.$store.dispatch('createAndDownloadXLSX')
    }
  },
};
</script>