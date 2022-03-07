<template>
  <v-dialog transition="dialog-top-transition" max-width="700" v-model="isShow" persistent>
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="accent" dark v-if="title != ''" class="text-h4">
          {{ title }}
        </v-toolbar>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-form @submit.prevent="onSubmit">
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="onCancel" :disabled="cancelDisable">
              {{ cancelText }}
            </v-btn>
            <v-btn color="success" text @click="onSubmit" :disabled="submitDisable">
              {{ submitText }}
            </v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: {
    result: {
      required: false
    },
    cancelText: {
      type: String,
      default: "Отмена",
    },
    cancelDisable: {
      type: Boolean,
      dafault: false
    },
    submitText: {
      type: String,
      default: "Подтвердить",
    },
    submitDisable: {
      type: Boolean,
      dafault: false
    },
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    
  }),
  computed: {
    isShow:{
      get: function() { return this.show },
      set: function(val) {}
    } 
  },
  methods: {
    onCancel() {
      this.$popup_emit("cancel")
      this.reset()
    },
    onSubmit() {
      this.$popup_emit("submit", this.result || '')
      this.reset()
    },
    reset() {
      this.$emit("reset")
    }
  },
};
</script>

<style lang="scss" scoped>
</style>