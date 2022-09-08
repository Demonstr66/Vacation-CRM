<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot :data="data" :setResData="setResData" :setSubmitDisable="setSubmitDisable"></slot>
        <v-form v-if="showComment" @submit="submit">
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
        <v-btn :disabled="submitDisable" color="green darken-1" text type="submit"
               @click="submit"> ОК
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
    showComment: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    submitDisable: false,
    show: false,
    comment: "",
    data: {},
    resData: {}
  }),
  methods: {
    open(data) {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      if (data) this.data = data
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
      this.$options.PopupController.resolve({
        val: true,
        comment: this.comment,
        data: this.resData
      })
    },
    setResData(key, val) {
      this.resData[key] = val
    },
    setSubmitDisable(val) {
      console.log(val)
      this.submitDisable = val
    }
  },
  watch: {
    show(val) {
      if (!val) this.comment = ''
      if (!val) this.resData = {}
      if (!val) this.data = null
    }
  }
};
</script>

