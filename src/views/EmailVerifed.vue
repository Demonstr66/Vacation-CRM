<template>
  <v-main>
    Емейл успешно подтверждён!
    <small
      >Через несколько секунд вы будете перенаправлены на главную страницу.<br />Если
      этого не произошло, нажмите
      <router-link :to="to">далее</router-link></small
    >

    <v-progress-linear :value="progress"></v-progress-linear>
  </v-main>
</template>

<script>
export default {
  mounted() {
    this.autoRedirect();
  },
  data: () => ({
    currTime: 0,
    timeout: 3000,
    to: "/",
    interval: null,
  }),
  computed: {
    progress() {
      return parseInt((this.currTime * 100) / this.timeout);
    },
  },
  methods: {
    autoRedirect() {
      this.interval = setInterval(this.tick, 10);

      setTimeout(this.redirect, this.timeout);
    },
    redirect() {
      this.$router.push(this.to);
    },
    tick() {
      this.currTime += 10;
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
