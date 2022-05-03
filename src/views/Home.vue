<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="testMSg">toast</v-btn>
    <br/>
    <the-calendar></the-calendar>
  </div>
</template>


<script>
import {teams} from "@/mixins/ComputedData";
import TheCalendar from "@/components/TheCalendar";

export default {
  components: {TheCalendar},
  mixins: [teams],
  data: () => ({
    snackbar: false,
    start: null,
    end: null,
    duration: null,
  }),
  methods: {
    testMSg() {
      this.$store.dispatch('setMessage', {
        type: "success",
        text:
          'Ну ка ну ка а если очень длинное сообщение, например о том, что файрбэйз накрылся жопой',
      })
    }
  },
};
</script>