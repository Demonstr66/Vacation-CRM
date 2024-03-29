<template>
  <v-form v-model="valid" @submit.prevent="onSubmit">
    <v-text-field
      v-model.trim="authData.email"
      :rules="[blankCheck, emailCheck]"
      autocomplete="username"
      class="mx-3"
      hide-details="auto"
      label="Email"
      name="email"
    >
      <template v-slot:prepend>
        <v-icon color="blue-grey lighten-1">mdi-email</v-icon>
        <span class="error--text">*</span>
      </template>
    </v-text-field>
    <v-text-field
      v-model.trim="authData.password"
      :rules="[blankCheck, minChars(6)]"
      :type="isPassVisible ? 'text' :'password'"
      autocomplete="current-password"
      class="mx-3"
      hide-details="auto"
      label="Пароль"
      name="password"
    >
      <template v-slot:prepend>
        <v-icon color="blue-grey lighten-1">mdi-form-textbox-password</v-icon>
        <span class="error--text">*</span>
      </template>
      <template v-slot:append>
        <v-btn icon @click="isPassVisible = !isPassVisible">
          <v-icon v-if="!isPassVisible" color="blue-grey lighten-1">mdi-eye</v-icon>
          <v-icon v-else color="blue-grey lighten-1">mdi-eye-off</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-text-field
      v-if="!predefineUser"
      v-model.trim="authData.fullName"
      :rules="[blankCheck, fioCheck]"
      autocomplete="name"
      class="mx-3"
      hide-details="auto"
      label="ФИО"
      name="fullName"
    >
      <template v-slot:prepend>
        <v-icon color="blue-grey lighten-1">mdi-form-textbox</v-icon>
        <span class="error--text">*</span>
      </template>
    </v-text-field>
    <div
      v-if="!predefineUser"
      class=" group d-flex flex-column align-stretch text-center mx-3 mt-8 pa-3"
    >
      <span class="label pl-2">
        Пространство
        <span class="error--text">*</span>
        <icon-btn-with-tip btn-class="ml-2" icon="mdi-help-circle-outline">
          Пространство объединяет пользователей для совместного управления отпусками<br>
          Вы можете создать своё пространство или ввести код существующего!
        </icon-btn-with-tip>
      </span>
      <v-radio-group
        v-model="isNewWS"
        class="mb-3"
        dense
        hide-details
        row
      >
        <v-radio :value="true" label="Создать новое"></v-radio>
        <v-radio :value="false" label="У меня есть код"></v-radio>
      </v-radio-group>
      <v-expand-transition>
        <v-text-field
          v-if="!isNewWS"
          v-model.trim="authData.workspace"
          :rules="[blankCheck]"
          :success="!!authData.workspace"
          class="mx-3"
          dense
          hide-details
          label="Код пространства"
          prepend-icon="mdi-sitemap"
        >
          <template v-slot:prepend>
            <v-icon color="blue-grey lighten-1">mdi-sitemap</v-icon>
          </template>
        </v-text-field>
      </v-expand-transition>
    </div>

    <div class="d-flex flex-column align-stretch mx-3 mt-3">
      <span class="align-self-center">
        Уже есть аккаунт?
        <router-link
          :to="{name: 'Login'}"
          class="text-decoration-none"
        >
          Войти
        </router-link>
      </span>
      <v-btn
        :disabled="!valid"
        :loading="loading"
        class="mt-4"
        color="success"
        outlined
        type="submit"
      >
        Подтвердить
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {register} from "@/mixins/AuthMethods";
import {fullToDisplayName} from "@/plugins/utils";

const short = require("short-uuid");

export default {
  name: 'Register',
  components: {IconBtnWithTip},
  mixins: [inputValidations, register],
  data: () => ({
    isPassVisible: false,
    predefineUser: false,
    isNewWS: true,
    valid: false,
    loading: false,
    authData: {
      uid: null,
      email: "",
      password: "",
      fullName: "",
      workspace: "",
      role: "",
    },
  }),
  created() {
    if (this.$route.query.u && this.$route.query.ws) {
      this.authData.uid = this.$route.query.u
      this.authData.workspace = this.$route.query.ws

      this.predefineUser = true
      this.isNewWS = false

      if (this.$route.query.e) {
        this.authData.email = this.$route.query.e
      }
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const {fullName, workspace: wid} = this.authData
      const isNewWS = this.isNewWS

      const user = {
        ...this.authData,
        displayName: fullToDisplayName(fullName),
        templateName: fullName,
        role: isNewWS ? "owner" : "user",
        level: isNewWS ? 0 : 1,
        parent: ''
      };
      const workspace = {
        id: isNewWS ? short().new() : wid,
        isNew: isNewWS,
      }

      await this.register({user, workspace})

      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.v-input--radio-group__input {
  justify-content: space-around;
}

.group {
  position: relative;
  border: thin solid #bdbdbd;
  border-radius: 4px;
  margin-top: 32px;

  & .label {
    position: absolute;
    top: -18px;
    left: 30px;
    background-color: white;
    width: fit-content;
  }
}
</style>