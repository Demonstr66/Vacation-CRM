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
    <!--    <v-text-field-->
    <!--      v-model.trim="authData.password"-->
    <!--      :rules="[minChars(6), blankCheck]"-->
    <!--      :type="visiblePassword ? 'text' :'password'"-->
    <!--      autocomplete="current-password"-->
    <!--      hide-details="auto"-->
    <!--      label="Пароль"-->
    <!--      name="password"-->
    <!--      prepend-icon="mdi-lock"-->
    <!--    >-->
    <!--      <template v-slot:prepend>-->
    <!--        <v-icon color="blue-grey lighten-1">mdi-lock</v-icon>-->
    <!--      </template>-->
    <!--      <template v-slot:append>-->
    <!--        <v-btn icon @click="visiblePassword = !visiblePassword">-->
    <!--          <v-icon v-if="!visiblePassword" color="blue-grey lighten-1">mdi-eye</v-icon>-->
    <!--          <v-icon v-else color="blue-grey lighten-1">mdi-eye-off</v-icon>-->
    <!--        </v-btn>-->
    <!--      </template>-->
    <!--    </v-text-field-->
    <!--    >-->
    <v-checkbox
      v-model="authData.remember" class="ml-7" dense hide-details label="Запомнить меня">
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
        >
          Регистрация
        </router-link>
        <router-link
          :to="{name: 'Reset'}"
          class="text-decoration-none mt-1 justify-self-end"
        >
          Забыли пароль?
        </router-link>
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
import {inputValidations} from "@/mixins/InputValidations";
import {logIn} from "@/mixins/AuthMethods";
import {Message} from "@/plugins/servises/Message";

export default {
  name: 'LoginByLink',
  mixins: [logIn, inputValidations],
  data: () => ({
    visiblePassword: false,
    valid: false,
    loading: false,
    authData: {
      email: "",
      remember: true
    },
  }),
  methods: {
    async onSubmit() {
      try {
        this.loading = true;
        await this.$store.dispatch('FB/remember', {remember: this.authData.remember})
        await this.$store.dispatch('FB/singInWithLink', {email: this.authData.email})
        this.$router.push({name: 'Home'})
      } catch (e) {
        Message.errorMessage(e)
      } finally {
        this.loading = true;
      }
    },
  },
};
</script>