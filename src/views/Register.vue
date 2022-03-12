<template>
  <v-form v-model="valid" @submit.prevent="onSubmit">
    <v-text-field
      label="Email"
      :rules="loginRules"
      hide-details="auto"
      v-model.trim="authData.email"
      prepend-icon="mdi-email"
      class="mx-3"
    ></v-text-field>
    <v-text-field
      label="Пароль"
      :rules="passRules"
      hide-details="auto"
      v-model.trim="authData.password"
      type="password"
      class="mx-3"
      prepend-icon="mdi-form-textbox-password"
    ></v-text-field>

    <v-text-field
      label="ФИО"
      hide-details="auto"
      v-model.trim="authData.fullName"
      class="mx-3"
      prepend-icon="mdi-form-textbox"
    ></v-text-field>
    <v-text-field
      label="Workspace"
      hide-details="auto"
      v-model.trim="authData.worksapce"
      class="mx-3"
      prepend-icon="mdi-sitemap"
    ></v-text-field>
    <div class="d-flex flex-column align-stretch mx-3 mt-2">
      <small
        >Уже есть аккаунт? <router-link to="/login">Войти</router-link></small
      >
      <v-btn
        class="mt-7"
        type="submit"
        color="success"
        outlined
        :disabled="!valid"
        :loading="loading"
        >Подтвердить</v-btn
      >
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
      fullName: "",
      worksapce: "",
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
    onSubmit: async function () {
      this.loading = true;
      this.$store
        .dispatch("createUser", this.authData)
        .then((res) => {
          this.$router.push({
            path: "/emailsending",
            query: { u: this.$store.getters.getUser.uid },
          });
        })
        .catch((err) => {
          this.$store.commit("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>