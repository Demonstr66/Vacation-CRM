<template>
  <v-dialog v-model="isShow" max-width="400" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="onCancel"> Отмена</v-btn>
        <v-btn color="green darken-1" type="submit" text @click="onSubmit"
               :disabled="submitDisable"> ОК
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Внимание"
    },
    show: {
      type: Boolean,
      required: true,
    },
    submitDisable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get: function () {
        return this.show;
      },
      set: function (val) {
      },
    },
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$emit("submit");
    },
  },
};
</script>
