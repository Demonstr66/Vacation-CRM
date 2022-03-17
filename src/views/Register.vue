<template>
  <v-form v-model="valid" @submit.prevent="onSubmit">
    <v-text-field
      label="Email"
      name="email"
      :rules="[rules.req, rules.email]"
      hide-details="auto"
      v-model.trim="authData.email"
      prepend-icon=""
      class="mx-3"
    >
      <template slot="prepend">
        <v-icon>mdi-email</v-icon>
        <span class="error--text">*</span>
      </template>
    </v-text-field>
    <v-text-field
      label="Пароль"
      :rules="[rules.req, rules.pass]"
      hide-details="auto"
      v-model.trim="authData.password"
      name="password"
      type="password"
      class="mx-3"
    >
      <template slot="prepend">
        <v-icon>mdi-form-textbox-password</v-icon>
        <span class="error--text">*</span>
      </template>
    </v-text-field>

    <v-text-field
      label="ФИО"
      hide-details="auto"
      v-model.trim="authData.fullName"
      name="fullname"
      class="mx-3"
    >
      <template slot="prepend">
        <v-icon>mdi-form-textbox</v-icon>
        <span style="opacity: 0">*</span>
      </template>
    </v-text-field>
    <div class="group d-flex flex-column align-stretch text-center mx-3 mt-8">
      <span class="label ml-3 px-2"
        >Пространство
        <span class="error--text">*</span>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="accent" class="ml-2" dark v-bind="attrs" v-on="on">
              mdi-help-circle-outline
            </v-icon>
          </template>
          <span>
            Создайте своё Пространство, чтобы начать управлять отпусками,<br />
            или же присоединйятесь к существующему!
          </span>
        </v-tooltip>
      </span>

      <v-text-field class="d-none" :rules="[rules.req]" v-model="workspace">
      </v-text-field>
      <v-text-field
        label="Ввести существующее"
        :success="!!existWorkspace"
        hide-details="auto"
        v-model.trim="existWorkspace"
        class="mx-3"
        prepend-icon="mdi-sitemap"
        dense
      ></v-text-field>
      <span class="my-2">ИЛИ</span>
      <v-btn
        :color="newWorkspace ? 'success' : 'grey'"
        @click="newWorkspace = !newWorkspace"
        v-model="newWorkspace"
        text
      >
        <v-icon class="mr-3">{{
          newWorkspace
            ? "mdi-checkbox-marked-circle-outline"
            : "mdi-checkbox-blank-circle-outline"
        }}</v-icon>
        Создать новое
      </v-btn>
    </div>

    <div class="d-flex flex-column align-stretch mx-3 mt-7">
      <small
        >Уже есть аккаунт? <router-link to="/login">Войти</router-link></small
      >
      <v-btn
        class="mt-2"
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
const short = require("short-uuid");

export default {
  data: () => ({
    newWorkspace: false,
    existWorkspace: "",
    valid: false,
    loading: false,
    authData: {
      email: "",
      password: "",
      fullName: "",
      workspace: "",
      role: "",
    },
    rules: {
      req: (value) => !!value || "Обязательное поле.",
      pass: (value) => (value && value.length >= 5) || `Минимум 5 символов`,
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Некорректный e-mail.";
      },
    },
  }),
  computed: {
    workspace: function () {
      let res = this.existWorkspace || (this.newWorkspace ? short().new() : "");

      this.authData.workspace = res;

      return res;
    },
  },
  methods: {
    onSubmit: async function () {
      this.loading = true;
      this.$store
        .dispatch("registerHandler", { user: this.authData, workspace: {
          id: this.authData.workspace,
          isNew: this.newWorkspace
        } })
        .then((res) => {
          this.$router.push({
            path: "/emailsending",
            query: {
              u: this.$store.getters.getUser.uid,
              e: this.$store.getters.getUser.email,
            },
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
  watch: {
    existWorkspace: function (val) {
      if (val != "") this.newWorkspace = false;
    },
    newWorkspace: function (val) {
      if (val) this.existWorkspace = "";
      this.authData.role = val ? "admin" : "user";
    },
  },
};
</script>

<style lang="scss" scoped>
.group {
  border: thin solid #bdbdbd;
  border-radius: 4px;
  margin-top: 32px;

  & .label {
    transition: translate-y(-100%);
    transform: translateY(-50%) translateX(23px);
    background-color: white;
    width: fit-content;
  }
}
</style>