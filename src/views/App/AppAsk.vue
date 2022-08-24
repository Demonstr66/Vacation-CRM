<template>
  <v-dialog v-model="isShow" max-width="400" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot></slot>
        <v-form @submit="onSubmit" v-if="!noComment">
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
        <v-btn color="red darken-1" text @click="onCancel">
          Отмена
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          type="submit"
          @click="onSubmit"> ОК
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
    noComment: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    comment: ''
  }),
  computed: {
    isShow: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit('update:show', val)
      },
    },
  },
  methods: {
    onCancel() {
      this.isShow = false
    },
    onSubmit() {
      this.$emit("submit", this.comment);
    },
  },
  watch: {
    show(val) {
      if (!val) this.comment = ''
    }
  }
};
</script>
