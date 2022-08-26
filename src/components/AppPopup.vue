<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot></slot>
        <v-form @submit="submit" v-if="showComment">
          <v-textarea
            v-model="comment"
            class="mt-2"
            hide-details
            no-resize
            placeholder="Комментарий"
            solo
          >

          </v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="close"> Отмена</v-btn>
        <v-btn color="green darken-1" type="submit" text @click="submit"
               :disabled="submitDisable"> ОК
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  PopupController: null,
  props: {
    title: {
      type: String,
      default: "Внимание"
    },
    submitDisable: {
      type: Boolean,
      default: false
    },
    showComment: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false,
    comment: ""
  }),
  methods: {
    open() {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      this.show = true
      this.$options.PopupController = {resolve, reject}
      return result
    },
    close() {
      this.show = false
      this.$options.PopupController.resolve(false)
    },
    submit() {
      this.show = false
      this.$options.PopupController.resolve(this.comment || true)
    },
  },
  watch: {
    show(val) {
      if (!val) this.comment = ''
    }
  }
};
</script>

