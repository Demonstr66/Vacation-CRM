<template>
  <div>
    <span> Welcome! </span>
    <v-btn @click="click">open</v-btn>
    <br />
    <div>
      <div>Сарт: {{ start }}</div>
      <div>Конец: {{ end }}</div>
      <div>Продолжительность: {{ duration }}</div>
    </div>
  </div>
</template>




<script>
export default {
  data: () => ({
    snackbar: false,
    start: null,
    end: null,
    duration: null,
  }),
  methods: {
    async click() {
      this.start = this.$moment();
      this.$store
        .dispatch("fetchAllData")
        .then((data) => {
          this.end = this.$moment();
          this.duration = this.end - this.start;
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>