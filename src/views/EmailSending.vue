<template>
  <v-main>
    На Ваш email: {{ email }} было направлено письмо для подтверждения
    регисрации.<br />
    Пожалуйста, следуйте инструкциям в письме.
    <v-divider />
    <small
      >Если письмо не пришло, проверьте папку спам или Вы можете
      <v-btn
        x-small
        :disabled="disabled"
        text
        @click.prevent="sendEmail"
        color="accent"
        >отправить</v-btn
      >
      письмо повторно
      {{ progress }}
    </small>
  </v-main>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    currTime: 0,
    timeout: 180000,
    interval: null,
  }),
  computed: {
    email: function () {
      return "123";
    },
    disabled() {
      return this.currTime < this.timeout;
    },
    progress() {
      if (this.currTime >= this.timeout) {
        this.clear();
        return "";
      }

      let time = moment(this.timeout - this.currTime).format("mm:ss");

      return `через ${time}`;
    },
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    sendEmail() {
      this.$store
        .dispatch("verifyEmail")
        .then(() => {
          this.currTime = 0;
          this.startTimer();
          this.$store.commit("setMessage", {
            type: "success",
            text: "Письмо отправлено",
          });
        })
        .catch((err) => {
          this.$store.commit("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        });
    },
    startTimer() {
      this.interval = setInterval(this.tick, 1000);
    },
    clear() {
      clearInterval(this.interval);
    },
    tick() {
      this.currTime += 1000;
    },
  },
};
</script>
