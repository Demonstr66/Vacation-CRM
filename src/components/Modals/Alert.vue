<template>
  <v-dialog v-model="isShow" persistent max-width="290">
    <v-card>
      <v-card-title>Внимание</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="onCancel"> Отмена </v-btn>
        <v-btn color="green darken-1" text @click="onSubmit"> ОК </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    data: {
      default: ''
    },
  },
  computed: {
    isShow: {
      get: function () {
        return this.show;
      },
      set: function (val) {},
    },
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$emit("submit", this.data);
    },
  },
};
</script>
