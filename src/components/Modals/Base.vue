<template>
  <v-dialog
      :fullscreen="$vuetify.breakpoint.smAndDown"
      transition="dialog-top-transition"
      :max-width="large ? 1000 : 700"
      v-model="isShow"
      persistent
  >
    <template v-slot:default>
      <v-card style="z-index: 10000 !important">
        <v-toolbar
            color="deep-purple accent-2"
            dark
            v-if="title != ''"
            class="text-h4"
        >
          <span>{{ title }}</span>
        </v-toolbar>
        <v-card-text>
          <slot/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-form @submit.prevent="onSubmit">
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                text
                @click="onCancel"
                :disabled="cancelDisable"
            >
              {{ cancelText }}
            </v-btn>
            <v-btn
                color="success"
                text
                @click="onSubmit"
                :disabled="submitDisable"
            >
              {{ submitText }}
            </v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import IconBtnWithTip from "../IconBtnWithTip.vue";

export default {
  components: {IconBtnWithTip},
  props: {
    result: {
      required: false,
    },
    cancelText: {
      type: String,
      default: "Отмена",
    },
    cancelDisable: {
      type: Boolean,
      default: false,
    },
    submitText: {
      type: String,
      default: "Подтвердить",
    },
    submitDisable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      required: true,
    },
    large: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({}),
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
      this.reset();
    },
    onSubmit() {
      this.$emit("submit", this.result || "");
    },
    reset() {
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>