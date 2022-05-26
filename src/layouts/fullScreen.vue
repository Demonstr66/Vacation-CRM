<template>
  <v-container class="fill-height bggrad mx-0 container--fluid justify-center">
   <router-view />
  </v-container>
</template>

<script>
export default {
  props: {
    title: String,
  },
  data: () => ({
  }),
  methods: {
    console(val) {
      console.log(val)
    }
  }
};
</script>



<style>
.bggrad {
  background-color: #97cfdb;
  background: linear-gradient(335deg, #e0e18b, #97cfdb);
}
</style>
