<template>
  <div width="100%">
    На Ваш email: <b>{{ FBEmail }}</b> было направлено письмо для подтверждения
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
import {FBEmail} from "@/mixins/ComputedData";
import {dispatchMethods} from "@/mixins/BaseMethods";

export default {
  name: 'EmailSending',
  mixins: [dispatchMethods, FBEmail],
  data: () => ({
    currTime: 0,
    timeout: 18000,
    interval: null,
  }),
  computed: {
    disabled() {
      return this.currTime < this.timeout
    },
    progress() {
      const {currTime, timeout} = this

      if (currTime < timeout) return this.$moment(timeout - currTime).format("mm:ss")

      this.clear()
      return ""
    },
  },
  mounted() {
    this.startTimer()
  },
  methods: {
    sendEmail() {
      this.dispatchMethodWithMessage({
        method: 'auth/sendEmailVerify',
        data: false,
        msg: 'Письмо отправлено'
      })
        .then(() => {
          this.currTime = 0
          this.startTimer()
        })
    },
    startTimer() {
      this.interval = setInterval(this.tick, 1000);
    },
    clear() {
      clearInterval(this.interval)
    },
    tick() {
      this.currTime += 1000
    },
    onGoBack() {
      this.clear()
      this.$store.dispatch('app/logOut')
      this.$router.push({name: 'Login'})
    },
  }
};
</script>
