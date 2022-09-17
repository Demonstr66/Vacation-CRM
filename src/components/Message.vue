<template>
  <v-snackbars
    :objects.sync="messages"
    outlined
    right
    top
    :class="{'v-snack__small': $vuetify.breakpoint.xsOnly}"
  >
    <template v-slot:action="{ close }">
      <v-btn text @click="close()" class="pa-0">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbars>
</template>

<script>
import VSnackbars from "v-snackbars";

export default {
  name: "Message",
  components: {
    "v-snackbars": VSnackbars,
  },
  computed: {
    messages: {
      get: function () {
        return this.$store.getters['messages']
      },
      set: function (v) {
        return this.$store.commit('setMessages', v)
      }
    }
  }
};
</script>
<style>
.v-snack__wrapper {
  max-width: 400px;
}

.v-snack__small .v-snack__wrapper {
  min-width: 80vw;
}

.v-snack__small .v-snack__content {
  padding-right: 0;
}
</style>