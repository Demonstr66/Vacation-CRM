<template>
  <v-container class="fill-height">
    <v-card elevation="8" min-width="300px" class="mx-auto my-auto">
      <v-card-title>Авторизация</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="onSubmit">
          <v-text-field
            label="Логин"
            :rules="loginRules"
            hide-details="auto"
            v-model="authData.login"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            :rules="passRules"
            hide-details="auto"
            v-model="authData.pass"
          ></v-text-field>

          <v-btn class="mx-auto mt-3 light-green accent-1" type="submit" :disabled="!valid">Войти</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    authData: {
      login: '',
      pass: ''
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
  }),
  methods: {
    onSubmit: function() {
      localStorage.setItem('user', 'true')
      this.$router.push('/')
    }
  }
};
</script>