<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="testMSg">toast</v-btn>
    <br/>
  </div>
</template>


<script>
import {teams} from "@/mixins/ComputedData";

export default {
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