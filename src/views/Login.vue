<template>
  <v-form v-model="valid" class="px-3" @submit.prevent="onSubmit">
    <v-text-field
      v-model.trim="authData.email"
      :rules="[blankCheck, emailCheck]"
      autocomplete="username"
      hide-details="auto"
      label="Email"
      name="email"
      prepend-icon="mdi-account"
    >
      <template v-slot:prepend>
        <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
      </template>
    </v-text-field>
    <v-text-field
      v-model.trim="authData.password"
      :rules="[min5char, blankCheck]"
      autocomplete="current-password"
      hide-details="auto"
      label="Пароль"
      name="password"
      prepend-icon="mdi-lock"
      :type="isPassVisible ? 'text' :'password'"
    >
      <template v-slot:prepend>
        <v-icon color="blue-grey lighten-1">mdi-lock</v-icon>
      </template>
      <template v-slot:append>
        <v-btn icon @click="isPassVisible = !isPassVisible">
          <v-icon v-if="!isPassVisible" color="blue-grey lighten-1">mdi-eye</v-icon>
          <v-icon v-else color="blue-grey lighten-1">mdi-eye-off</v-icon>
        </v-btn>
      </template>
    </v-text-field
    >
    <v-checkbox
      v-model="authData.remember" class="ml-7" dense hide-details label="Запонить меня">
    </v-checkbox>
    <div class="d-flex flex-column align-stretch mt-2">
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
          :to="{name: 'Register'}"
          class="text-decoration-none mt-1 justify-self-start ml-5"
        >Регистрация
        </router-link
        >
        <router-link
          :to="{name: 'Reset'}"
          class="text-decoration-none mt-1 justify-self-end"
        >Забыли пароль?
        </router-link
        >
      </div>
      <v-btn
        :disabled="!valid"
        :loading="loading"
        class="mt-7"
        color="success"
        outlined
        type="submit"
      >
        Войти
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import {accountMethods} from "@/mixins/AccountMethods";
import {inputRules} from "@/mixins/inputRules";
import {getAuth} from "firebase/auth";

export default {
  name: 'Login',
  mixins: [accountMethods, inputRules],
  data: () => ({
    isPassVisible: false,
    valid: false,
    loading: false,
    authData: {
      email: "",
      password: "",
      remember: true
    },
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
    async onSubmit() {
      this.loading = true;
      await this.mixSignIn(this.authData)
      this.loading = false;
    },
  },
};
</script>