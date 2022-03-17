<template>
  <v-snackbar
    v-model="isMessage"
    timeout="2000"
    top
    right
    outlined
    :color="message.type"
  >
    {{ message.text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="isMessage = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { dictionary } from "../plugins/utils.js";

export default {
  name: "Message",
  data: () => ({
    isMessage: false,
    message: {
      text: "",
      type: "",
    },
  }),
  computed: {
    msg() {
      return this.$store.getters.isMessage;
    },
  },
  watch: {
    msg: function (val) {
      this.isMessage = val;

      if (!val) return;

      const msg = this.$store.getters.message;

      this.message.text =
        dictionary[msg.code] || msg.text || "Неизвестная ошибка";

      this.message.type = msg.type;
      if (msg.type == "error")
        this.message.text = "[Ошибка]: " + this.message.text;
    },
    isMessage: function (val) {
      if (val) return;

      setTimeout(
        function () {
          this.$store.commit("clearMessage");
        }.bind(this),
        500
      );
    },
  },
};
</script>