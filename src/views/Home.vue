<template>
    <layout title="Личный кабинет">
        Welcome!
        <v-btn @click="tryAdd">Try</v-btn>
    </layout>
</template>




<script>
import layout from "../layouts/Main.vue";

export default {
  components: {
    layout,
  },
  methods: {
    async tryAdd() {
      this.$store.dispatch('addPersonsToBase', [{fullName:'aaa'}, {fullName:'bbb'},{fullName:'ccc'},])
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }
  }
};
</script>