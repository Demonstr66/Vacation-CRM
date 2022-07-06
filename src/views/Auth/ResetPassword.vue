<template>
  <v-main>
    <v-form v-model="valid" class="text-left" @submit.prevent="onSubmit">
      <v-text-field
        v-model.trim="email"
        :rules="[blankCheck, emailCheck]"
        class="mx-3"
        hide-details="auto"
        label="Email"
        name="email"
        prepend-icon="mdi-account"
      >
        <template v-slot:prepend>
          <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
        </template>
      </v-text-field
      >
      <div class="mt-4 mx-3">
        <span>
          На страницу
          <router-link :to="{name: 'Login'}" class="text-decoration-none">
            входа
          </router-link>
        </span>
      </div>
      <div class="d-flex flex-column align-stretch mx-3 mt-4">
        <v-btn
          :disabled="!valid"
          :loading="loading"
          color="success"
          outlined
          type="submit"
        >
          Восстановить
        </v-btn>
      </div>
    </v-form>
  </v-main>
</template>

<script>
import {inputValidations} from "@/mixins/InputValidations";
import {resetPassword} from "@/mixins/AuthMethods";

export default {
  name: 'ForgetPassword',
  mixins: [inputValidations, resetPassword],
  data: () => ({
    loading: false,
    valid: false,
    email: "",
  }),
  methods: {
    onSubmit() {
      this.loading = true
      this.resetPassword(this.email)
        .then(() => {
          this.$router.push({name: 'Login'})
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
};
</script>
