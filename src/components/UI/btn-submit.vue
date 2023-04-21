<template>
  <v-btn :block="block" :disabled="disabled" color="success" text type="submit" @click="$emit('click')">
    {{ text }}
  </v-btn>
</template>
<script>
export default {
  name: 'btn-submit',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "Сохранить"
    }
  }
}
</script>