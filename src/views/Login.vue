<template>
  <v-form v-model="valid" @submit.prevent="onSubmit">
    <v-text-field
      label="Email"
      name="email"
      class="mx-3"
      :rules="loginRules"
      hide-details="auto"
      v-model.trim="authData.email"
      prepend-icon="mdi-account"
    >
      <template slot="prepend">
        <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
      </template>
    </v-text-field>
    <v-text-field
      label="Пароль"
      name="password"
      class="mx-3"
      :rules="passRules"
      hide-details="auto"
      v-model.trim="authData.password"
      type="password"
      prepend-icon="mdi-lock"
    >
      <template slot="prepend">
        <v-icon color="blue-grey lighten-1">mdi-lock</v-icon>
      </template></v-text-field
    >
    <div class="d-flex flex-column align-stretch mx-3 mt-2">
      <div
        class="
          mt-1
          d-flex
          flex-row
          justify-end justify-space-between
          align-center
          flex-wrap
        "
      >
        <router-link
          to="/register"
          class="text-decoration-none mt-1 justify-self-start ml-5"
          >Регистрация</router-link
        >
        <router-link
          to="/resetpassword"
          class="text-decoration-none mt-1 justify-self-end"
          >Забыли пароль?</router-link
        >
      </div>
      <v-btn
        class="mt-7"
        type="submit"
        color="success"
        outlined
        :disabled="!valid"
        :loading="loading"
      >
        Войти
      </v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    loading: false,
    authData: {
      email: "",
      password: "",
    },
    loginRules: [
      (value) => !!value || "Обязательное поле.",
      (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Некорректный email.";
      },
    ],
    passRules: [
      (value) => !!value || "Обязательное поле.",
      (value) => (value && value.length >= 6) || `Минимум 6 символов`,
    ],
  }),
  mounted() {
    if (this.$route.query.msg) {
      this.$store.dispatch("setMessage", {
        type: "success",
        code: this.$route.query.msg,
      });
    }
  },
  methods: {
    onSubmit: async function () {
      this.loading = true;
      this.$store
        .dispatch("onSignInHandler", this.authData)
        .then((res) => {
          this.$router.push("/");
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Вы успешно вошли",
          });
        })
        .catch((err) => {
          if (err.code == "auth/email-not-verify") {
            this.$router.push({
              path: "/emailsending",
              query: {
                e: err.email,
              },
            });
          }
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>