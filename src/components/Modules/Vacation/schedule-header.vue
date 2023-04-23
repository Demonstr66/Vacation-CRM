<template>
  <app-base-sheet class="d-flex flex-column justify-center">
    <span class="display-1 ml-2" v-if="title">{{ title }}</span>
    <div
        v-if="editable !== undefined"
        :class="status.class"
        class="caption ml-1"
        v-text="status.text"
    >
    </div>
  </app-base-sheet>
</template>
<script>
import AppBaseSheet from "@/components/UI/app-base-sheet"

export default {
  name: 'schedule-header',
  components: {AppBaseSheet},
  props: {
    title: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: undefined
    }
  },
  computed: {
    status() {
      return {
        class: !this.editable ? 'error--text' : 'info--text',
        text: !this.editable ? 'Редактирование не доступно' : 'Доступно для редактирования'
      }
    },
  }
}
</script>