<template>
  <div width="100%">
    На Ваш email: <b>{{ email }}</b> было направлено письмо для подтверждения
    регисрации.<br />
    <v-divider />
    <div class="mt-3">Если письмо не пришло, проверьте папку спам</div>

    <div class="d-flex flex-row justify-space-between">
      <a @click.prevent="onGoBack" class="text-decoration-none">
        На страницу входа
      </a>
      <div>
        <span v-if="disabled">
          {{ progress }}
        </span>
        <a v-else @click.prevent="sendEmail" color="accent">
          отправить повторно
        </a>
      </div>
    </div>
  </div>
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
      return this.$route.query.e || "123@123.ru";
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

      return `${time}`;
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
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Письмо отправлено",
          });
        })
        .catch((err) => {
          this.$store.dispatch("setMessage", {
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
    onGoBack() {
      this.$store
        .dispatch("signOut")
        .then(() => {
          this.$router.push("/login");
        })
        .catch((err) => {
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        });
    },
  },
};
</script>
