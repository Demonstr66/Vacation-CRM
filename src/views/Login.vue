<template>
  <v-form v-model="valid" @submit.prevent="onSubmit">
    <v-text-field
      label="Email"
      class="mx-3"
      :rules="loginRules"
      hide-details="auto"
      v-model.trim="authData.email"
      prepend-icon="mdi-account"
    ></v-text-field>
    <v-text-field
      label="Пароль"
      class="mx-3"
      :rules="passRules"
      hide-details="auto"
      v-model.trim="authData.password"
      type="password"
      prepend-icon="mdi-form-textbox-password"
    ></v-text-field>
    <div class="d-flex flex-column align-stretch mx-3 mt-2">
      <div class="mt-1 d-flex flex-row justify-end justify-md-space-between align-center flex-wrap">
        <small class="mr-2">
          Нет аккаунта?
          <router-link to="/register">Зарегистрируйтесь</router-link> прямо
          сейчас! </small
        >
        <router-link to="/resetpassword" class="text-decoration-none mt-1 justify-self-end">Забыли пароль?</router-link>
      </div>
      <v-btn
        class="mt-7"
        type="submit"
        color="success"
        outlined
        :disabled="!valid"
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
    authData: {
      email: "",
      password: "",
    },
    loginRules: [
      (value) => !!value || "Обязательное поле.",
      (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Некорректный e-mail.";
      },
    ],
    passRules: [
      (value) => !!value || "Обязательное поле.",
      (value) => (value && value.length >= 5) || `Минимум 5 символов`,
    ],
  }),mounted() {

      console.log(this.$vuetify.breakpoint.width)
  },
  methods: {
    onSubmit: async function () {
      this.$store
        .dispatch("signInByEmailAndPassword", this.authData)
        .then((res) => {
          this.$router.push("/");
          this.$store.commit("setMessage", {
            type: "success",
            text: "Вы успешно вошли",
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
  },
};
</script>