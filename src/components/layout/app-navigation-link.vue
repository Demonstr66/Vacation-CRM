<template>
  <v-list-item
      :to="{name: link.path}"
      link
  >
    <v-list-item-icon v-if="link.icon">
      <v-icon>
        {{ link.icon }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-title>
      {{ link.title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: "app-navigation-link",
  props: {
    link: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.path && value.title
      }
    }
  }
}
</script>

<style scoped>

</style>