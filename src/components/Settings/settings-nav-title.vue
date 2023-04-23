<template>
  <v-list-item-title>
    {{ title }}
  </v-list-item-title>
</template>

<script>
export default {
  name: "account-nav-title",
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>