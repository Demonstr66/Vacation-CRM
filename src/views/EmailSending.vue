<template>
  <div width="100%">
    На Ваш email: <b>{{ email }}</b> было направлено письмо для подтверждения
    регисрации.<br/>
    <v-divider/>
    <div class="mt-3">Если письмо не пришло, проверьте папку спам</div>

    <div class="d-flex flex-row justify-space-between">
      <a class="text-decoration-none" @click.prevent="onGoBack">
        На страницу входа
      </a>
      <div>
        <span v-if="disabled">
          {{ progress }}
        </span>
        <a v-else color="accent" @click.prevent="sendEmail">
          отправить повторно
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {dataMethods} from "@/mixins/dataHelper";
import {getAuth} from "firebase/auth";

export default {
  name: 'EmailSending',
  mixins: [dataMethods],
  data: () => ({
    currTime: 0,
    timeout: 180000,
    interval: null,
  }),
  computed: {
    email: function () {
      return this.$route.query.e || "";
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
    this.sendEmail()
    this.startTimer();
  },
  methods: {
    async sendEmail() {
      await this.asyncDispatchWithMessage({
        method: 'auth/sendEmailVerify',
        data: false,
        msg: 'Письмо отправлено'
      })

      this.currTime = 0;
      this.startTimer();
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
      this.clear()
      this.$store.dispatch('logOut')
      this.$router.replace({name: 'Login'})
    },
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  }
};
</script>
