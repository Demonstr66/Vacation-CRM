<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="click">open</v-btn>
  </div>
</template>




<script>
export default {
  data: () => ({
    snackbar: false,
  }),
  methods: {
    click() {
      this.$store.dispatch("updateUser");
    },
  },
};
</script>