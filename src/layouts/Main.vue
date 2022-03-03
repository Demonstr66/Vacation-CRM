<template>
<v-container class="mx-16 mt-8">
  <span class="text-h3 ml-1 mb-1">{{title}}</span>
  <v-sheet color="white" elevation="2" width="90%" class="px-3 py-3" min-height="100px">
    <slot />
  </v-sheet>
  </v-container>
</template>

<script>

export default {
  props: {
    title: String
  }
}
</script>
