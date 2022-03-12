<template>
  <v-main>
    <v-form v-model="valid" @submit.prevent="onSubmit">
      <v-text-field
        label="Email"
        class="mx-3"
        :rules="loginRules"
        hide-details="auto"
        v-model.trim="email"
        prepend-icon="mdi-account"
      ></v-text-field>
      <div class="d-flex flex-column align-stretch mx-3 mt-2">
        <v-btn
          class="mt-7"
          type="submit"
          color="success"
          outlined
          :disabled="!valid"
        >
          Восстановить
        </v-btn>
      </div>
    </v-form>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    email: "",
    loginRules: [
      (value) => !!value || "Обязательное поле.",
      (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Некорректный e-mail.";
      },
    ],
  }),
  methods: {
    onSubmit() {
      this.$store
        .dispatch("resetPassword", this.email)
        .then(() => {
          this.$store.commit("setMessage", {
            type: "success",
            text: "На указанный email отправлено письмо для восстановления",
          });
          this.$router.push('/login')
        })
        .catch((err) => {
          this.$store.commit("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        });
    },
  },
};
</script>
