<template>
  <v-dialog
    v-model="isShow"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :max-width="large ? 1000 : 700"
    persistent
    transition="dialog-top-transition"
  >
    <template v-slot:default>
      <v-card style="z-index: 10000 !important">
        <v-toolbar
          v-if="title !== ''"
          class="text-h4"
          color="accent"
          dark
        >
          <span>
            {{ title }}
          </span>
        </v-toolbar>
        <v-card-text>
          <slot/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-form @submit.prevent="onSubmit">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="cancelDisable"
              color="error"
              text
              @click="onCancel"
            >
              {{ cancelText }}
            </v-btn>
            <v-btn
              :disabled="submitDisable"
              :loading="submiting"
              color="success"
              text
              @click="onSubmit"
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
import IconBtnWithTip from "../IconBtnWithTip.vue"

export default {
  name: "AppBaseModal",
  CONTROLLER: null,
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
    submiting: {
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
    large: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    open() {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      this.isShow = true
      this.$options.CONTROLLER = {resolve, reject}
      return result
    },
    close() {
      this.isShow = false
      this.reset()
    },
    onCancel() {
      this.$options.CONTROLLER.reject()
    },
    onSubmit() {
      this.$options.CONTROLLER.resolve()
    },
    reset() {
      this.$nextTick(() => {
        this.$emit("reset")
      })
    },
  },
  provide() {
    return {
      open: this.open,
      close: this.close
    }
  },
}
</script>
